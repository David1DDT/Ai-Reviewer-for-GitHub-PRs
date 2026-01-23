import { Request, Response, Router } from "express";
import { githubCallback, githubRedirect, logout } from "./user.controller";
import { auth } from "../../middleware/deserialiseUser";
import { userModel } from "./user.model";
const userRoute = Router()

userRoute.get("/github", githubRedirect)
userRoute.get("/github/callback", githubCallback)
userRoute.get("/me", auth, async (req, res) => {
    try {
        const userId = (req as any).user.userId; // <- from JWT payload
        const user = await userModel.findById(userId)
        if (!user) {
            console.error("User not found for ID:", userId)
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User authenticated:", user.username)
        res.json({ user });
    } catch (error) {
        console.error("Error in /me:", error)
        res.status(500).json({ error: "Internal server error" })
    }
});

userRoute.get("/repos", auth, async (req: Request, res: Response) => {
    const user = await userModel.findById((req as any).user.userId)
    // console.log(user?.username)
    const response = await fetch(`https://api.github.com/users/${user?.username}/repos`, {
        headers: {
            Authorization: `token ${user?.accessToken}`,          // user token
            Accept: "application/vnd.github+json",              // GitHub API version
            "X-GitHub-Client-Id": process.env.GITHUB_CLIENT_ID!,      // from env
            "X-GitHub-Client-Secret": process.env.GITHUB_CLIENT_SECRET! // from env
        }
    })
    res.json(await response.json())
})

userRoute.get("/logout", logout)

export default userRoute