declare module 'sslcommerz-lts' {
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

  interface SslCommerzResponse {
    status: string;
    GatewayPageURL?: string;
    failedreason?: string;
    sessionkey?: string;
    tran_id?: string;
  }

  class SSLCommerz {
    constructor(storeId: string, storePassword: string, isLive: boolean);
    init(data: SslCommerzInitData): Promise<SslCommerzResponse>;
    validate(sessionKey: string): Promise<{ status: string }>;
  }

  export default SSLCommerz;
}
