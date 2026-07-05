import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserData, IUserRepository } from './user.repository.interface';
export declare class PrismaUserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: CreateUserData): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
}
