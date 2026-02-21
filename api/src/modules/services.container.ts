import type { db } from "@/lib/types.js";

import { CourseRepository } from "./courses/courses.repo.js";
import { CourseService } from "./courses/courses.service.js";
import { SchoolRepository } from "./schools/school.repo.js";
import { SchoolService } from "./schools/school.service.js";
import { UserRepository } from "./users/user.repo.js";
import { UserService } from "./users/user.service.js";

export class ServiceContainer {
    // Starts as undefined. When it gets called for then it will be memoized
    private _courseService: CourseService | undefined;
    private _userService: UserService | undefined;
    private _schoolService: SchoolService | undefined;

    constructor(
        private readonly db: db,
        private readonly apiToken: string,
        private readonly canvasBaseUrl: string,
    ) {}

    get schoolService(): SchoolService {
        if (!this._schoolService) {
            const repo = new SchoolRepository(this.db);
            this._schoolService = new SchoolService(repo, this.apiToken, this.canvasBaseUrl);
        }
        return this._schoolService;
    }

    get courseService(): CourseService {
        if (!this._courseService) {
            const repo = new CourseRepository(this.db);
            this._courseService = new CourseService(repo, this.apiToken, this.canvasBaseUrl);
        }
        return this._courseService;
    }

    get userService() {
        if (!this._userService) {
            const repo = new UserRepository(this.db);
            this._userService = new UserService(
                repo,
                this.apiToken,
                this.canvasBaseUrl,
                this.schoolService,
            );
        }
        return this._userService;
    }
};