import os
import warnings
from dotenv import load_dotenv
import sys
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_groq import ChatGroq
from langchain.document_loaders import PyPDFLoader
from langchain.agents import create_openai_tools_agent, AgentExecutor, tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
warnings.filterwarnings("ignore")  # Ignore warnings.


load_dotenv()
# This connection string may change during deployment.
CONNECTION_STRING = os.getenv("CONSTR")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
COLLECTION_NAME = sys.argv[1]
USER_QUERY = sys.argv[2]
# Can also extract chat history here (if provided).
embedding_schema = OpenAIEmbeddings(
    api_key=OPENAI_API_KEY, model="text-embedding-3-small")
# Set temperature to 0 for reproducible output
llm = ChatOpenAI(temperature=0, api_key=OPENAI_API_KEY)
retriever = PGVector(embeddings=embedding_schema, collection_name=COLLECTION_NAME,
                     connection=CONNECTION_STRING).as_retriever()


def generate(query: str, chat_history, retriever):
    # This is my retriever tool that the agent will choose to invoke when appropriate.
    # The current sys prompt asks it to always invoke this tool.
    @tool
    def retriever_tool(query):
        "Searches and returns relevant documents to user queries regarding the uploaded document. In case the user asks for a summary, return all chunks."
        docs = retriever.get_relevant_documents(query)
        return docs

    tools = [retriever_tool]
    sys_prmpt = """
                You are a helpful assistant that has been provided document(s) that you will use to
                answer questions that the user asks.
                Whenever given a query, follow this protocol to answer:
                1. Always call your retrieval tool to fetch the data relevant to answering the user query.
                2. Augment the retrieved results and answer the user query.
                3. Mention the file name through which this data was retrieved. NEVER RETURN THE FULL PATH.
                If the retrieved chunk is irrelevant to the question, answer it normally as best you can.
                FOLLOW THIS PROTOCOL AT ALL TIMES.
                 """
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", sys_prmpt),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ]
    )
    agent = create_openai_tools_agent(
        llm=llm, tools=tools, prompt=prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools)
    result = agent_executor.invoke({
        "input": query,
        "chat_history": chat_history
    })
    return result["output"]


if __name__ == "__main__":
    output = generate(USER_QUERY, [], retriever)
    print(output)
