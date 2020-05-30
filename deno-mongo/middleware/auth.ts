import { Context } from "https://deno.land/x/oak/mod.ts";
import token from "../util/token.ts";

export default {
    async authorized(ctx: Context, next: any) {
        const authorization = ctx.request.headers.get("authorization");

        if (!authorization) {
            ctx.response.status = 401;
            ctx.response.body = { error: "Unauthorized" }

            return;
        }

        const headerToken = authorization.replace("Bearer", "");
        const isValid = await token.validate(headerToken);

        if (!isValid) {
            ctx.response.status = 401;
            ctx.response.body = { error: "Unauthorized" };

            return;
        }

        await next();
    }
}