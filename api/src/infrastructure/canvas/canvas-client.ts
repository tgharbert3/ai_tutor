import type { CanvasApiPort, CanvasApiPortFactory } from "./ports/canvas.api.port.js";
import type { CanvasCourse, CanvasEnrollment, CanvasTab, StreamActivityItem } from "./types.js";

import { CanvasHttpError } from "./errors.js";

export class CanvasClient implements CanvasApiPort {
    constructor(
        private readonly canvasToken: string,
        private readonly canvasBaseUrl: string,
    ) {};

    async getPrimaryColor(): Promise<string | undefined> {
        const response = await this.get<unknown>("brand_variables");
        // Treat the response as unkown and verify its an object
        if (!response || typeof response !== "object") {
            return undefined;
        }
        // Verify that it has the attribute
        const color = (response as any)["ic-brand-primary"];
        // Make sure it is a string
        return typeof color === "string" ? color : undefined;
    };

    async getCanvasEnrollments(): Promise<CanvasEnrollment[] | undefined> {
        const response = await this.get<unknown>("users/self/enrollments");

        if (!this.isCanvasEnrollmentArray(response)) {
            return undefined;
        }
        return response;
    };

    async getCanvasCourseActivityStream(courseId: number): Promise<StreamActivityItem[] | undefined> {
        const response = await this.get<unknown>(`courses/${courseId}/activity_stream`);

        if (!this.isCanvasStreamArray(response)) {
            return undefined;
        }
        return response;
    }

    async getCourseInfo(courseId: number): Promise<CanvasCourse | undefined> {
        const response = await this.get<any>(`courses/${courseId}?include[]=syllabus_body&include[]=tabs`);

        if (response.access_restricted_by_date === true) {
            return undefined;
        }
        if (!this.isCanvasCourse(response)) {
            return undefined;
        }
        return response;
    }

    private build(path: string): string {
        return new URL(`/api/v1/${path}`, this.canvasBaseUrl).toString();
    };

    private async get<T>(path: string): Promise<T> {
        const builtUrl = this.build(path);
        try {
            const response = await fetch(builtUrl, {
                headers: { Authorization: `Bearer ${this.canvasToken}` },
            });

            if (!response.ok) {
                throw new CanvasHttpError(response.status, path);
            }
            return await response.json() as T;
        }
        catch (error: any) {
            console.error("CanvasSession GET error:", error);
            throw new Error(`Canvas GET failed for path: ${path}`);
        }
    }

    private isCanvasActivityStreamItem(obj: any): obj is StreamActivityItem {
        return (
            typeof obj === "object"
            && obj !== null
            && typeof obj.id === "number"
            && typeof obj.courseId === "number"
            && typeof obj.message === "string"
        );
    }

    private isCanvasStreamArray(data: unknown): data is StreamActivityItem[] {
        return (
            Array.isArray(data)
            && data.every(this.isCanvasActivityStreamItem)
        );
    }

    private isCanvasEnrollment(obj: any): obj is CanvasEnrollment {
        return (
            typeof obj === "object"
            && obj !== null
            && typeof obj.id === "number"
            && typeof obj.course_id === "number"
            && typeof obj.enrollment_state === "string"
        );
    };

    private isCanvasEnrollmentArray(data: unknown): data is CanvasEnrollment[] {
        return (
            Array.isArray(data)
            && data.every(this.isCanvasEnrollment)
        );
    }

    private isCanvasCourse(obj: any): obj is CanvasCourse {
        return (
            typeof obj === "object"
            && obj !== null
            && typeof obj.id === "number"
            && typeof obj.name === "string"
            && typeof obj.course_code === "string"
            && typeof obj.syllabus_body === "string"
            && typeof obj.workflow_state === "string"
            && this.isTabArray(obj.tabs)
        );
    }

    private isTabArray(data: unknown): data is CanvasTab[] {
        return (
            Array.isArray(data)
            && data.every(this.isTab)
        );
    }

    private isTab(obj: any): obj is CanvasTab {
        return (
            typeof obj === "object"
            && typeof obj.id === "string"
        );
    }
}

export class CanvasClientFactory implements CanvasApiPortFactory {
    create(deps: { apiToken: string; canvasBaseUrl: string }): CanvasApiPort {
        return new CanvasClient(deps.apiToken, deps.canvasBaseUrl);
    };
}