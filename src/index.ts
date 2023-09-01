import { Probot } from "probot";
import * as data from "../languages.json";
const fetch = require("node-fetch");

type Lang = {
	aliases: string[];
	language: string;
	version: string;
};

export = (app: Probot) => {
	app.on("pull_request.opened", async (context) => {
		console.log(`Pull request opened: ${context.payload.pull_request.title}`);
	});

	app.on("pull_request_review_comment.created", async (context) => {
		const comment = context.payload.comment.body;
		const commentId = context.payload.comment.id;

		if (comment.startsWith("/execute")) {
			const language = comment.split(" ")[1];
			const fileContent = context.payload.comment.diff_hunk;
			var startLine = context.payload.comment.start_line;
			var endLine = context.payload.comment.original_line;
			const actualStartLine = Number(
				fileContent.split("@@ -")[1].split("+")[1][0]
			);
			const relativeStartLine = Number(startLine);
			const relativeEndLine = Number(endLine);
			const content = extractLines(
				fileContent,
				actualStartLine,
				relativeStartLine,
				relativeEndLine
			);

			console.log("final parsed content: ", content);
			const output = await checkLanguage(language, content);

			context.octokit.pulls.createReplyForReviewComment({
				owner: context.payload.repository.owner.login,
				repo: context.payload.repository.name,
				pull_number: context.payload.pull_request.number,
				comment_id: commentId,
				body: output.toString(),
			});

			console.log(output);
		}
	});
};

const filterDiffHunk = (diffHunk: string): string[] => {
	let lines = diffHunk.split("\n");
	lines = lines.filter((line) => !line.startsWith("-"));
	return lines;
};

const extractLines = (
	lines: string,
	actualStartLine: number,
	relativeStartLine: number,
	relativeEndLine: number
): string => {
	let filteredLines = filterDiffHunk(lines);
	filteredLines = filteredLines.map((line) =>
		line.startsWith("+") ? line.slice(1) : line
  );
  let extractedLines = filteredLines.slice(1);
   extractedLines = filteredLines.slice(
		actualStartLine - relativeStartLine + 1,
		relativeEndLine - relativeStartLine + 2
  );

  console.log("actual start line: ", actualStartLine);
  console.log("relative start line: ", relativeStartLine);
  console.log("relative end line: ", relativeEndLine);
  console.log("filtered lines: ", filteredLines);
  console.log("extraced lines: ", extractedLines);
  
	let finalParsedContent = extractedLines.join("\n");
	return finalParsedContent;
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
		return message.message;
	}
	const response: any = await res.json();
	console.log(response);
	return response.run.output;
};
