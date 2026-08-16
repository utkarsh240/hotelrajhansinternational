import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_rajhans123";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_rajhans123";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  try {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");
    return expectedSignature === signature;
  } catch (error) {
    console.error("Razorpay Signature Verification Error:", error);
    return false;
  }
}
