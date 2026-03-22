import type { GetCourseTabsDeps } from "../domain/types.js";

export class GetCourseTabs {
    constructor(
        private readonly getCourseTabsDeps: GetCourseTabsDeps,
    ) {};

    async execute(userId: string, canvasCourseId: number) {
        const allowedTabs = ["syllabus", "assignments", "home"];
        const courseId = await this.getCourseTabsDeps.enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId(userId, canvasCourseId);
        const tabIds = await this.getCourseTabsDeps.courseInfoRepo.getCourseTabs(courseId);
        // console.log(`tabids: ${tabIds}`);
        const tabs = tabIds.filter(tab => allowedTabs.includes(tab));
        return tabs;
    };
}