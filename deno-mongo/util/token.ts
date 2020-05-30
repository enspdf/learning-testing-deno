import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts"

const key = "53cr3t";
const payload: Payload = {
    iss: "sample",
    exp: setExpiration(new Date().getTime() + 60000);
};

const header: Jose = {
    alg: "HS256",
    typ: "JWT"
};

export default {
    generate(): string {
        return makeJwt({ header, payload, key });
    },
    async validate(token: string) {
        return await validateJwt(token, key, { isThrowing: false });
    }
}