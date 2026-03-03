import type { FlowProducer } from "bullmq";

import type { ParentRef } from "@/modules/ingestion/domain/types.js";

import type { SyllabusFlowPort } from "./syllabus.port.js";

export class BullMQSyllabusFlow implements SyllabusFlowPort {
    constructor(
        private flowProducer: FlowProducer,
    ) {};

    async enqueueSyllabusFlow(ingestionId: string, parent: ParentRef, courseId: number): Promise<void> {
        await this.flowProducer.add(
            {
                name: `dbWrite:syllabus:${ingestionId}`,
                queueName: "dbWrite",

                opts: {
                    parent: {
                        id: parent.parentJobId,
                        queue: parent.parentQueue,
                    },
                },
                children: [
                    {
                        name: `fetch:syllabus:${ingestionId}`,
                        queueName: "canvasFetch",
                        data: courseId,

                    },
                ],
            },

        );
    };
}