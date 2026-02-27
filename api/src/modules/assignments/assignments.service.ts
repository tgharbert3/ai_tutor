import type { AssignmentRepository } from "./assignment.repo.js";

export class AssignmentService {
    constructor(
        private readonly repo: AssignmentRepository,
        private apiToken: string,
        private canvasBaseUrl: string,
    ) {
    }

    // async fetchAssignments(courseId: number) {
    //     const response = await this.repo.fetchAssignmentsFromCanvas(this.apiToken, this.canvasBaseUrl, courseId);
    // }
}