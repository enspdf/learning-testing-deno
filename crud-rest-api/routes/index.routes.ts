import { Router } from "https://deno.land/x/oak/mod.ts";
import * as indexCtrl from "../controllers/index.controller.ts";

const router = new Router();

router
    .get("/users", indexCtrl.getUsers)
    .get("/user/:id", indexCtrl.getUser)
    .post("/users", indexCtrl.createUser)
    .delete("/users/:id", indexCtrl.deleteUser)
    .put("/users/:id", indexCtrl.updateUser);

export default router;