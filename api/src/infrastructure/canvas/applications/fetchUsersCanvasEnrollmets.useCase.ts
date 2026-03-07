import type { CanvasApiPortFactory } from "../ports/canvas.api.port.js";
import type { CanvasEnrollment } from "../types.js";

export class FetchUsersCanvasEnrollmentsUseCase {
    constructor(
        private readonly canvasFactory: CanvasApiPortFactory,
    ) {};

    async execute(apiToken: string, canvasBaseUrl: string): Promise<CanvasEnrollment[]> {
        const client = this.canvasFactory.create({ apiToken, canvasBaseUrl });
        const enrollmets = await client.getCanvasEnrollments();
        if (!enrollmets) {
            throw new Error("Unable to fetch users enrollments");
        }

        return enrollmets;
    }
}