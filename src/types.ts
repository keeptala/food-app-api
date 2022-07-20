export type CreateCustomerInput = {
    phoneNumber: string;
    password: string;
    username: string;
}

export type DeviceTokenReply = {
    message: string;
}

export type loginReply = {
    message: string;
    token: string;
}

export type AdminReply = {
    phoneNumber: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
}

export type CustomerReply = {
    phoneNumber: string;
    password: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    username: string;
}

export type CreateAdminInput = {
    phoneNumber: string;
    password: string;
    username: string;
}

export type CreateloginInput = {
    phoneNumber?: string;
    password?: string;
}



