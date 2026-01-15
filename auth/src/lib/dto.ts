import z from "zod";

export const loginDTO = z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(8, "Password must be 8 charcters long"),
});

export const registerDTO = z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(8, "Password must be 8 charcters long").max(100),
    username: z.string().min(3),
    canvasToken: z.string().min(1, "Canvas Token is required").trim(),
});

export type loginDtoType = z.infer<typeof loginDTO>;
export type registerDtoType = z.infer<typeof registerDTO>;
