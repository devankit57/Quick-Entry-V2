import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("Missing MONGO_URI in environment variables");
}

const client = new MongoClient(mongoUri);

// Initialize clientPromise immediately
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
