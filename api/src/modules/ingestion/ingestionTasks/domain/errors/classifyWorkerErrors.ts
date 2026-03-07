import { TaskNotClaimable } from "./errorsTypes.js";

type WorkerErrorAction = "retry" | "failed" | "bug";

export function classifyWorkerError(error: unknown): WorkerErrorAction {
    if (error instanceof TaskNotClaimable) {
        return "failed";
    }
    return "bug";
}