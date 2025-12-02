export function test(req: Request,): Response {
    const message = "Hello from test con";
    return new Response(message, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        }
    });
}