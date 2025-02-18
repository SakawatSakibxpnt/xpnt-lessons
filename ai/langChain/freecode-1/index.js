import { RecursiveCharacterTextSplitter  } from "@langchain/textsplitters";
import fs from 'fs/promises'; 
import { config } from "dotenv";
import {createClient} from '@supabase/supabase-js';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

config();

try {
    //#### read the file ####//
    const document = await fs.readFile('sample.txt', 'utf-8'); // Read the file as a string
    const textSplitter = new RecursiveCharacterTextSplitter ({
        chunkSize: 200,
        chunkOverlap: 30,
    });

    //#### split the document into chunks ####//
    const splittedTexts = await textSplitter.createDocuments([document]);

    //#### key variables ####//
    const sbApiKey = process.env.SUPABASE_API_KEY;
    const sbApiUrl = process.env.SUPABASE_URL;
    const openAIApiKey = process.env.OPENAI_API_KEY; //dummy key


    //#### create supabase client ####//
    const supabaseClient = createClient(sbApiUrl, sbApiKey);
    
    //#### embeddings function####//
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: openAIApiKey,
    });

    //#### create vector store ####//
    await SupabaseVectorStore.fromDocuments(splittedTexts, embeddings, {
        client: supabaseClient,
        tableName: 'documents',
        queryName: 'match_documents',
    });
    ///Till this we have created out vector database/// PART 1 COMPLETED****************

    

    //PART 2 : creating a stand alone question//

    //#### USER QUERY ####//
    const userQuery = 'Who is karim? what is his profession? is he a football player?';

    const llm = new ChatOpenAI({
        openAIApiKey: openAIApiKey,
        temperature: 0.5,
    });

     //create embeddings for the stand alone question ####//
     const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
      });

    const retriever = vectorStore.asRetriever();

    function combineDocuments(docs){
        return docs.map((doc)=> doc.pageContent).join('\n\n');
    }

    const standAloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'
    const standAloneQuestionPrompt = PromptTemplate.fromTemplate(standAloneQuestionTemplate)
    const Chain = standAloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever).pipe(combineDocuments); //matched chunks

    const matchedChunkInSinglePara = await Chain.invoke({
        question: userQuery,
    });

    //PART 2 END//

    //PART 3 : Answer the question//
    const answerTemplate = `You are a helpful assistant that answers questions based on the context provided. If you don't know the answer, just say that you don't know. Do not try to make up an answer. 
                            Context: {context}
                            Question: {question}
                            Answer:`
    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

   


} catch (error) {
    console.error(error);
}



 
