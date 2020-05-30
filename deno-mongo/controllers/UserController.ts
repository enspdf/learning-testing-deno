import db from "../config/databases.ts";
const users = db.collection("users");
import validation from "../validation.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.7.0/mod.ts";
import hash from "../util/hash.ts";

export default {
    async index(ctx: any) {
        const data = await users.find();
        ctx.response.body = data;
    },
    async show(ctx: any) {
        try {
            const data = await users.findOne({ _id: ObjectId(ctx.params.id) });
            ctx.response.body = data;
        } catch (e) {
            ctx.response.status = 404;
            ctx.response.body = { error: "User doesn't exists in out database" }
        }

    },
    async store(ctx: any) {
        const value = await validation.validate(ctx);
        value.created_at = parseInt((new Date().getTime() / 1000).toString());
        value.password = hash.bcrypt(value.password)

        if (value) {
            const insertId = await users.insertOne(value);
            ctx.response.status = 201;
            ctx.response.body = insertId;
        }
    },
    async update(ctx: any) {
        const value = await validation.validateUpdate(ctx);

        if (value) {
            const data = { email: value.email, name: value.name, password: value.password }

            try {
                await users.updateOne({ _id: ObjectId(ctx.params.id) }, {
                    $set: data
                });

                ctx.response.status = 200;
                ctx.response.body = { message: "Updated" }
            } catch (e) {
                ctx.response.status = 404;
                ctx.response.body = { error: "User doesn't exists in our database" }
            }
        }
    },
    async destroy(ctx: any) {
        try {
            await users.deleteOne({ _id: ObjectId(ctx.params.id) })
            ctx.response.status = 204;
        } catch (e) {
            ctx.response.status = 404;
            ctx.response.body = { error: "User doesn't exists in our database" }
        }
    }
}