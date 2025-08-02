export interface IJwtPayload {
  _id?: string;
  username: string;
  email: string;
  role: 'customer' | 'admin' | 'seller';
}

export interface IUserSignup {
  username: string;
  email: string;
  role: 'customer' | 'admin' | 'seller';
  fullName: string;
  password: string;
}

export interface IUser extends IUserSignup {
  phone: {
    countryCode?: string;
    number?: string;
  };
  avatar: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  google: {
    id: string;
  };
  authType: 'local' | 'google';
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer {
  address: IUserAddress;
  wishlist: Array<string>;
  orderHistory: Array<string>;
  cart: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface ISeller {
  businessType: 'individual' | 'company';
  businessName: string;
  businessEmail: string;
  businessLogo?: string;
  address: IUserAddress;
  products: Array<string>;
  ratings: {
    average: number;
    totalReviews: number;
  };
  legalDocuments: Array<{
    docType: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  isVerified: boolean;
  paymentHistory: Array<string>;
  customerOrders: Array<string>;
}

export interface IAdmin {
  typeOf: 'admin' | 'super-admin';
  permissions: Array<'read' | 'write' | 'delete'>;
  lastLogin: Date;
}

export interface IUserAddress {
  line1: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  landmark?: string;
}
