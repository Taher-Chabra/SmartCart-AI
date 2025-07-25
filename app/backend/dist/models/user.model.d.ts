import mongoose from 'mongoose';
import { IUserFull as IUser } from '@smartcartai/shared/src/interface/user';
interface IUserMethods {
    comparePassword(newPassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
export declare const User: mongoose.Model<IUser & IUserMethods, {}, {}, {}, mongoose.Document<unknown, {}, IUser & IUserMethods, {}> & IUser & IUserMethods & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<IUser & IUserMethods, mongoose.Model<IUser & IUserMethods, any, any, any, mongoose.Document<unknown, any, IUser & IUserMethods, any> & IUser & IUserMethods & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser & IUserMethods, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser & IUserMethods>, {}> & mongoose.FlatRecord<IUser & IUserMethods> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
