import * as data from "../languages.json";
const fetch = require("node-fetch");

type Lang = {
	aliases: string[];
	language: string;
	version: string;
};

export const checkLanguage = async (language: string, content: string) => {
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
};
