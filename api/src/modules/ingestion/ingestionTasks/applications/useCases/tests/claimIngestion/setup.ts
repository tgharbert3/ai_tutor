import { makeMockIngestionTaskRepo } from "@/modules/ingestion/tests/mockingFactory.js";

export type mockClaimIngestionDeps = ReturnType<typeof makeMockClaimIngestionDeps>;

export function makeMockClaimIngestionDeps() {
    return makeMockIngestionTaskRepo();
}