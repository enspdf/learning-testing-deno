import { Application, Context } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import router from "./routes/normal.ts";
import protectedRouter from "./routes/protected.ts";
import notFound from "./404.ts";
const env = config();
import autheMiddleware from "./middleware/auth.ts";

const app = new Application();
const HOST = env.APP_HOST || "http://localhost";
const PORT = env.APP_PORT || 4000;

app.use(router.routes());
app.use((ctx: Context, next: any) => autheMiddleware.authorized(ctx, next));
app.use(protectedRouter.routes());
app.use(notFound);
console.log(`server started at ${HOST}:${PORT}`);

await app.listen({ port: 4000 });
