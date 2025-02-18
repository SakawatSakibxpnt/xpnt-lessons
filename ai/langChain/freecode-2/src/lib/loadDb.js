import { DataAPIClient } from "@datastax/astra-db-ts";
import {PuppeteerWebBaseLoader} from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import { config } from "dotenv";

config();

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const f1Data = [
    'https://anyurl.com/',
    'https://anyurl.com/',
    'https://anyurl.com/',
]

const astraClient = DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = astraClient.db(ASTRA_DB_ENDPOINT,{namespace:ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
})

const createCollection = async () => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION,{
        vector:{
            dimension: 1536,
            metric: "cosine",
        }
    })

    console.log(res)
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of f1Data){
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await (const chunk of chunks){
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float",
            })

            const vector = embedding.data[0].embedding
            const res = await collection.insertOne({
                text: chunk,
                $vector: vector,
                
            })
        }
    }
}

const scrapePage = async (url) => {
    const loader = new PuppeteerWebBaseLoader(url,{
        launchOptions: {
            headless: true,
        },
        gotoOptions: {
            waitUntil: "domcontentloaded",
        },
        evaluate: async (page,browser) => {
            const result = await page.evaluate(()=> document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(()=>loadSampleData())

//########################//
//###### FLOW ############//
//########################//
// webscraping (puppeteer) -> chunking (splitter) -> embedding (openAI)-> store in db (Astra)