export const config = {
  app: {
    name: 'Savory Bites',
    description: 'Premium dining experience delivered to your door',
    url: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, ''),
  },

  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  },

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant',
  },

  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
  },

  sslcommerz: {
    storeId: process.env.NEXT_PUBLIC_SSLCOMMERZ_STORE_ID!,
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD!,
    isLive: process.env.SSLCOMMERZ_IS_LIVE === 'true',
  },

  email: {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.EMAIL_FROM || 'noreply@restaurant.com',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  },
} as const;

export const getConfig = () => config;
