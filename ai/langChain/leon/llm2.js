import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

config();

//## model initialization
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY, //required
    modelName: "gpt-3.5-turbo", //default
    temperature: 0.7, //1->more creative, 0-> more deterministic
    maxTokens: 1000, //maximum number of tokens to generate in the response
})


//## Create a prompt template (Method 1) --> to define a simple, single-string template
// const prompt = ChatPromptTemplate.fromTemplate(
//     "What is a good name for a company that makes {product}?"
// );

//## Create a prompt template (Method 2) --> to define a more complex, multi-message template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant that comes up with creative company names."],
    ["human", "What is a good name for a company that makes {product}?"],
]);

//console.log(await prompt.format({ product: "colorful socks" })); //insert values into the template

//## Create Parser
const outputParser = new StringOutputParser();

//## Create a chain to combine the prompt and the model
const chain = prompt.pipe(model).pipe(outputParser);

//## Call the chain
const response = await chain.invoke({ 
    product: "colorful socks" 
});
console.log(response);