import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { insertUserType } from "@/db/schema.js";
import type { loginDtoType, registerDtoType } from "@/lib/dto.js";

import { PasswordService } from "../services/password.service.js";
import * as UserRepo from "../user/user.repo.js";
import { cryptoService } from "../services/crypto.service.js";
import { TokenResponse } from "@/lib/types.js";

export class AuthService {
    async loginUser(data: loginDtoType): Promise<TokenResponse> {
        const user = await UserRepo.findOneUserByEmail(data.email);
        if (!user) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, { message: "Invalid email or password" });
        }

        const isValid = await PasswordService.comparePassword(data.password, user.passwordHash);
        if (!isValid) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, { message: "Invalid email or password" });
        }

        const accessToken = await cryptoService.generateAccessToken(user.email, String(user.id), user.canvasToken);
        const refreshToken = await cryptoService.generateRefreshToken(String(user.id));

        return {accessToken, refreshToken};
    };

    async registerUser(data: registerDtoType): Promise<TokenResponse> {
        const hasedPassword = await PasswordService.hashPassword(data.password);
        const userToInsert: insertUserType = {
            email: data.email,
            passwordHash: hasedPassword,
            username: data.username,
            canvasToken: data.canvasToken,
        };
        const insertedUser = await UserRepo.insertOneUser(userToInsert);
        if (!insertedUser) {
            throw new HTTPException(HttpStatusCodes.INTERNAL_SERVER_ERROR, { message: "Failed to create user" });
        }
        
        const accessToken = await cryptoService.generateAccessToken(insertedUser.email, String(insertedUser.id), insertedUser.canvasToken);
        const refreshToken = await cryptoService.generateRefreshToken(String(insertedUser.id));

        return { accessToken, refreshToken};
    }
}
