import { HTTPException } from "hono/http-exception";

import type { insertUserType, safeUserType } from "@/db/schema.js";
import type { loginDtoType, registerDtoType } from "@/lib/dto.js";

import { PasswordService } from "../services/password.service.js";
import * as UserRepo from "../user/user.repo.js";

export class AuthService {
    constructor() {
    };

    async loginUser(data: loginDtoType): Promise<safeUserType> {
        const user = await UserRepo.findOneUserByEmail(data.email);
        if (!user) {
            throw new HTTPException(401, { message: "Invalid email or password" });
        }

        const isValid = PasswordService.comparePassword(data.password, user.passwordHash);
        if (!isValid) {
            throw new HTTPException(401, { message: "Invalid email or password" });
        }

        const { passwordHash, ...safeUser } = user;

        return safeUser;
    };

    async registerUser(data: registerDtoType): Promise<safeUserType> {
        const hasedPassword = await PasswordService.hashPassword(data.password);
        const userToInsert: insertUserType = {
            email: data.email,
            passwordHash: hasedPassword,
            username: data.username,
            canvasToken: data.canvasToken,
        };
        const insertedUser = await UserRepo.insertOneUser(userToInsert);
        if (!insertedUser) {
            throw new HTTPException(500, { message: "Failed to create user" });
        }

        return insertedUser;
    }
}
