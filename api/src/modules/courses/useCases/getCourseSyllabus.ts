import type { GetCourseSyllabusDeps } from "../domain/types.js";

export class GetCourseSyllabus {
    constructor(
        private readonly getCourseTabsDeps: GetCourseSyllabusDeps,
    ) {};

    async execute(userId: string, canvasCourseId: number) {
        const courseId = await this.getCourseTabsDeps.enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId(userId, canvasCourseId);
        const syllabus = await this.getCourseTabsDeps.courseInfoRepo.getCourseSyllabus(courseId);
        return syllabus;
    };
}