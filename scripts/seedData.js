import dotenv from "dotenv";
import { connectToDatabase, closeDatabaseConnection } from "../db/connection.js";

dotenv.config();

const categories = [
  {
    category: "Tuition",
    semester: "Fall 2026",
    limitAmount: 15000,
    currency: "USD",
    notes: "Large semester payment",
  },
  {
    category: "Rent",
    semester: "Fall 2026",
    limitAmount: 6400,
    currency: "USD",
    notes: "Four months of housing",
  },
  {
    category: "Food",
    semester: "Fall 2026",
    limitAmount: 2800,
    currency: "USD",
    notes: "Groceries and restaurants",
  },
  {
    category: "Transportation",
    semester: "Fall 2026",
    limitAmount: 700,
    currency: "USD",
    notes: "Subway, rideshare, and airport trips",
  },
  {
    category: "Travel",
    semester: "Fall 2026",
    limitAmount: 1600,
    currency: "USD",
    notes: "Break trips and flights",
  },
  {
    category: "Family Support",
    semester: "Fall 2026",
    limitAmount: 12000,
    currency: "USD",
    notes: "Money received from family",
  },
];

function randomAmount(index, type) {
  if (type === "income") {
    return 400 + (index % 9) * 120;
  }
  return 12 + (index % 17) * 9;
}

function randomDate(index) {
  const month = 8 + (index % 4);
  const day = 1 + (index % 27);
  return `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

try {
  const db = await connectToDatabase();
  await db.collection("budgets").deleteMany({});
  await db.collection("transactions").deleteMany({});

  const budgetResult = await db.collection("budgets").insertMany(
    categories.map((budget) => ({
      ...budget,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );

  const budgetIds = Object.values(budgetResult.insertedIds).map((id) => id.toString());
  const transactions = [];

  for (let index = 0; index < 1200; index += 1) {
    const isIncome = index % 9 === 0;
    const budgetIndex = isIncome ? 5 : index % 5;
    const currency = index % 11 === 0 ? "CNY" : "USD";
    transactions.push({
      description: isIncome ? `Family support transfer ${index}` : `Semester expense ${index}`,
      type: isIncome ? "income" : "expense",
      amount: randomAmount(index, isIncome ? "income" : "expense"),
      currency,
      exchangeRateToUsd: currency === "CNY" ? 0.14 : 1,
      date: randomDate(index),
      budgetId: budgetIds[budgetIndex],
      notes: "Seed data for project rubric database-size requirement.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await db.collection("transactions").insertMany(transactions);
  console.log("Seed completed: 6 budgets and 1200 transactions created.");
} catch (error) {
  console.error("Seed failed", error);
  process.exitCode = 1;
} finally {
  await closeDatabaseConnection();
}
