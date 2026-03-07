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
            && obj.id === "number"
            && obj.courseId === "number"
            && obj.message === "string"
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
            && obj.id === "number"
            && obj.courseId === "number"
            && obj.enrollmentState === "string"
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
            && obj.id === "number"
            && obj.name === "string"
            && obj.course_code === "string"
            && obj.syllabus_body === "string"
            && obj.workflow_state === "string"
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
            && obj.id === "string"
            && obj.html_url === "string"
        );
    }
}

export class CanvasClientFactory implements CanvasApiPortFactory {
    create(deps: { apiToken: string; canvasBaseUrl: string }): CanvasApiPort {
        return new CanvasClient(deps.apiToken, deps.canvasBaseUrl);
    };
}