// External Dependencies
import * as mongoDB from "mongodb";
import dotenv from "dotenv";
import path from "path";

// Global Variables
export const collections: { transaction?: mongoDB.Collection } = {}

// Initialize Connection
export async function connectToDatabase () {
    const env = dotenv.config().parsed
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(env.DB_CONN_STRING)
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME)
   
    const transactionCollection: mongoDB.Collection = db.collection(env.GAMES_COLLECTION_NAME)
 
    collections.transaction = transactionCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${transactionCollection.collectionName}`)
 }