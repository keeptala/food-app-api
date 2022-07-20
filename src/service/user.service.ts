import { IUserRepository } from '../repository/user.repository';
import { Admin, Customer } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateloginInput, CreateCustomerInput } from '../types';

export class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async registerNewUser<T>(
    user: T,
    isAdmin = false,
  ): Promise<{ payload: T; message: string }> {
	
    if (isAdmin) {
      const admin = (user as unknown) as Admin;
      const { password, ...rest } = admin;
      // encrpte the password
      const salt = await bcrypt.genSalt(10);
      const encrptedPass = await bcrypt.hash(password, salt);
	  const isDuplicate = await this.userRepo.findPhoneNumber(admin.phoneNumber);
	  
      if (!isDuplicate) {
        const res = await this.userRepo.addNewAdmin({
          ...rest,
          password: encrptedPass,
        });
        return {
          payload: (res as unknown) as T,
          message: 'user registered successfully',
        };
      } else {
        return {
          payload: user,
          message: 'duplicate phone number',
        };
      }
    } else {
      const customer = (user as unknown) as Customer;
	  console.log(customer);
      const { password, ...rest } = customer;
      // encrpte the password
      const salt = await bcrypt.genSalt(10);
      const encrptedPass = await bcrypt.hash(password, salt);
	  const isDuplicate = await this.userRepo.findPhoneNumber(customer.phoneNumber);
      if (!isDuplicate) {
        const res = await this.userRepo.addNewUser({
          ...rest,
          salt,
          password: encrptedPass,
		  refreshToken:'',
		  deviceToken:''
        });
        return {
          payload: (res as unknown) as T,
          message: 'user registered successfully',
        };
      } else {
        return {
          payload: user,
          message: 'duplicate phone number',
        };
      }
    }
  }

  async findUser(creds: CreateloginInput): Promise<Customer> {
    const user = (await this.userRepo.findByPhoneNumber(
      creds.phoneNumber,
      false,
    )) as Customer;

    return user;
  }

  async fetchUserProfile(
    id: number,
    isAdmin = false,
  ): Promise<CreateCustomerInput | Admin> {
    if (!isAdmin) {
      const profile = await this.userRepo.fetchUser(id);
      return profile;
    } else {
      const profile = await this.userRepo.fetchAdminProfiles(id);
      return profile;
    }
  }

  async resetPassword(creds: CreateloginInput): Promise<{ message: string }> {
    try {
      const user = (await this.userRepo.findByPhoneNumber(
        creds.phoneNumber,
        false,
      )) as Customer;
      // encrpte the password
      const salt = await bcrypt.genSalt(10);
      const encrptedPass = await bcrypt.hash(creds.password, salt);
      await this.userRepo.editUserDetails(
        { ...user, password: encrptedPass, salt },
        false,
      );
      return { message: 'password updated' };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateProfile(
    user: CreateCustomerInput,
  ): Promise<{
    payload: CreateCustomerInput;
    message: string;
  }> {
    try {
      const result = (await this.userRepo.findByPhoneNumber(
        user.phoneNumber,
        false,
      )) as Customer;
      // encrpte the password
      const salt = await bcrypt.genSalt(10);
      const encrptedPass = await bcrypt.hash(result.password, salt);
      const profile = await this.userRepo.editUserDetails(
        { ...result, ...user, password: encrptedPass, salt },
        false,
      );
      return { message: 'password updated', payload: profile };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateDeviceToken(
    token: string,
    id: string,
  ): Promise<{
    message: string;
  }> {
    try {
      const user = (await this.userRepo.findByPhoneNumber(
        id,
        false,
      )) as Customer;
      await this.userRepo.editUserDetails({ ...user, token }, false);
      return { message: 'device token updated' };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
