import type { FlowProducer } from "bullmq";

import type { IngestionFlowPort } from "./ingestion.port.js";

export class BullMQIngestionFlow implements IngestionFlowPort {
    constructor(
        private flowProducer: FlowProducer,
    ) {};

    async enqueueIngestionFlow(data: { ingestionId: string; userId: string; canvasBaseUrl: string }) {
        await this.flowProducer.add(
            {
                name: `courses:${data.ingestionId}`,
                queueName: "courses",
                data,
                children: [
                    {
                        name: `enrollment:${data.ingestionId}`,
                        queueName: "enrollment",
                        data,
                    },
                ],
            },

        );
    };
}