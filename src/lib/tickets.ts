import { nanoid } from "nanoid";
import QRCode from "qrcode";

export function generateTicketToken(): string {
  return `TKT-${nanoid(16)}`;
}

export async function generateQRCode(data: string): Promise<string> {
  return QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: "#FFFFFF",
      light: "#000000",
    },
  });
}

export function getTicketValidationUrl(token: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/tickets/validate?token=${token}`;
}
