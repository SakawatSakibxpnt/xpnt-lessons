import { config } from "dotenv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
//import { Document } from "@langchain/core/document";
import { createStuffDocumentsChain } from "@langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
config();

//## model initialization
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY, //required
    modelName: "gpt-3.5-turbo", //default
    temperature: 0.7, //1->more creative, 0-> more deterministic
    maxTokens: 1000, //maximum number of tokens to generate in the response
})

//## Creating a prompt template
const prompt = ChatPromptTemplate.fromTemplate(
    `Answer the user's question.
    Context: {context}
    Question: {input}` //for retrieval chain we must need to use 'context' 'input' variable
);

//## Creating a chain with 'createStuffDocumentsChain'
//const chain = prompt.pipe(model); //old way
const chain = await createStuffDocumentsChain({
    llm: model, 
    prompt: prompt
}); //use this way to add documents to the chain

//## Creating Hardcoded document
// const docA = new Document({
//     pageContent: "This is a document",
//     metadata: {
//         source: "source1",
//     },
// });

// const docB = new Document({
//     pageContent: "This is another document",
//     metadata: {
//         source: "source2",
//     },
// });

//## Load data from webpage using loader
const loader = new CheerioWebBaseLoader(
    "https://www.google.com/search?q=colorful+socks"
)
const docs = await loader.load(); 

//## Split the loaded data
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 30,
})
const splitDocs = splitter.splitDocuments(docs)

//## Instantiate OpenAI Embeddings
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
})

//## Store the documents in Memory vector store
const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);

//## Configure Retriever
const retriever = vectorStore.asRetriever({
    k:2, //number of documents to retrieve
});

//## Create the retrieval chain
const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retriever,
});


//## Call the chain with Document context
const response = await retrievalChain.invoke({ 
    input: "colorful socks",
    //context: [docA,docB] //Now I can add documents to the chain because I'm using 'createStuffDocumentsChain'
    //context: docs //data from web page
    //----// No need to add 'context' because I'm using 'createRetrievalChain'
});
console.log(response);