import type { insertUser } from "@/db/schema.js";
import type { JWTData, PartialUser } from "@/lib/types.js";

import type { SchoolService } from "../schools/school.service.js";
import type { UserRepository } from "./user.repo.js";

export class UserService {
    constructor(
        private readonly repo: UserRepository,
        private readonly apiToken: string,
        private readonly canvasBaseUrl: string,
        private readonly schoolService: SchoolService,
    ) {}

    // async fetchUserById(userId: string) {
    //     return await this.repo.fetchOneUserById(userId);
    // }

    /**
     * Function to upsert user and verify that there is a school fk
     * @param data JWTData
     */
    async syncUserFacade(data: JWTData) {
        const user = await this.repo.fetchOneUserByIdWithSchoolInfo(data.userId);
        if (user) {
            return user;
        };
        const schoolInfo = await this.schoolService.ensureSchoolExistsFacade();
        const userData: PartialUser = {
            id: data.userId!,
            email: data.email!,
            schoolId: schoolInfo.id,
        };
        const [newUser] = await this.repo.upsertUser(userData);
        const returnInfo = {
            userId: newUser.id,
            schoolColor: schoolInfo.schoolColor,
        };
        return returnInfo;
    };

    async insertUser(user: insertUser) {
        return await this.repo.upsertUser(user);
    }
}