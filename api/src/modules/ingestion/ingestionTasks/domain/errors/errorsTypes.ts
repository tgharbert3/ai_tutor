export class TaskNotClaimable extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TaskNotFoundError";
    }
}

export class InternalClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternalClientError";
    }
}

export class UnhandledTaskError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnhandledTaskError";
    }
}

export class InvalidCanvasData extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidCanvasData";
    }
}

export class CanvasHttpError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CanvasHttpError";
    }
}