// import { ChatPromptTemplate, PromptTemplate } from "langchain/prompts";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { ConversationChain } from "langchain/chains";

// type TFiles = {
// 	filename: string;
// 	content: string;
// 	originalContent: string | null;
// };

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

// export const evaluateCodes = async (filesDiff: TFiles[]) => {
// 	const userInput = `Act as an experienced developer and evaluate and review the following code files ` +
// 		`provided to you in a pull request. The goal is to provide a review of the code ` +
// 		`and provide a markdown bullet list of the reviews that you have. The content is ` +
// 		`the following:\n\n` +
// 		`${filesDiff.map((file) => `File: ${file.filename}\n$Content Before modification:\n${file.originalContent}\nContent After Modification:\n${file.content}`).join("\n")}\n`;
	
// 	const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
// 			`This is a code evaluation prompt. The goal is to evaluate the provided code as accurately 
// 			as possible in a markdown bullet format. The following code and question from the user is: {question}`
// 		],
// 		[
// 			"user",
// 			"{question}"
// 		]
//   ]);

// 	const model = new ChatOpenAI({
//     temperature: 0,
//     azureOpenAIApiKey: process.env.AZURE_API_KEY,
//     azureOpenAIApiVersion: process.env.AZURE_API_VERSION,
//     azureOpenAIApiInstanceName: process.env.AZURE_API_INSTANCE_NAME,
//     azureOpenAIApiDeploymentName: process.env.AZURE_GPT4_DEPLOYMENT_NAME,
// 		streaming: true,
// 		cache: true,
// 	});
	
// 	const conversationChain = new ConversationChain({
//     llm: model,
//     prompt: prompt
//   });

// 	console.log(userInput);

	

// 	try {
// 		const llmResponse = await conversationChain.invoke({
//       question: userInput,
//     });
// 		console.log(llmResponse);
// 		return llmResponse;
// 	} catch (err) {
// 		console.log(err);
// 		return "Error: " + err;
// 	}
// }
