export class UniqueError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "UniqueError";
    }
}

export class TokenReuseError extends Error {
    constructor (public message: string) {
        super(message);
        this.name = "TokenReuseError"
    }
};

export class BusyError extends Error {
    constructor (public message: string) {
        super(message);
        this.name = "Busy Error"
    }
}

export class CriticalSecurityError extends Error {
    constructor (public message: string) {
        super(message);
        this.name = "CriticalSecurityError"
    }
}

export class TokenValidationError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "Token Validation Error";
    }
}

export class UserNotFoundError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "User not found";
    }
}