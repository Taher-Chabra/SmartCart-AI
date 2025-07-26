import mongoose from 'mongoose';
export declare const generateSecretTokens: (userId: mongoose.Types.ObjectId) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
