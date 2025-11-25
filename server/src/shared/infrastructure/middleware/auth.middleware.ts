import { NextFunction, Request, Response } from "express";
import { RawQlEngine } from "raw_lib";
import mongoAdapter from "../database/connection";
import UserEntity from "../../../domain/entities/user.entity";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("I'm sorry I do not know you");
        }

        const engine = new RawQlEngine(mongoAdapter);

        const resp = await engine.execute<UserEntity>({
            entity: "User",
            type: "get",
            filter: {
                field: "authTokens",
                op: "in",
                value: [token],
            }
        });

        if (resp.status && resp.data && resp.data.type === 'single') {
            req.user = resp.data.item as UserEntity;
            req.token = token;
        } else {
            throw new Error(resp.message);
        }

        next();
    } catch (error: any) {
        return res.error({ status: false, message: error.message || "Unauthorized", data: null });
    }
}
