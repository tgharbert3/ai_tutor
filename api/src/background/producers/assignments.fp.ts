import { FlowProducer } from "bullmq";

const assinmentsProducer = new FlowProducer();

export const loadAssignmentsProducer = await assinmentsProducer.add({
    name: "load_assignments",
    queueName: "insertAssignments",
});
