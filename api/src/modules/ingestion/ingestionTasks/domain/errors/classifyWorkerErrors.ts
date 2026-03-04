import { TaskNotClaiambale } from "./errorsTypes.js";

type WorkerErrorAction = "retry" | "failed" | "bug";

export function classifyWorkerError(error: unknown): WorkerErrorAction {
    if (error instanceof TaskNotClaiambale) {
        return "failed";
    }
    return "bug";
}