import { Probot } from "probot";
import * as data from "../languages.json";
import fetch from "node-fetch";

type Lang = {
  aliases: string[];
  language: string;
  version: string;
};

export = (app: Probot) => {
  app.on("pull_request.opened", async (context) => {
    context.log(`Pull request opened: ${context.payload.pull_request.title}`);
  });

  app.on("pull_request_review_comment.created", async (context) => {
    const comment = context.payload.comment.body;
    const commentId = context.payload.comment.id;

    if (comment.startsWith("/execute")) {
			const language = comment.split(" ")[1];
			const fileContent = context.payload.comment.diff_hunk;
			var startLine = context.payload.comment.start_line;
			var endLine = context.payload.comment.original_line;
      const actualStartLine = Number(fileContent.split(" ")[1].split(",")[0].split("+")[1]);
      // const actualEndLine = Number(fileContent.split(" ")[1].split(",")[1].split("+")[1]);
      endLine = endLine! - startLine!;
      startLine = startLine! - actualStartLine + 1;
      endLine = startLine! + endLine!;

      const content = fileContent.split("\n").slice(startLine!, endLine!).filter((line) => !line.startsWith("-")).join("\n");
      console.log(startLine, endLine, content);

      const output = await checkLanguage(language, content);
      
			context.octokit.pulls.createReplyForReviewComment({
				owner: context.payload.repository.owner.login,
				repo: context.payload.repository.name,
				pull_number: context.payload.pull_request.number,
				comment_id: commentId,
				body: "testing 123",
      });

      console.log(output);
		}
  });
};

const checkLanguage = async (language: string, content: string) => {
  var version = "";
  data.languages.forEach((element: Lang) => { 
    if (element.aliases.includes(language)) {
      language = element.language;
      version = element.version;
    }
  });
  console.log(language, version);

  const res = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    body: JSON.stringify({
      language: language,
      version: version,
      files: [
        {
          content: content,
        },
      ],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const message: any = await res.json();
    console.log(message);
    return message.message;
  }
  const response: any = await res.json();
  console.log(response);
  return response.run.output;
}
