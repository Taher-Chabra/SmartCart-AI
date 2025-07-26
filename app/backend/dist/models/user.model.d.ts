import mongoose, { Document } from 'mongoose';
import { IUserFull as IUser } from '@smartcartai/shared/interface/user';
interface IUserMethods {
    comparePassword(newPassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
export interface UserDocument extends IUser, Document, IUserMethods {
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
