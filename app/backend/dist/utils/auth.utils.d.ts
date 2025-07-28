import { UserDocument } from "../models/user.model";
export declare const authResponseData: (user: UserDocument) => Promise<{
    accessToken: string;
    refreshToken: string;
    loggedInUser: import("mongoose").Document<unknown, {}, UserDocument, {}> & UserDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    cookieOptions: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "lax";
    };
}>;
