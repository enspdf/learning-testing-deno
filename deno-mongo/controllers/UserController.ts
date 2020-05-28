import db from "../config/databases.ts";
const users = db.collection("users");

export default {
    async index(ctx: any) {
        const data = await users.find();
        ctx.response.body = data;
    },
    async show(ctx: any) {
        const data = await users.findOne({ _id: { $oid: ctx.params.id } });
        ctx.response.body = data;
    },
    async store(ctx: any) {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = { error: "Please provide the required data" }
            return;
        }

        const { value } = await ctx.request.body();

        if (!value.email) {
            ctx.response.status = 422;
            ctx.response.body = { error: "Email field is required" }
            return;
        }

        if (!value.name) {
            ctx.response.status = 422;
            ctx.response.body = { error: "Name field is required" }
            return;
        }

        if (!value.password) {
            ctx.response.status = 422;
            ctx.response.body = { error: "Password field is required" }
            return;
        }

        const insertId = await users.insertOne(value);

        ctx.response.status = 201;
        ctx.response.body = insertId;
    },
    async update(ctx: any) {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = { error: "Please provide the required data" }
            return;
        }

        const { value } = await ctx.request.body();
        const data = { email: value.email, name: value.name, password: value.password }
        await users.updateOne({ _id: { $oid: ctx.params.id } }, {
            $set: data
        });

        ctx.response.status = 200;
        ctx.response.body = { message: "Updated" }
    },
    async destroy(ctx: any) {
        await users.deleteOne({ _id: { $oid: ctx.params.id } })

        ctx.response.status = 204;
    }
}