import type { insertCourseType } from "@/db/schema.js";

import * as CanvasAdapter from "./courses.adapter.js";
import * as CanvasClient from "./courses.client.js";
import * as CanvasRepo from "./courses.repo.js";

export class CourseService {
    private apiToken: string;

    constructor(apiToken: string) {
        this.apiToken = apiToken;
    }

    async syncCourses(): Promise<insertCourseType[]> {
        const rawCourses = await CanvasClient.fetchCoursesFromCanvas();
        const adaptedCourses = CanvasAdapter.mapCoursesToDb(rawCourses);
        const insertedCourses = await CanvasRepo.upsertManyCourses(adaptedCourses);
        return insertedCourses;
    };
}
