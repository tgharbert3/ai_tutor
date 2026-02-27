export class CanvasHttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly path: string,
    ) {
        super(`Canvas HTTP error ${status} for path ${path}`);
    };
}