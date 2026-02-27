import type { FlowProducer } from "bullmq";

import type { EnrollmentQueuePort } from "./ports/enrollment.queue.port.js";

export class BullMQEnrollmentQueue implements EnrollmentQueuePort {
    constructor(
        private flowProducer: FlowProducer,
    ) {};

    async enqueueEnrollmentFlow(data: { ingestionId: string; userId: string; schoolId: number }) {
        await this.flowProducer.add(
            {
                name: `enrollment:${data.ingestionId}`,
                queueName: "enrollment",
                data,
            },
        );
    };
}