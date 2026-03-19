import type { insertCourseType } from "@/infrastructure/db/schema.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/repos/courses.repo.interface.js";
import type { ISchoolRepository } from "@/infrastructure/interfaces/repos/school.repo.interface.js";
import type { IUserRepository } from "@/infrastructure/interfaces/repos/user.repo.interface.js";
import type { db } from "@/lib/types.js";
import type { InsertSchool } from "@/modules/ingestion/schools/domain/types.js";
import type { UserDto } from "@/modules/ingestion/users/domain/types.js";

import { DrizzleCourseRepository } from "../drizzle.courses.repo.js";
import { DrizzleSchoolRepository } from "../drizzle.school.repo.js";
import { DrizzleUserRepository } from "../drizzle.user.repo.js";

export class RepoTestHelper {
    schoolRepo: ISchoolRepository;
    userRepo: IUserRepository;
    courseRepo: ICoursesRepository;

    constructor(db: db) {
        this.schoolRepo = new DrizzleSchoolRepository(db);
        this.userRepo = new DrizzleUserRepository(db);
        this.courseRepo = new DrizzleCourseRepository(db);
    }

    async getTestSchool() {
        return await this.schoolRepo.upsertSchool({
            canvasBaseUrl: "testUrl",
        } satisfies InsertSchool);
    }

    async getTestUser() {
        return await this.userRepo.upsertUser({
            id: Bun.randomUUIDv7(),
            email: "test@email.com",
            schoolId: 1,
        } satisfies UserDto);
    }

    async getTestCourse() {
        return await this.courseRepo.insertCourse({
            canvasCourseId: 1,
            schoolId: 1,
        } satisfies insertCourseType);
    }
}