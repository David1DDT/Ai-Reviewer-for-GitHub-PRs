import { Router } from "express";
import { allPrs, analyzePr, cleanLink } from "./pullRequest.controller";
import { auth } from "../../middleware/deserialiseUser";

export const prRoute = Router()

prRoute.post("/prs", cleanLink, auth, allPrs)

prRoute.post("/review", auth, analyzePr)

