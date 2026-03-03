export class FetchCanvasWorkerScope {
    constructor(
        private readonly courseId: number,
    ) {};

    // TODO: Possibly wrap in try catch or result pattern to be able to update to failed if the job fails
    async execute() {}
}