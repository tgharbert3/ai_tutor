export interface IngestionFlowPort {
    enqueueIngestionFlow: (data: { ingestionId: string; userId: string; canvasBaseUrl: string }) => Promise<void>;
}