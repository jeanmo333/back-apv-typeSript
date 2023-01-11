
export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    phone     : string;
    web     : string;
    token?     : string;
    address?     : string;
    isActive     : boolean;
    roles     : string;

    createdAt?: string;
    updatedAt?: string;
}