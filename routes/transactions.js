import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/connection.js";

const router = express.Router();
const allowedTypes = new Set(["income", "expense"]);

function validateTransaction(body) {
  const errors = [];
  if (!body.description || body.description.trim().length < 2) {
    errors.push("Description must be at least 2 characters long.");
  }
  if (!allowedTypes.has(body.type)) {
    errors.push("Type must be income or expense.");
  }
  if (!Number.isFinite(Number(body.amount)) || Number(body.amount) <= 0) {
    errors.push("Amount must be greater than 0.");
  }
  if (!body.currency || body.currency.trim().length < 2) {
    errors.push("Currency is required.");
  }
  if (!body.date) {
    errors.push("Date is required.");
  }
  if (!body.budgetId) {
    errors.push("Budget category is required.");
  }
  return errors;
}

function cleanTransaction(body) {
  return {
    description: body.description.trim(),
    type: body.type,
    amount: Number(body.amount),
    currency: body.currency.trim().toUpperCase(),
    exchangeRateToUsd: Number(body.exchangeRateToUsd || 1),
    date: body.date,
    budgetId: body.budgetId,
    notes: body.notes ? body.notes.trim() : "",
    updatedAt: new Date(),
  };
}

router.get("/", async (request, response) => {
  try {
    const filter = {};
    if (request.query.budgetId) {
      filter.budgetId = request.query.budgetId;
    }
    if (request.query.type && allowedTypes.has(request.query.type)) {
      filter.type = request.query.type;
    }
    const transactions = await getCollection("transactions")
      .find(filter)
      .sort({ date: -1 })
      .toArray();
    response.json(transactions);
  } catch {
    response.status(500).json({ error: "Unable to load transactions." });
  }
});

router.get("/summary", async (_request, response) => {
  try {
    const transactions = await getCollection("transactions").find({}).toArray();
    const budgets = await getCollection("budgets").find({}).toArray();
    const summaryByBudget = budgets.map((budget) => {
      const related = transactions.filter((item) => item.budgetId === budget._id.toString());
      const expenses = related
        .filter((item) => item.type === "expense")
        .reduce((total, item) => total + item.amount * item.exchangeRateToUsd, 0);
      const income = related
        .filter((item) => item.type === "income")
        .reduce((total, item) => total + item.amount * item.exchangeRateToUsd, 0);
      return {
        budgetId: budget._id,
        category: budget.category,
        limitAmount: budget.limitAmount,
        currency: budget.currency,
        income,
        expenses,
        remaining: budget.limitAmount - expenses,
      };
    });

    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + item.amount * item.exchangeRateToUsd, 0);
    const totalExpenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + item.amount * item.exchangeRateToUsd, 0);

    response.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      summaryByBudget,
    });
  } catch {
    response.status(500).json({ error: "Unable to load summary." });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const transaction = await getCollection("transactions").findOne({
      _id: new ObjectId(request.params.id),
    });
    if (!transaction) {
      return response.status(404).json({ error: "Transaction not found." });
    }
    return response.json(transaction);
  } catch {
    return response.status(400).json({ error: "Invalid transaction id." });
  }
});

router.post("/", async (request, response) => {
  const errors = validateTransaction(request.body);
  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const budget = await getCollection("budgets").findOne({
      _id: new ObjectId(request.body.budgetId),
    });
    if (!budget) {
      return response.status(400).json({ error: "Selected budget does not exist." });
    }
    const transaction = { ...cleanTransaction(request.body), createdAt: new Date() };
    const result = await getCollection("transactions").insertOne(transaction);
    return response.status(201).json({ ...transaction, _id: result.insertedId });
  } catch {
    return response.status(500).json({ error: "Unable to create transaction." });
  }
});

router.put("/:id", async (request, response) => {
  const errors = validateTransaction(request.body);
  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const update = cleanTransaction(request.body);
    const result = await getCollection("transactions").findOneAndUpdate(
      { _id: new ObjectId(request.params.id) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) {
      return response.status(404).json({ error: "Transaction not found." });
    }
    return response.json(result);
  } catch {
    return response.status(400).json({ error: "Unable to update transaction." });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const result = await getCollection("transactions").deleteOne({
      _id: new ObjectId(request.params.id),
    });
    if (result.deletedCount === 0) {
      return response.status(404).json({ error: "Transaction not found." });
    }
    return response.json({ message: "Transaction deleted." });
  } catch {
    return response.status(400).json({ error: "Unable to delete transaction." });
  }
});

export default router;
