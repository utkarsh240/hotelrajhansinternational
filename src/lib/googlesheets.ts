import crypto from "crypto";
import { formatDate } from "./utils";

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "";

interface GoogleSheetsToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: GoogleSheetsToken | null = null;

function base64UrlEncode(str: string | Buffer): string {
  const buf = typeof str === "string" ? Buffer.from(str, "utf-8") : str;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Obtains an OAuth2 Access Token for Google Sheets API using Service Account RSA Signing
 */
async function getGoogleAccessToken(): Promise<string | null> {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    return null;
  }

  // Return cached token if valid for at least 60 seconds
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claimSet = base64UrlEncode(
      JSON.stringify({
        iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      })
    );

    const signatureInput = `${header}.${claimSet}`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(signatureInput);
    const signature = signer.sign(GOOGLE_PRIVATE_KEY, "base64url");

    const jwtAssertion = `${signatureInput}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtAssertion,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Google Access Token Error:", errText);
      return null;
    }

    const tokenData = await res.json();
    cachedToken = {
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    };

    return cachedToken.accessToken;
  } catch (error) {
    console.error("Failed to generate Google Service Account Token:", error);
    return null;
  }
}

export interface BookingSheetRowData {
  bookingReference: string;
  bookingDate: Date | string;
  customerName: string;
  phone: string;
  email?: string | null;
  roomName: string;
  checkIn: Date | string;
  checkOut: Date | string;
  guestsCount: number;
  netAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

/**
 * Synchronizes a confirmed booking to Google Sheets (Tab: 'Bookings')
 * Idempotent: Skips if booking reference already exists in Sheet.
 */
export async function syncBookingToGoogleSheet(
  data: BookingSheetRowData
): Promise<{ success: boolean; duplicated?: boolean }> {
  try {
    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.log(`[GOOGLE SHEETS SIMULATION] Synced Booking Ref: ${data.bookingReference}`);
      return { success: true };
    }

    const token = await getGoogleAccessToken();
    if (!token) {
      console.warn("Skipping Google Sheets Sync: Failed to obtain access token");
      return { success: false };
    }

    const range = "Bookings!A:L";

    // 1. Fetch existing Column A (Booking IDs) to prevent duplicates
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Bookings!A:A`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (checkRes.ok) {
      const existingData = await checkRes.json();
      const existingRows: string[][] = existingData.values || [];
      const isAlreadySynced = existingRows.some(
        (row) => row[0] && row[0].trim() === data.bookingReference.trim()
      );

      if (isAlreadySynced) {
        console.log(`Google Sheets Sync Notice: ${data.bookingReference} already exists in Sheet. Skipping.`);
        return { success: true, duplicated: true };
      }
    }

    // 2. Format row data according to required columns:
    // [Booking ID, Booking Date, Guest Name, Phone, Email, Room, Check-in, Check-out, Guests, Amount, Payment Status, Booking Status]
    const rowValues = [
      data.bookingReference,
      formatDate(data.bookingDate),
      data.customerName,
      data.phone,
      data.email || "N/A",
      data.roomName,
      formatDate(data.checkIn),
      formatDate(data.checkOut),
      data.guestsCount,
      data.netAmount,
      data.paymentStatus,
      data.bookingStatus,
    ];

    // 3. Append row via Google Sheets API v4
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );

    if (!appendRes.ok) {
      const errBody = await appendRes.text();
      console.error(`Google Sheets Append Error for ${data.bookingReference}:`, errBody);
      return { success: false };
    }

    console.log(`Successfully synced booking ${data.bookingReference} to Google Sheets`);
    return { success: true };
  } catch (error) {
    console.error("Google Sheets Sync Exception:", error);
    return { success: false };
  }
}

export interface InquirySheetRowData {
  id: string;
  createdAt: Date | string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string;
}

/**
 * Synchronizes contact form inquiries to Google Sheets (Tab: 'Inquiries')
 */
export async function syncInquiryToGoogleSheet(
  data: InquirySheetRowData
): Promise<{ success: boolean; duplicated?: boolean }> {
  try {
    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.log(`[GOOGLE SHEETS SIMULATION] Synced Inquiry ID: ${data.id}`);
      return { success: true };
    }

    const token = await getGoogleAccessToken();
    if (!token) return { success: false };

    const range = "Inquiries!A:G";

    // 1. Check duplicate Inquiry ID
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Inquiries!A:A`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (checkRes.ok) {
      const existingData = await checkRes.json();
      const existingRows: string[][] = existingData.values || [];
      const isAlreadySynced = existingRows.some(
        (row) => row[0] && row[0].trim() === data.id.trim()
      );

      if (isAlreadySynced) {
        return { success: true, duplicated: true };
      }
    }

    // 2. Format Inquiry row: [Inquiry ID, Date, Name, Email, Phone, Message, Status]
    const rowValues = [
      data.id,
      formatDate(data.createdAt),
      data.name,
      data.email,
      data.phone || "N/A",
      data.message,
      data.status,
    ];

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );

    if (!appendRes.ok) {
      console.error("Google Sheets Inquiry Append Error:", await appendRes.text());
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Google Sheets Inquiry Sync Exception:", error);
    return { success: false };
  }
}
