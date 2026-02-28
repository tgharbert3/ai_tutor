export interface ClientApiPort {
    getUsersCanvasToken: () => Promise<string>;
}

export interface ClientApiPortFactory {
    create: (deps: {
        apiToken: string;
        canvasBaseUrl: string;
    }) => ClientApiPort;
}