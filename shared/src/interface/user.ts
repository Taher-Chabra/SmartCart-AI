 export interface IUserPartial {
   fullName?: string;
   username?: string;
   email?: string;
   phone?: {
      countryCode?: string;
      number?: string;
   };
   address?: {
      line1: string;
      city: string;
      state: string;
      country: string;
      zip: string;
      landmark?: string;
   };
   role?: 'customer' | 'admin' | 'seller';
   avatar?: string;
   isEmailVerified?: boolean;
   isPhoneVerified?: boolean;
   cart: Array<{
      product: object;
      quantity: number;
      variant?: Map<string, string>;
   }>;
   wishlist: Array<{
      product: object;
   }>;
   orderHistory: Array<{
      orderId: string;
      orderDate: Date;
   }>;
}

export interface IUserFull extends IUserPartial {
   password: string;
   google?: {
      id: string;
   };
   authType: 'local' | 'google';
   refreshToken: string;
}

export interface IUserJwtPayload {
   _id: string;
   username: string;
   email: string;
   role: 'customer' | 'admin' | 'seller';
}