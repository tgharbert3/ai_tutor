import { AssignmentsService } from "./assignments/assignments.service.js";
import { CourseService } from "./courses/courses.service.js";

export class ServiceContainer {
    private readonly courses: CourseService;
    private readonly assignments: AssignmentsService;

    constructor(apiToken: string, canvasBaseUrl: string) {
        this.courses = new CourseService(apiToken, canvasBaseUrl);
        this.assignments = new AssignmentsService(apiToken, canvasBaseUrl);
    }

    get courseService() {
        return this.courses;
    }

    get assignmentsService() {
        return this.assignments;
    }
};