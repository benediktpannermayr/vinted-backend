import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(currentUser: AuthenticatedUser): Promise<UserResponseDto>;
    changePassword(currentUser: AuthenticatedUser, dto: ChangePasswordDto): Promise<void>;
}
