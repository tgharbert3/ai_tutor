import type { UserDto } from "../types.js";

export interface UserRepositoryPort {
    fetchOneUserById: (userId: string) => Promise<UserDto | undefined>;
    upsertUser: (user: UserDto) => Promise<UserDto>;
}