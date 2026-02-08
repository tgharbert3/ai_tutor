import { fetchAssignmentsFromCanvas } from "./assignments.client.js";

export class AssignmentsService {
    private apiToken: string;
    private canvasBaseUrl: string;

    constructor(apiToken: string, canvasBaseUrl: string) {
        this.apiToken = apiToken;
        this.canvasBaseUrl = canvasBaseUrl;
    }

    async fetchAssignments(courseId: number) {
        const response = await fetchAssignmentsFromCanvas(this.apiToken, this.canvasBaseUrl, courseId);
    }
}