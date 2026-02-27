import type { ConnectionOptions } from "bullmq";

import type { db } from "@/lib/types.js";

import { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";

import { AssignmentRepository } from "./assignments/assignment.repo.js";
import { AssignmentService } from "./assignments/assignments.service.js";
import { FetchAssignmentsQueue } from "./background/assignments/assignment.queue.js";
import { EnrollmentQueue } from "./background/enrollments/enrollment.queue.js";
import { CourseRepository } from "./courses/courses.repo.js";
import { CourseService } from "./courses/courses.service.js";
import { EnrollmentRepository } from "./enrollments/adapters/enrollments.repo.js";
import { EnrollmentsService } from "./enrollments/enrollments.service.js";
import { SchoolRepository } from "./schools/adapters/drizzle.school.repo.js";
import { SchoolService } from "./schools/school.service.js";
import { UserRepository } from "./users/adapters/drizzle.user.repo.js";
import { UserService } from "./users/user.service.js";

export class ServiceContainer {
    // Starts as undefined. When it gets called for then it will be memoized
    private _courseService: CourseService | undefined;
    private _userService: UserService | undefined;
    private _schoolService: SchoolService | undefined;
    private _enrollmentService: EnrollmentsService | undefined;
    private _assignmentsService: AssignmentService | undefined;

    private _enrollmentQueue: EnrollmentQueue | undefined;
    private _fetchAssignmentsQueue: FetchAssignmentsQueue | undefined;

    private _canvasClient: CanvasClient | undefined;

    constructor(
        private readonly db: db,
        private readonly redis: ConnectionOptions,
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

    get userService(): UserService {
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
    };

    get enrollmentService(): EnrollmentsService {
        if (!this._enrollmentService) {
            const repo = new EnrollmentRepository(this.db);
            this._enrollmentService = new EnrollmentsService(repo, this.apiToken, this.canvasBaseUrl);
        };
        return this._enrollmentService;
    };

    get assignmentService(): AssignmentService {
        if (!this._assignmentsService) {
            const repo = new AssignmentRepository(this.db);
            this._assignmentsService = new AssignmentService(repo, this.apiToken, this.canvasBaseUrl);
        };
        return this._assignmentsService;
    };

    get enrollmentQueue(): EnrollmentQueue {
        if (!this._enrollmentQueue) {
            this._enrollmentQueue = new EnrollmentQueue(
                { connection: this.redis },
            );
        };
        return this._enrollmentQueue;
    }

    get fetchAssignmentsQueue(): FetchAssignmentsQueue {
        if (!this._fetchAssignmentsQueue) {
            this._fetchAssignmentsQueue = new FetchAssignmentsQueue({
                connection: this.redis,
            });
        }
        return this._fetchAssignmentsQueue;
    }

    // Request Scoped
    get canvasClient(): CanvasClient {
        if (!this._canvasClient) {
            this._canvasClient = new CanvasClient(this.apiToken, this.canvasBaseUrl);
        }
        return this._canvasClient;
    }
};