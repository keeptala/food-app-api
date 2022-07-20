import { Admin, Customer, PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export interface IUserRepository {
  fetchUser(id: number): Promise<Customer>;
  addNewUser(user: Customer): Promise<Customer>;
  addNewAdmin(admin: Admin): Promise<Admin>;
  fetchAdminProfiles(id: number): Promise<Admin>;
  editUserDetails<T>(user: T, isAdmin: boolean): Promise<T>;
  findPhoneNumber(phoneNumber: string): Promise<boolean>;
  findByPhoneNumber(phoneNumber: string,isAdmin:boolean): Promise<Customer|Admin>;
}

export class UserRepository implements IUserRepository {
	async findByPhoneNumber(phoneNumber: string,isAdmin=false): Promise<Customer | Admin> {
		try {
			if(!isAdmin){
				const user = await prisma.customer.findFirst({
					where: {
						phoneNumber: phoneNumber,
					},
				});
				return user;
			}else{
		
				const user = await prisma.admin.findFirst({
					where: {
						phoneNumber: phoneNumber.toString(),
					},
				});
			
				return user;
			}
			
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	async findPhoneNumber(phoneNumber: string): Promise<boolean> {
		try {
			await prisma.customer.findFirstOrThrow({
				where: {
					phoneNumber: phoneNumber,
				},
			});
			return true;
		} catch (e) {
			return false;
		}
	}
	async fetchUser(id: number): Promise<Customer> {
		const result = await prisma.customer.findFirst({
			where: {
				id: {
					equals: parseInt(id.toString()),
				},
			},
		});
		return result;
	}
	async addNewUser(user: Customer): Promise<Customer> {
		const response = await prisma.customer.create({
			data: user,
		});

		return response;
	}
	async addNewAdmin(admin: Admin): Promise<Admin> {
		const response = await prisma.admin.create({
			data: admin,
		});

		return response;
	}
	async fetchAdminProfiles(id: number): Promise<Admin> {
		const profile = await prisma.admin.findFirst({
			where: {
				id: {
					equals: parseInt(id.toString()),
				},
			},
		});
		return profile;
	}
	async editUserDetails<T>(user: T, isAdmin: boolean): Promise<T> {
		if (!isAdmin) {
			const customer = user as unknown as Customer;
			const response = await prisma.customer.update({
				data: customer,
				where: {
					id: customer.id,
				},
			});

			return response as unknown as T;
		} else {
			const admin = user as unknown as Admin;
			const response = await prisma.admin.update({
				data: admin,
				where: {
					id: admin.id,
				},
			});
			return response as unknown as T;
		}
	}
}
