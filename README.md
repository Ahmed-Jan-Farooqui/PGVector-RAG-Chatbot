# PGVector-RAG-Chatbot

Simple mockup of a RAG chatbot using PGVector alongside a custom backend API written in express to access the scripts.

# Description of scripts

I've distributed the functionality of the chatbot into two scripts.

## setup

This inserts the data into the PGVector database. It takes the following command line arguments:

<ul>
    <li>collection name (this will be seperate for each customer)</li>
    <li>list of document paths.</li>
</ul>
It will insert the embeddings of the provided documents into the provided collection.

## generate

This generates a response for a query the user inputs. It takes the following command line arguments:

<ul>
    <li>collection name</li>
    <li>user query</li>
</ul>
The collection name specifies which documents this bot has access to.
An optional extension to this script is the provision of a chat history array alongside the aforementioned command line arguments.
