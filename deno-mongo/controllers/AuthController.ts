import db from "../config/databases.ts";
const userCollection = db.collection("users");
import validation from "../validation.ts";
import hash from "../util/hash.ts";
import token from "../util/token.ts";

export default {
    async login(ctx: any) {
        const value = await validation.validateLogin(ctx);

        if (!value) {
            ctx.response.status = 422;
            ctx.response.body = { error: "Please provide required data" };
            return;
        }

        const user = await userCollection.find({ email: value.email });

        if (!user) {
            ctx.response.status = 422;
            ctx.response.body = { error: "Credentials doesn't match our records" };
            return;
        }

        const passwordMatched = await hash.verify(user.password, value.password);

        if (!passwordMatched) {
            ctx.response.body = { error: "Credentials doesn't match" };
            return;
        }

        ctx.response.body = token.generate(user._id.$oid);


    }
}