import type { UserDto } from "@/modules/ingestion/users/domain/types.js";

export interface IUserRepository {
    fetchOneUserById: (userId: string) => Promise<UserDto | undefined>;
    upsertUser: (user: UserDto) => Promise<UserDto>;
}