import { Application, Context } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import router from "./routes.ts";
import notFound from "./404.ts";
const env = config();
import token from "./util/token.ts";

const app = new Application();
const HOST = env.APP_HOST || "http://localhost";
const PORT = env.APP_PORT || 4000;

app.use(router.routes());
app.use(async (ctx: Context, next) => {
    const authorization = ctx.request.headers.get("authorization");

    if (!authorization) {
        await next();
        return;
    }

    const headerToken = authorization.replace("Bearer", "");
    const isValid = await token.validate(headerToken);

    if (!isValid) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" }
    }
});
app.use(notFound);
console.log(`server started at ${HOST}:${PORT}`);

await app.listen({ port: 4000 });
