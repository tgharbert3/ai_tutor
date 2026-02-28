import type { CanvasApiPort, CanvasApiPortFactory } from "./ports/cavans.api.port.js";
import type { CanvasEnrollment } from "./types.js";

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
}

export class CanvasClientFactory implements CanvasApiPortFactory {
    create(deps: { apiToken: string; canvasBaseUrl: string }): CanvasApiPort {
        return new CanvasClient(deps.apiToken, deps.canvasBaseUrl);
    };
}