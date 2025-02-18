import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";


config();

//## model initialization
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY, //required
    modelName: "gpt-3.5-turbo", //default
    temperature: 0.7, //1->more creative, 0-> more deterministic
    maxTokens: 1000, //maximum number of tokens to generate in the response
})


//## model call
//const response = await model.batch(["Hello", "How are you?"]); //ask multiple questions
//const response = await model.stream('Write a poem about a sunset.'); //stream response
const response = await model.invoke('Hello');

