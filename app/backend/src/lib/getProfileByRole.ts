import { Document, mongo, Types } from 'mongoose';
import { CustomerModel, UserCustomer } from '../models/userCustomer.model';
import { SellerModel, UserSeller } from '../models/userSeller.model';
import { AdminModel, UserAdmin } from '../models/userAdmin.model';

type UserModels = CustomerModel | SellerModel | AdminModel;


export async function getProfileByRole(
  role: string,
  userId: Types.ObjectId | null,
  type?: 'create' | 'find',
  session?: mongo.ClientSession
): Promise<UserModels | null> {
  if (!role || !userId) return null;

  const createAndReturn = async (Model: any, exclude: string) => {
    if (type === 'create') {
      // Create profile and immediately return it
      return await Model.create([{ userId }], { session })
        .then((docs: Document[]) => Model
          .findById(docs[0]._id)
          .select(exclude)
          .session(session)
        );
    } else {
      // Return existing Profile if type is 'find'
      return await Model.findOne({ userId })
        .select(exclude)
        .session(session);
    }
  };

  if (role === 'customer') {
    return await createAndReturn(UserCustomer, '-__v -orderHistory -cart -wishlist');
  }
  if (role === 'seller') {
    return await createAndReturn(
      UserSeller,
      '-__v -products -ratings -legalDocuments -paymentHistory -customerOrders'
    );
  }
  if (role === 'admin') {
    return await createAndReturn(UserAdmin, '-__v -lastLogin -permissions');
  }

  return null;
}
