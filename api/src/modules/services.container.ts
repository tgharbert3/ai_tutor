import { CourseService } from "./courses/courses.service";

export class ServiceContainer {
    private readonly courses: CourseService;

    constructor(apiToken: string, canvasBaseUrl: string) {
        this.courses = new CourseService(apiToken, canvasBaseUrl);
    }

    get courseService() {
        return this.courses;
    }
};
