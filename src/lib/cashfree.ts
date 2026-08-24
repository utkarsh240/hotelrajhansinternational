import crypto from "crypto";

const CASHFREE_CLIENT_ID = (
  process.env.CASHFREE_CLIENT_ID ||
  process.env.CASHFREE_APP_ID ||
  ""
).trim();

const CASHFREE_CLIENT_SECRET = (
  process.env.CASHFREE_CLIENT_SECRET ||
  process.env.CASHFREE_SECRET_KEY ||
  ""
).trim();

const EXPLICIT_ENV = (process.env.CASHFREE_ENV || "").toUpperCase();
const CASHFREE_ENV =
  EXPLICIT_ENV === "PRODUCTION" || EXPLICIT_ENV === "SANDBOX"
    ? EXPLICIT_ENV
    : CASHFREE_CLIENT_ID.startsWith("TEST")
    ? "SANDBOX"
    : "PRODUCTION";

const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";

const BASE_URL =
  CASHFREE_ENV === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export interface CreateOrderParams {
  orderId: string;
  amount: number;
  currency?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  returnUrl?: string;
  orderNote?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
}

export interface CashfreePaymentAttempt {
  cf_payment_id: string;
  order_id: string;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED";
  payment_amount: number;
  payment_currency: string;
  payment_message?: string;
  payment_time?: string;
  payment_group?: string;
}

export function getCashfreeEnvironment(): "PRODUCTION" | "SANDBOX" {
  return CASHFREE_ENV as "PRODUCTION" | "SANDBOX";
}

export function isCashfreeConfigured(): boolean {
  return Boolean(CASHFREE_CLIENT_ID && CASHFREE_CLIENT_SECRET);
}

function normalizePaymentStatus(
  value: unknown
): CashfreePaymentAttempt["payment_status"] {
  const status = typeof value === "string" ? value.toUpperCase() : "";
  if (
    status === "SUCCESS" ||
    status === "FAILED" ||
    status === "PENDING" ||
    status === "USER_DROPPED"
  ) {
    return status;
  }
  return "PENDING";
}

/**
 * Creates an official order on Cashfree Payment Gateway
 */
export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CashfreeOrderResponse> {
  // Input Validation
  if (!params.orderId || typeof params.orderId !== "string") {
    throw new Error("Order ID is required to create a Cashfree order.");
  }
  if (!params.amount || typeof params.amount !== "number" || params.amount <= 0) {
    throw new Error("Order amount must be a positive number.");
  }
  if (!params.customerId) {
    throw new Error("Customer ID is required to create a Cashfree order.");
  }

  if (!isCashfreeConfigured()) {
    throw new Error(
      "Cashfree credentials are not configured. Please set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET."
    );
  }

  // Format customer phone to 10 digits
  let cleanPhone = (params.customerPhone || "").replace(/[^0-9]/g, "");
  if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
  if (cleanPhone.length < 10) cleanPhone = "9999999999";

  // Sanitize customer ID (alphanumeric, _, -)
  const cleanCustomerId = params.customerId
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 50);

  const payload = {
    order_id: params.orderId,
    order_amount: Math.round(params.amount * 100) / 100,
    order_currency: params.currency || "INR",
    customer_details: {
      customer_id: cleanCustomerId,
      customer_name: params.customerName || "Guest User",
      customer_email: params.customerEmail || "guest@hotelrajhansinternational.com",
      customer_phone: cleanPhone,
    },
    order_meta: {
      return_url:
        params.returnUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "https://hotelrajhansinternational.com"}?order_id={order_id}`,
    },
    order_note: params.orderNote || `Booking ${params.orderId}`,
  };

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "x-client-id": CASHFREE_CLIENT_ID,
      "x-client-secret": CASHFREE_CLIENT_SECRET,
      "x-api-version": CASHFREE_API_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Cashfree API Order Creation Failed:", {
      status: res.status,
      environment: CASHFREE_ENV,
      baseUrl: BASE_URL,
      response: data,
    });
    const message =
      data.message || data.error || data.reason || `HTTP ${res.status} error`;
    throw new Error(`Cashfree Order Error: ${message}`);
  }

  return {
    cf_order_id: String(data.cf_order_id || data.order_id),
    order_id: data.order_id,
    payment_session_id: data.payment_session_id,
    order_status: data.order_status,
    order_amount: data.order_amount,
    order_currency: data.order_currency,
  };
}

/**
 * Fetches order details and payment attempts from Cashfree PG
 */
export async function fetchCashfreeOrderPayments(
  orderId: string
): Promise<{ orderStatus: string; payments: CashfreePaymentAttempt[] }> {
  if (!isCashfreeConfigured()) {
    throw new Error("Cashfree credentials are not configured.");
  }

  try {
    // 1. Fetch Order Details
    const orderRes = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_CLIENT_SECRET,
        "x-api-version": CASHFREE_API_VERSION,
      },
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("Cashfree API Order Fetch Failed:", orderData);
      return { orderStatus: "UNKNOWN", payments: [] };
    }

    const orderStatus =
      typeof orderData.order_status === "string"
        ? orderData.order_status
        : "UNKNOWN";

    // 2. Fetch Payment Attempts
    const paymentsRes = await fetch(`${BASE_URL}/orders/${orderId}/payments`, {
      method: "GET",
      headers: {
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_CLIENT_SECRET,
        "x-api-version": CASHFREE_API_VERSION,
      },
    });

    const paymentsData = await paymentsRes.json();
    if (!paymentsRes.ok) {
      console.error("Cashfree API Payments Fetch Failed:", paymentsData);
      return { orderStatus, payments: [] };
    }

    const payments: CashfreePaymentAttempt[] = Array.isArray(paymentsData)
      ? paymentsData.map((p: any) => ({
          cf_payment_id: String(p.cf_payment_id || p.payment_id || ""),
          order_id: String(p.order_id || orderId),
          payment_status: normalizePaymentStatus(p.payment_status),
          payment_amount: Number(p.payment_amount) || 0,
          payment_currency: String(p.payment_currency || "INR"),
          payment_message: p.payment_message,
          payment_time: p.payment_time,
          payment_group: p.payment_group,
        }))
      : [];

    return { orderStatus, payments };
  } catch (error) {
    console.error("Fetch Cashfree Order Payments Error:", error);
    return { orderStatus: "UNKNOWN", payments: [] };
  }
}

/**
 * Verifies Cashfree HMAC-SHA256 Webhook Signature
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  if (!signature || !timestamp || !rawBody) return false;
  if (!CASHFREE_CLIENT_SECRET) return false;

  try {
    const dataToSign = timestamp + rawBody;

    const computedBase64 = crypto
      .createHmac("sha256", CASHFREE_CLIENT_SECRET)
      .update(dataToSign)
      .digest("base64");

    const computedHex = crypto
      .createHmac("sha256", CASHFREE_CLIENT_SECRET)
      .update(dataToSign)
      .digest("hex");

    return (
      computedBase64 === signature ||
      computedHex === signature
    );
  } catch (err) {
    console.error("Webhook signature calculation exception:", err);
    return false;
  }
}
