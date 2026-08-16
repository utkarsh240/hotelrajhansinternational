import { formatCurrency, formatDate, calculateNights } from "./utils";

export interface InvoiceData {
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress?: string | null;
  roomName: string;
  checkIn: Date | string;
  checkOut: Date | string;
  guestsCount: number;
  basePrice: number;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  gstin?: string;
  createdAt: Date | string;
}

export interface ConfirmationEmailData extends InvoiceData {
  roomsCount?: number;
  hotelAddress?: string;
  hotelPhone?: string;
  googleMapsUrl?: string;
  railwayDistance?: string;
}

/**
 * Generates responsive HTML email template for confirmed bookings
 */
export function generateConfirmationEmailHTML(data: ConfirmationEmailData): string {
  const nights = calculateNights(data.checkIn, data.checkOut);
  const gstin = data.gstin || "10AAAAA0000A1Z5";
  const roomsCount = data.roomsCount || 1;
  const hotelAddress =
    data.hotelAddress || "Kachari Chowk, MG Road, Bhagalpur, Bihar - 812001";
  const hotelPhone =
    data.hotelPhone || "+91 93081 89201 / +91 641 2400000";
  const googleMapsUrl =
    data.googleMapsUrl ||
    "https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9";
  const railwayDistance =
    data.railwayDistance ||
    "Bhagalpur Junction Railway Station (BGP): ~2.5 km (10-15 mins drive)";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed - ${data.bookingReference}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f6f0; color: #2d2623; margin: 0; padding: 20px; }
    .email-container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8e2d5; }
    .header { background: linear-gradient(135deg, #4a2e1b 0%, #2d1a0e 100%); padding: 30px 25px; text-align: center; color: #ffffff; }
    .header h1 { font-family: Georgia, serif; font-size: 26px; margin: 0; letter-spacing: 1px; color: #f3e5ca; }
    .header p { margin: 6px 0 0 0; font-size: 12px; color: #d4b896; letter-spacing: 2px; text-transform: uppercase; }
    .status-banner { background: #ecfdf5; border-bottom: 1px solid #a7f3d0; padding: 15px 25px; text-align: center; color: #065f46; font-weight: bold; font-size: 14px; }
    .content { padding: 30px 25px; }
    .greeting { font-size: 15px; margin-bottom: 20px; color: #4a2e1b; line-height: 1.5; }
    .card-grid { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 20px; }
    .card { background: #fdfaf5; border: 1px solid #efe5d5; border-radius: 8px; padding: 16px; font-size: 13px; vertical-align: top; }
    .card h3 { margin: 0 0 10px 0; color: #704a34; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e8d9c3; padding-bottom: 5px; }
    .detail-row { margin-bottom: 6px; }
    .label { color: #786c65; font-size: 11px; text-transform: uppercase; font-weight: bold; }
    .value { font-weight: bold; color: #2d2623; }
    .table-container { margin: 25px 0; }
    .invoice-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .invoice-table th { background: #4a2e1b; color: #ffffff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
    .invoice-table td { padding: 12px; border-bottom: 1px solid #f0e8dc; }
    .total-box { background: #faf4e8; border: 1px solid #e3d5be; border-radius: 8px; padding: 16px; margin-top: 20px; text-align: right; font-size: 13px; }
    .grand-total { font-size: 18px; font-weight: bold; color: #4a2e1b; margin-top: 6px; }
    .location-box { background: #f3ede2; border-left: 4px solid #704a34; padding: 16px; border-radius: 4px; margin-top: 25px; font-size: 13px; line-height: 1.6; }
    .btn-maps { display: inline-block; background: #704a34; color: #ffffff !important; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 12px; }
    .footer { background: #f8f6f0; text-align: center; padding: 20px; font-size: 12px; color: #887b73; border-top: 1px solid #e8e2d5; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Hotel Rajhans International</h1>
      <p>Official Booking Confirmation</p>
    </div>

    <div class="status-banner">
      ✓ Booking Confirmed & Payment Verified (Ref: ${data.bookingReference})
    </div>

    <div class="content">
      <div class="greeting">
        Dear <strong>${data.customerName}</strong>,<br />
        Thank you for choosing Hotel Rajhans International. Your room reservation is confirmed. Below are your complete stay details and tax receipt.
      </div>

      <table class="card-grid">
        <tr>
          <td class="card" width="50%" style="padding-right: 10px;">
            <h3>Guest Information</h3>
            <div class="detail-row"><span class="label">Guest Name:</span> <span class="value">${data.customerName}</span></div>
            <div class="detail-row"><span class="label">Phone:</span> <span class="value">${data.customerPhone}</span></div>
            ${data.customerEmail ? `<div class="detail-row"><span class="label">Email:</span> <span class="value">${data.customerEmail}</span></div>` : ""}
            <div class="detail-row"><span class="label">Booking Ref:</span> <span class="value" style="color: #704a34;">${data.bookingReference}</span></div>
          </td>
          <td class="card" width="50%">
            <h3>Reservation Summary</h3>
            <div class="detail-row"><span class="label">Room Type:</span> <span class="value">${data.roomName}</span></div>
            <div class="detail-row"><span class="label">Rooms Booked:</span> <span class="value">${roomsCount} Room</span></div>
            <div class="detail-row"><span class="label">Guests Count:</span> <span class="value">${data.guestsCount} Guest(s)</span></div>
            <div class="detail-row"><span class="label">Stay Duration:</span> <span class="value">${nights} Night(s)</span></div>
          </td>
        </tr>
      </table>

      <table class="card-grid">
        <tr>
          <td class="card" width="50%" style="padding-right: 10px;">
            <h3>Check-In Date</h3>
            <div class="value" style="font-size: 15px; color: #4a2e1b;">${formatDate(data.checkIn)}</div>
            <div class="label" style="margin-top: 4px;">Check-In Time: 12:00 PM</div>
          </td>
          <td class="card" width="50%">
            <h3>Check-Out Date</h3>
            <div class="value" style="font-size: 15px; color: #4a2e1b;">${formatDate(data.checkOut)}</div>
            <div class="label" style="margin-top: 4px;">Check-Out Time: 11:00 AM</div>
          </td>
        </tr>
      </table>

      <div class="table-container">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Tariff Breakdown</th>
              <th style="text-align: center;">Nights</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${data.roomName} Suite</strong><br />
                <small style="color: #786c65;">GSTIN: ${gstin}</small>
              </td>
              <td style="text-align: center;">${nights}</td>
              <td style="text-align: right;">${formatCurrency(data.totalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-box">
        <div><span class="label">Subtotal:</span> ${formatCurrency(data.totalAmount)}</div>
        <div><span class="label">GST / Taxes:</span> ${formatCurrency(data.taxAmount)}</div>
        <div class="grand-total">Total Net Amount: ${formatCurrency(data.netAmount)}</div>
        <div style="margin-top: 6px;"><span class="label">Payment Status:</span> <strong style="color: #065f46;">${data.paymentStatus} (${data.paymentMethod || "Cashfree Payments"})</strong></div>
      </div>

      <div class="location-box">
        <h3 style="margin: 0 0 8px 0; color: #4a2e1b; font-size: 13px; text-transform: uppercase;">Hotel Address & Transport Information</h3>
        <div><strong>Hotel Name:</strong> Hotel Rajhans International</div>
        <div><strong>Address:</strong> ${hotelAddress}</div>
        <div><strong>Contact Number:</strong> ${hotelPhone}</div>
        <div style="margin-top: 6px;"><strong>Railway Station Distance:</strong> ${railwayDistance}</div>
        <div style="margin-top: 10px;">
          <a href="${googleMapsUrl}" target="_blank" class="btn-maps">📍 Get Google Maps Directions</a>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>For inquiries or reception assistance, call ${hotelPhone} or email info@hotelrajhansinternational.com</p>
      <p>© ${new Date().getFullYear()} Hotel Rajhans International. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const nights = calculateNights(data.checkIn, data.checkOut);
  const gstin = data.gstin || "10AAAAA0000A1Z5";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice - ${data.bookingReference}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; background: #fff; }
    .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); padding: 30px; border-radius: 8px; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .header-table td { vertical-align: top; }
    .title-cell h1 { font-family: Georgia, serif; color: #5b3a29; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
    .title-cell p { margin: 4px 0 0 0; color: #704a34; font-size: 12px; }
    .inv-details { text-align: right; font-size: 12px; color: #555; }
    .inv-details strong { color: #5b3a29; font-size: 14px; }
    .divider { border-bottom: 2px solid #d9cbae; margin: 20px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
    .info-table td { padding: 8px; vertical-align: top; }
    .info-box { background: #fbf6ed; border: 1px solid #efe2ca; padding: 12px; border-radius: 6px; }
    .info-box h4 { margin: 0 0 6px 0; color: #704a34; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th { background: #5b3a29; color: #fff; text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .items-table td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    .totals-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .totals-table td { padding: 6px 10px; text-align: right; font-size: 13px; }
    .totals-table .grand-total { font-size: 16px; font-weight: bold; color: #5b3a29; border-top: 2px solid #5b3a29; padding-top: 10px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
    .badge-paid { background: #d1fae5; color: #065f46; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .footer { text-align: center; font-size: 11px; color: #888; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="invoice-box">
    <table class="header-table">
      <tr>
        <td class="title-cell">
          <h1>Hotel Rajhans International</h1>
          <p>A Unit of Takshshila Regency Pvt. Ltd.</p>
          <p>Kachari Chowk, MG Road, Bhagalpur, Bihar - 812001</p>
          <p>GSTIN: <strong>${gstin}</strong> | Phone: +91 93081 89201</p>
        </td>
        <td class="inv-details">
          <strong>TAX INVOICE</strong><br />
          Ref: <strong>${data.bookingReference}</strong><br />
          Date: ${formatDate(data.createdAt)}<br />
          Status: <span class="badge ${data.paymentStatus === "SUCCESS" ? "badge-paid" : "badge-pending"}">${data.paymentStatus}</span>
        </td>
      </tr>
    </table>

    <div class="divider"></div>

    <table class="info-table">
      <tr>
        <td width="50%">
          <div class="info-box">
            <h4>Billed To (Guest Details)</h4>
            <strong>${data.customerName}</strong><br />
            Phone: ${data.customerPhone}<br />
            ${data.customerEmail ? `Email: ${data.customerEmail}<br />` : ""}
            ${data.customerAddress ? `Address: ${data.customerAddress}` : ""}
          </div>
        </td>
        <td width="50%">
          <div class="info-box">
            <h4>Stay Details</h4>
            Room: <strong>${data.roomName}</strong><br />
            Check-In: <strong>${formatDate(data.checkIn)}</strong> (12:00 PM)<br />
            Check-Out: <strong>${formatDate(data.checkOut)}</strong> (11:00 AM)<br />
            Nights: <strong>${nights} Night(s)</strong> | Guests: <strong>${data.guestsCount}</strong>
          </div>
        </td>
      </tr>
    </table>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Nights</th>
          <th style="text-align: right;">Rate</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${data.roomName} Accommodation</strong><br />
            <small style="color: #777;">Base room charges for ${data.guestsCount} guests</small>
          </td>
          <td style="text-align: center;">${nights}</td>
          <td style="text-align: right;">${formatCurrency(data.basePrice)}</td>
          <td style="text-align: right;">${formatCurrency(data.totalAmount)}</td>
        </tr>
      </tbody>
    </table>

    <table class="totals-table">
      <tr>
        <td width="70%">Subtotal:</td>
        <td width="30%">${formatCurrency(data.totalAmount)}</td>
      </tr>
      ${data.discountAmount > 0 ? `
      <tr>
        <td>Discount:</td>
        <td>- ${formatCurrency(data.discountAmount)}</td>
      </tr>
      ` : ""}
      <tr>
        <td>GST / Taxes:</td>
        <td>${formatCurrency(data.taxAmount)}</td>
      </tr>
      <tr>
        <td class="grand-total">Grand Total:</td>
        <td class="grand-total">${formatCurrency(data.netAmount)}</td>
      </tr>
      <tr>
        <td>Amount Paid:</td>
        <td><strong>${formatCurrency(data.paidAmount)}</strong></td>
      </tr>
    </table>

    <div class="footer">
      <p>Thank you for staying at Hotel Rajhans International!</p>
      <p>For assistance, call +91 93081 89201 or email info@hotelrajhansinternational.com</p>
    </div>
  </div>
</body>
</html>
  `;
}
