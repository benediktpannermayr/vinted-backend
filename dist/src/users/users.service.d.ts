import type { User } from '@prisma/client';
import type { CreateUserData, IUserRepository } from './repositories/user.repository.interface';
import type { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: CreateUserData): Promise<User>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
}
