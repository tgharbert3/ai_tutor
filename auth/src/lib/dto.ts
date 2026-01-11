import z from "zod";

export const loginDTO = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(1),
});

export const registerDTO = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(1),
    username: z.string().min(1),
    canvasToken: z.string().min(1).trim(),
});

export type loginDtoType = z.infer<typeof loginDTO>;
export type registerDtoType = z.infer<typeof registerDTO>;
