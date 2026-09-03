import mailer from "../config/mailer.config";
import ENV_CONFIG from "../config/env.config";
import { IOrder } from "../models/order.model";

const statusMessages: Record<string, string> = {
  pending: "Your order has been received and is pending confirmation.",
  processing: "Your order is now being prepared.",
  shipped: "Great news - your order is on its way!",
  delivered: "Your order has been delivered. We hope you love it!",
  cancelled: "Your order has been cancelled.",
};


const sendEmail = async (to: string, subject: string, html: string, logLabel: string) => {
  try {
    await mailer.sendMail({
      from: `"Northloom" <${ENV_CONFIG.smtp.user}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`[email] failed to send ${logLabel}:`, error);
  }
};

export const sendOrderConfirmationEmail = async (
  toEmail: string,
  order: IOrder,
): Promise<void> => {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;">${item.name} &times; ${item.quantity}</td>
          <td style="padding:8px 0; text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#28394f;">Thanks for your order, ${order.shipping_address.full_name}!</h2>
      <p>Your Northloom order <strong>#${String(order._id).slice(-8).toUpperCase()}</strong> has been placed.</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        ${itemsHtml}
        <tr><td style="padding-top:12px; border-top:1px solid #ddd;">Subtotal</td><td style="text-align:right; padding-top:12px; border-top:1px solid #ddd;">$${order.subtotal.toFixed(2)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right;">$${order.shipping_fee.toFixed(2)}</td></tr>
        <tr><td style="font-weight:bold;">Total</td><td style="text-align:right; font-weight:bold;">$${order.total.toFixed(2)}</td></tr>
      </table>
      <p>Shipping to: ${order.shipping_address.line1}, ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}, ${order.shipping_address.country}</p>
      <p style="color:#888; font-size:13px;">We'll email you again when your order ships.</p>
    </div>
  `;

  await sendEmail(
    toEmail,
    `Your Northloom order #${String(order._id).slice(-8).toUpperCase()} is confirmed`,
    html,
    "order confirmation",
  );
};

export const sendOrderStatusUpdateEmail = async (
  toEmail: string,
  order: IOrder,
): Promise<void> => {
  const orderNumber = String(order._id).slice(-8).toUpperCase();
  const message = statusMessages[order.status] || `Your order status is now: ${order.status}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#28394f;">Order #${orderNumber} update</h2>
      <p style="font-size:16px;">${message}</p>
      <p style="margin-top:16px;">
        <strong>Status:</strong>
        <span style="text-transform:capitalize;">${order.status}</span>
      </p>
      <p style="color:#888; font-size:13px; margin-top:24px;">
        Thanks for shopping with Northloom.
      </p>
    </div>
  `;

  await sendEmail(toEmail, `Order #${orderNumber} is now ${order.status}`, html, "order status update");
};
