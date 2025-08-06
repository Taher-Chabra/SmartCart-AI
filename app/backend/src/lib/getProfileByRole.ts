import { Model, Types } from 'mongoose';
import { CustomerModel, UserCustomer } from '../models/userCustomer.model';
import { SellerModel, UserSeller } from '../models/userSeller.model';
import { AdminModel, UserAdmin } from '../models/userAdmin.model';

type UserModels = CustomerModel | SellerModel | AdminModel;

export async function getProfileByRole(
  role: string, 
  userId: Types.ObjectId | null
): Promise<UserModels | null> {
  let roleProfile: UserModels | null = null;
  let profileModel: Model<any> | null = null;

  switch (role) {
    case 'customer':
      profileModel = UserCustomer;
      break;
    case 'seller':
      profileModel = UserSeller;
      break;
    case 'admin':
      profileModel = UserAdmin;
      break;
  }
  if (!profileModel) {
    return null;
  }

  if (userId) {
    roleProfile = await profileModel.findOne({ userId });
  } else {
    roleProfile = await profileModel.create({ userId });
  }

  if (!roleProfile) {
    return null;
  }

  return roleProfile;
}
