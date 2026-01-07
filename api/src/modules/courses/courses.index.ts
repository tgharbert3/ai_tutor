import { CreateRouter } from "@/lib/create-app";

const router = CreateRouter();

router.get("/courses", c => c.json({ message: "courses" }));

export default router;
