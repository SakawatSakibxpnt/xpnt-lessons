import OpenAI from "openai";
import { OpenAIStream , StreamingTextResponse  } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts";


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

const astraClient = DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = astraClient.db(ASTRA_DB_ENDPOINT,{namespace:ASTRA_DB_NAMESPACE})

export async function POST(req,res){
    try {
        const {messages} = await req.json()
        const lastestMessage = messages[messages.length - 1].content

        let docContext = ""
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: lastestMessage,
            encoding_format: "float",
        })

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null,{
                sort:{
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
            })

            const documents = await cursor.toArray()

            const docsMap = documents?.map(doc => doc.text)

            docContext = JSON.stringify(docsMap)

        } catch (error) {
            console.log(error)
            docContext = ""
        }

        const template = {
            role: "system",
            content: `give instruction to ai, START CONTEXT: ${docContext} END CONTEXT , QUESTION: ${lastestMessage}`,
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            stream: true,
            messages: [template, ...messages],
        })

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
        
    } catch (error) {
        console.log(error)
    }
}