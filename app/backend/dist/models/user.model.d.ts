import mongoose, { Document } from 'mongoose';
import { IUserBase } from '@smartcartai/shared/src/interface/user';
interface IUser extends IUserBase {
    fullName: string;
    password: string;
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
interface IUserMethods {
    comparePassword(newPassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
export interface UserDocument extends IUser, IUserMethods, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const User: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<UserDocument, mongoose.Model<UserDocument, any, any, any, mongoose.Document<unknown, any, UserDocument, any> & UserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<UserDocument>, {}> & mongoose.FlatRecord<UserDocument> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>>;
export {};
