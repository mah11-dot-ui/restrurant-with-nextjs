import SSLCommerz from 'sslcommerz-lts';
import { config } from '@/config';

let sslczInstance: SSLCommerz | null = null;

function getSslcz(): SSLCommerz {
  if (!sslczInstance) {
    const storeId = config.sslcommerz.storeId;
    const storePassword = config.sslcommerz.storePassword;
    const isLive = config.sslcommerz.isLive;

    if (!storeId || !storePassword) {
      throw new Error(
        'SSLCommerz store credentials not configured. ' +
        'Set NEXT_PUBLIC_SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD in .env.local'
      );
    }

    sslczInstance = new SSLCommerz(storeId, storePassword, isLive);
  }
  return sslczInstance;
}

interface SslCommerzInitData {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  shipping_method: string;
  ship_name: string;
  product_name: string;
  product_category: string;
  product_profile: string;
}

export async function initPayment(
  data: SslCommerzInitData
): Promise<{ status: string; GatewayPageURL?: string; failedreason?: string }> {
  const sslcz = getSslcz();
  const result = await sslcz.init(data);
  return result;
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SB_${timestamp}${random}`.toUpperCase();
}

export async function validatePayment(
  sessionKey: string
): Promise<{ status: boolean }> {
  const sslcz = getSslcz();
  const result = await sslcz.validate(sessionKey);
  return { status: result?.status === 'VALID' || result?.status === 'VALIDATED' };
}
