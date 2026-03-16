import { CanvasHttpError, InternalClientError, InvalidCanvasData, TaskNotClaimable, UnhandledTaskError } from "./errorsTypes.js";

type WorkerErrorAction = "retry" | "failed" | "bug" | "noop";

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
    if (error instanceof InvalidCanvasData) {
        return "noop";
    };
    if (error instanceof UnhandledTaskError) {
        return "retry";
    }
    return "bug";
}