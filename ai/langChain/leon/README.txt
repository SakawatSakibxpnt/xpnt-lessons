
*** Templates ***
## PromptTemplate : used to format a single string, and generally are used for simpler inputs.
## ChatPromptTemplate : used to format a list of messages. These "templates" consist of a list of templates themselves.
----> ChatPromptTemplate.fromTemplate : to define a simple, single-string template
----> ChatPromptTemplate.fromMessages : to define a template with multiple messages

*** OutputParsers ***
## StringOutputParser : used to parse the output in a string.
## CommaSeparatedListOutputParser : used to parse the output in a array of strings.
## StructuredOutputParser : used to parse the output in a structured format (object).

*** Chain ***
## createStuffDocumentsChain : We need this chain to work with 'Document' objects.

*** Web Loader ***
## Cheerio: 'npm i cheerio'

*** Splitter ***
## RecursiveCharacterTextSplitter : 
