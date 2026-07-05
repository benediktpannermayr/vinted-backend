import type { User } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    email: string;
    createdAt: Date;
    constructor(user: User);
}
