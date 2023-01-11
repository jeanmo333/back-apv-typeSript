import { IUser } from "./user";

export interface IPatient {
  _id: string;
  name: string;
  email: string;
  owner: string;
  date: Date;
  isActive: boolean;
  symptoms: string;
  user?: IUser | null;

  createdAt?: string;
  updatedAt?: string;
}
