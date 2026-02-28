export interface ClientApiPort {
    getUsersCanvasToken: () => Promise<string>;
}

export interface ClientApiPortFactory {
    create: (userId: string) => ClientApiPort;
}