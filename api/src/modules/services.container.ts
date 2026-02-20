import type { CourseRepository } from "./courses/courses.repo.js";
import type { UserRepository } from "./users/user.repo.js";

import { AssignmentsService } from "./assignments/assignments.service.js";
import { CourseService } from "./courses/courses.service.js";
import { UserService } from "./users/user.service.js";

export class ServiceContainer {
    private readonly courses: CourseService;
    private readonly assignments: AssignmentsService;
    private readonly users: UserService;

    constructor(
        apiToken: string,
        canvasBaseUrl: string,
        private readonly courseRepo: CourseRepository,
        private readonly userRepo: UserRepository,

    ) {
        this.courses = new CourseService(this.courseRepo, apiToken, canvasBaseUrl);
        this.assignments = new AssignmentsService(apiToken, canvasBaseUrl);
        this.users = new UserService(this.userRepo, apiToken, canvasBaseUrl);
    }

    get courseService() {
        return this.courses;
    }

    get assignmentsService() {
        return this.assignments;
    }

    get userService() {
        return this.users;
    }
};