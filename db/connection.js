import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "semester_budget_planner";

if (!uri) {
  throw new Error("MONGO_URI is missing. Create a .env file based on .env.example.");
}

const client = new MongoClient(uri);
let database;

export async function connectToDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(dbName);
    await createIndexes(database);
  }
  return database;
}

async function createIndexes(db) {
  await db.collection("budgets").createIndex({ category: 1, semester: 1 });
  await db.collection("transactions").createIndex({ budgetId: 1 });
  await db.collection("transactions").createIndex({ date: -1 });
  await db.collection("transactions").createIndex({ type: 1 });
}

export function getCollection(name) {
  if (!database) {
    throw new Error("Database is not connected yet.");
  }
  return database.collection(name);
}

export async function closeDatabaseConnection() {
  await client.close();
  database = null;
}
