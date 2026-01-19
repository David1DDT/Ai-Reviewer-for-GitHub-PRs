import { NextFunction, Request, Response } from "express"
import { link } from "node:fs"
import { openai } from "../../utils/openai"
import { userModel } from "../user/user.model"
import { pullRequestModel } from "./pullRequest.model"

export const cleanLink = (req: Request<{}, {}, { link: string }>, res: Response, next: NextFunction) => {
    const pullLink = req.body.link
    // console.log(pullLink)
    req.body.link = pullLink.split("{/number}")[0].trim()
    next()
}

export const analyzePr = async (req: Request, res: Response) => {
    const pr = await pullRequestModel.findOne({ githubId: req.body.id })
    if (pr) {
        return res.json({ createdPr: pr })

    }

    const link = req.body.link.split("/repos")[1].replace("pulls", "pull")



    // console.log(link)
    const user = await userModel.findById((req as any).user.userId)

    const diff = await fetch(`https://github.com${link}.diff`, {
        headers: {
            Authorization: `token ${user?.accessToken}`,          // user token
            Accept: "application/vnd.github.v3.diff",
            // "X-GitHub-Client-Id": process.env.GITHUB_CLIENT_ID!,      // from env
            // "X-GitHub-Client-Secret": process.env.GITHUB_CLIENT_SECRET! // from env
        }
    })
    const diffText = await diff.text()

    if (!diffText) {
        return res.json({ error: 404 })
    }

    // console.log(diffText)

    const systemPrompt = `
You are an automated GitHub Pull Request code reviewer.

Your task:
- Analyze the provided pull request diff
- Detect bugs, logical errors, security issues, performance problems, and bad practices
- Check code quality, readability, maintainability, and consistency
- Identify breaking changes
- Explain clearly what is wrong and WHY it is wrong, as if speaking to the PR author
- Suggest concrete fixes

Rules:
- Analyze ONLY the provided diff
- Do NOT assume missing files or context
- Do NOT include markdown
- Do NOT include commentary outside JSON
- Output MUST be valid JSON only
  `.trim();
    const userPrompt = `
Analyze the following GitHub Pull Request diff.

You must explain to the pull request author what was wrong, why it is wrong,
and how to fix it.

PR_DIFF:
<<<
${diffText}
>>>

Return a JSON object with EXACTLY the following structure:

{
  "overall_status": "right" | "wrong",
  "confidence_score": number,
  "summary": string,
  "author_feedback": {
    "message": string,
    "main_problems": [string],
    "what_to_fix_first": string
  },
  "issues": [
    {
      "type": "bug" | "security" | "performance" | "style" | "logic" | "breaking-change" | "best-practice",
      "severity": "low" | "medium" | "high" | "critical",
      "file": string,
      "line": string,
      "what_is_wrong": string,
      "why_it_is_wrong": string,
      "how_to_fix": string
    }
  ],
  "positive_points": [
    {
      "file": string,
      "description": string
    }
  ],
  "recommendations": [string],
  "ready_to_merge": boolean
}
  `.trim();


    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.2,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    });


    const content = completion.choices[0].message.content;

    if (!content) {
        return res.json({ error: "Empty response from OpenAI" })
    }

    try {
        var json = JSON.parse(content)
    } catch {
        return res.json({
            error: "Invalid JSON returned by OpenAI"
        })
    }

    const createdPr = await pullRequestModel.create({
        githubId: req.body.id,
        repoOwnerUsername: user?.username,
        prAuthorUsername: req.body.prAuthorUsername,
        prJson: JSON.stringify(json),
    })

    return res.json({ createdPr })
}

export const allPrs = async (req: Request<{}, {}, { link: string }>, res: Response) => {
    const user = await userModel.findById((req as any).user.userId)

    const prsRes = await fetch(req.body.link, {
        headers: {
            Authorization: `token ${user?.accessToken}`,          // user token
            Accept: "application/vnd.github+json",              // GitHub API version
            "X-GitHub-Client-Id": process.env.GITHUB_CLIENT_ID!,      // from env
            "X-GitHub-Client-Secret": process.env.GITHUB_CLIENT_SECRET! // from env
        }
    })
    const prs = await prsRes.json()
    // console.log(prs)
    res.json(prs)
}