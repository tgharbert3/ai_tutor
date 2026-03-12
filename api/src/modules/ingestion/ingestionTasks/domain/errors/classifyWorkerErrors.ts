import { CanvasHttpError } from "@/infrastructure/canvas/errors.js";

import { InternalClientError, TaskNotClaimable, UnhandledTaskError } from "./errorsTypes.js";

type WorkerErrorAction = "retry" | "failed" | "bug";

export function classifyWorkerError(error: unknown): WorkerErrorAction {
    if (error instanceof TaskNotClaimable) {
        return "failed";
    }
    if (error instanceof InternalClientError) {
        return "failed";
    }
    if (error instanceof CanvasHttpError) {
        return "failed";
    }
    if (error instanceof UnhandledTaskError) {
        return "retry";
    }
    return "bug";
}