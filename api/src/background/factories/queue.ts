import { Queue, QueueOptions } from "bullmq";


export function createQueue(queueName: string, options?: QueueOptions | undefined) {
    const queue = new Queue(queueName, options);
    return queue
};