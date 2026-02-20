import z from "zod";

export const userDTO = z.object({
    email: z.email().toLowerCase(),
    canvasToken: z.string().min(1),
    canvasBaseUrl: z.string().min(1),
});