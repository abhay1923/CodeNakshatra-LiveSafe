import { logger } from "./logger";

function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }
  return `+${trimmed.replace(/\D/g, "")}`;
}

function toWhatsAppAddress(phone: string): string {
  const normalized = normalizePhone(phone);
  return `whatsapp:${normalized}`;
}

export async function sendWhatsAppMessage(toPhone: string, body: string): Promise<void> {
  const accountSid = process.env["TWILIO_ACCOUNT_SID"];
  const authToken = process.env["TWILIO_AUTH_TOKEN"];
  const fromWhatsApp = process.env["TWILIO_WHATSAPP_FROM"];

  if (!accountSid || !authToken || !fromWhatsApp) {
    logger.warn(
      {
        toPhone,
      },
      "WhatsApp credentials missing; skipped sending message",
    );
    return;
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const params = new URLSearchParams();
  params.set("From", fromWhatsApp.startsWith("whatsapp:") ? fromWhatsApp : `whatsapp:${fromWhatsApp}`);
  params.set("To", toWhatsAppAddress(toPhone));
  params.set("Body", body);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    logger.error(
      {
        status: res.status,
        body: text,
        toPhone,
      },
      "Failed to send WhatsApp message via Twilio",
    );
  }
}
