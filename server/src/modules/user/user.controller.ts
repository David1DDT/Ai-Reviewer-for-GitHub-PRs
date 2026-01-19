import { Request, Response } from "express";
import { userModel } from "./user.model";
import jwt from 'jsonwebtoken'

export const githubRedirect = (req: Request, res: Response) => {
    const url =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${process.env.GITHUB_CLIENT_ID}` +
        `&scope=read:user user:email`;

    res.redirect(url);
}

export const githubCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;

    const tokenRes = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        }
    );

    const tokenData = await tokenRes.json();

    const userRes = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    });

    const githubUser = await userRes.json();

    let user = await userModel.findOne({ githubId: githubUser.id });

    if (!user) {
        user = await userModel.create({
            githubId: githubUser.id,
            username: githubUser.login,
            email: githubUser.email,
            avatarUrl: githubUser.avatar_url,
            accessToken: tokenData.access_token, // store here
        });
    } else {
        user.accessToken = tokenData.access_token
        await user.save()
    }


    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    res
        .cookie("accessToken", token, {
            httpOnly: true, // JS can’t access it
            secure: process.env.NODE_ENV === "production", // false for localhost
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .redirect("http://127.0.0.1:3000/dashboard")

}

export const logout = (req: Request, res: Response) => {
    // Clear the cookie
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
        sameSite: "strict",
        path: "/", // make sure path matches cookie path
    });

    res.redirect("http://127.0.0.1:3000")
}