import { createFactory } from "hono/factory";

const factory = createFactory();

// export async function handleLogin(c: Context) {
//     return c.json({ messaage: "Successfully logged in" }, 200);
// }

// export async function handleRegister(c: Context) {
//     return c.json({ messaage: "Successfully registered" }, 200);
// }

export const loginHandlers = factory.createHandlers(
    async (c) => {
        return c.json({ messaage: "Successfully logged in" }, 200);
    },
);
export const registerHandlers = factory.createHandlers(
    async (c) => {
        return c.json({ messaage: "Successfully registered" }, 200);
    },
);
