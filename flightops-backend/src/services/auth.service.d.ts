import { PrismaClient, UserRole } from "@prisma/client";
export declare class UnauthorizedError extends Error {
    constructor(message?: string);
}
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    register(data: {
        email: string;
        passwordHash: string;
        fullName: string;
        role?: UserRole;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    login(email: string, passwordHash: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map