import type { PartialUser, UserDto } from "../types.js";

export interface UserRepositoryPort {
    fetchOneUserById: (userId: string) => Promise<UserDto | undefined>;
    upsertUser: (user: PartialUser) => Promise<UserDto>;
}