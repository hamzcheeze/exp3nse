import { Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
    if (!uri) {
        throw new Error('MONGODB_URI is not defined');
    }
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
    }

    return { client, db };
}
