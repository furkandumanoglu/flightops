import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class AuthService {
    constructor(private readonly prisma: PrismaClient) { }

    async register(data: { email: string; passwordHash: string; fullName: string; role?: UserRole }) {
        const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                fullName: data.fullName,
                role: data.role || 'STUDENT_PILOT',
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true
            }
        });
    }

    async login(email: string, passwordHash: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
            JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
}
