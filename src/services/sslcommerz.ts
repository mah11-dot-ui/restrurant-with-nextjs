import { config } from '@/config';

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
  product_name: string;
  product_category: string;
  product_profile: string;
}

interface SslCommerzResponse {
  status: 'success' | 'fail';
  GatewayPageURL?: string;
  failedreason?: string;
  sessionkey?: string;
  tran_id?: string;
}

export async function initPayment(data: SslCommerzInitData): Promise<SslCommerzResponse> {
  const storeId = config.sslcommerz.storeId;
  const storePassword = config.sslcommerz.storePassword;
  const isLive = config.sslcommerz.isLive;

  const formData = new URLSearchParams();
  formData.append('store_id', storeId);
  formData.append('store_passwd', storePassword);
  formData.append('total_amount', data.total_amount.toString());
  formData.append('currency', data.currency);
  formData.append('tran_id', data.tran_id);
  formData.append('success_url', data.success_url);
  formData.append('fail_url', data.fail_url);
  formData.append('cancel_url', data.cancel_url);
  formData.append('ipn_url', data.ipn_url);
  formData.append('cus_name', data.cus_name);
  formData.append('cus_email', data.cus_email);
  formData.append('cus_phone', data.cus_phone);
  formData.append('cus_add1', data.cus_add1);
  formData.append('cus_city', data.cus_city);
  formData.append('cus_country', data.cus_country);
  formData.append('shipping_method', data.shipping_method);
  formData.append('product_name', data.product_name);
  formData.append('product_category', data.product_category);
  formData.append('product_profile', data.product_profile);

  const baseUrl = isLive
    ? 'https://securepay.sslcommerz.com'
    : 'https://sandbox.sslcommerz.com';

  const res = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  return res.json();
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SB_${timestamp}${random}`.toUpperCase();
}

export async function validatePayment(
  sessionKey: string
): Promise<{ status: boolean }> {
  const storeId = config.sslcommerz.storeId;
  const storePassword = config.sslcommerz.storePassword;
  const isLive = config.sslcommerz.isLive;

  const formData = new URLSearchParams();
  formData.append('store_id', storeId);
  formData.append('store_passwd', storePassword);
  formData.append('sessionkey', sessionKey);

  const baseUrl = isLive
    ? 'https://securepay.sslcommerz.com'
    : 'https://sandbox.sslcommerz.com';

  const res = await fetch(`${baseUrl}/validator/api/validationserverAPI.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  const data = await res.json();
  return { status: data.status === 'VALID' || data.status === 'VALIDATED' };
}
