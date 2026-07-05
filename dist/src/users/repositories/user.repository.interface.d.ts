import { User } from '@prisma/client';
export interface CreateUserData {
    email: string;
    password: string;
}
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: CreateUserData): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
}
export declare const USER_REPOSITORY = "USER_REPOSITORY";
