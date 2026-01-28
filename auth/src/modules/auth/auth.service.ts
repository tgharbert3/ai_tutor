import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { insertUserType } from "@/db/schema.js";
import type { loginDtoType, registerDtoType } from "@/lib/dto.js";

import { PasswordService } from "../services/password.service.js";
import * as UserRepo from "../user/user.repo.js";
import { TokenResponse } from "@/lib/types.js";
import { tokenService } from "../token/token.service.js";

export class AuthService {
    async loginUser(data: loginDtoType): Promise<TokenResponse> {
        const user = await this.verifyUser(data);

        const accessToken = await tokenService.generateAccessTokenFacade(user.email, String(user.id), user.canvasToken);
        const refreshToken = await tokenService.generateRefreshTokenFacade(String(user.id), null, null);

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
        
        const accessToken = await tokenService.generateAccessTokenFacade(insertedUser.email, String(insertedUser.id), insertedUser.canvasToken);
        const refreshToken = await tokenService.generateRefreshTokenFacade(String(insertedUser.id), null, null);


        return { accessToken, refreshToken};
    }

    async verifyUser(data: loginDtoType) {
        const user = await UserRepo.findOneUserByEmail(data.email);
        if (!user) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, { message: "Invalid email or password" });
        }

        const isValid = await PasswordService.comparePassword(data.password, user.passwordHash);
        if (!isValid) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, { message: "Invalid email or password" });
        }

        return user;
    };

    async handleRefresh(token: string) {
        const decryptedToken = await tokenService.decryptRefreshToken(token);
        // TODO: handle this better
        if (!decryptedToken) throw new Error("cant decrypt");
        const { sub: userId, familyJti, jti } = decryptedToken!.payload as {
            sub: string;
            familyJti: string,
            jti: string,
        };
        
        const user = await UserRepo.findOneUserById(Number(userId));
        // TODO: Handle this better
        if (!user) throw new Error("cant find user");

        const rt = await tokenService.generateRefreshTokenFacade(
            String(user.id),
            jti,
            familyJti
        )

        const at = await tokenService.generateAccessTokenFacade(
            user.email,
            String(user.id),
            user.canvasToken
        );

        return { at, rt };
    }

    async handleLogout(token: string) {
        const decryptedToken = await tokenService.decryptRefreshToken(token);
        // TODO: handle this better
        if (!decryptedToken) throw new Error("cant decrypt");
        const { jti } = decryptedToken!.payload as {
            jti: string,
        };
        const isRevoked = await tokenService.revokeTokenByJti(jti);
        return isRevoked;
    }
}
