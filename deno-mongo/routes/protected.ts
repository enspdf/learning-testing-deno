import { Router, Context } from "https://deno.land/x/oak/mod.ts";
const protectedRouter = new Router();
import token from "../util/token.ts";

protectedRouter.get("/me", (ctx: Context) => {
    const authorization = ctx.request.headers.get("authorization");
    const headerToken = authorization?.replace("Bearer ", "");
    const payloa = token.fetchUserId(headerToken!);
});

export default protectedRouter;