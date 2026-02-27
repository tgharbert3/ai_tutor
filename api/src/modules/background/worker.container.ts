import type { QueueOptions } from "bullmq";

import type { db } from "@/lib/types.js";

import { EnrollmentWorker } from "./enrollments/enrollment.worker.js";

export class WorkerContainer {
    private _enrollmentWorker: EnrollmentWorker | undefined;

    constructor(
        private readonly redis: QueueOptions,
        private readonly db: db,
    ) {}

    // Need to start workers early as possible
    public initWorkers(): void {
        const workers = [
            this.enrollmentWorker,
        ];

        workers.forEach((w) => {
            console.log(`starting workers: ${w.name}`);
        });
    }

    get enrollmentWorker(): EnrollmentWorker {
        if (!this._enrollmentWorker) {
            this._enrollmentWorker = new EnrollmentWorker(this.db, this.redis);
        }
        return this._enrollmentWorker;
    }

    public async shutdown() {
        if (this._enrollmentWorker) {
            await this._enrollmentWorker.shutdown();
        }
    }
}