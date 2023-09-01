import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";

export const explainCode = async (content: string): Promise<string> => {
	const prompt = new PromptTemplate({
		template:
			`This is a code explanation prompt. The goal is to explain the provided code
			 as accurately as possible in a markdown bullet format. The following code is: {question}\n`,
		inputVariables: ["question"],
	});

	const model = new OpenAI({
		modelName: "text-davinci-003",
		temperature: 0.9,
	});

	const input = await prompt.format({
		question: content,
	});

	console.log(input);

	try {
		const result = await model.call(input);
		console.log(result);
		return result;
	} catch (err) {
		console.log(err);
    return "Error: " + err;
	}
};
