import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/connection.js";

const router = express.Router();

function validateBudget(body) {
  const errors = [];
  if (!body.category || body.category.trim().length < 2) {
    errors.push("Category must be at least 2 characters long.");
  }
  if (!body.semester || body.semester.trim().length < 2) {
    errors.push("Semester is required.");
  }
  if (!Number.isFinite(Number(body.limitAmount)) || Number(body.limitAmount) < 0) {
    errors.push("Limit amount must be a positive number.");
  }
  if (!body.currency || body.currency.trim().length < 2) {
    errors.push("Currency is required.");
  }
  return errors;
}

function cleanBudget(body) {
  return {
    category: body.category.trim(),
    semester: body.semester.trim(),
    limitAmount: Number(body.limitAmount),
    currency: body.currency.trim().toUpperCase(),
    notes: body.notes ? body.notes.trim() : "",
    updatedAt: new Date(),
  };
}

router.get("/", async (_request, response) => {
  try {
    const budgets = await getCollection("budgets").find({}).sort({ category: 1 }).toArray();
    response.json(budgets);
  } catch {
    response.status(500).json({ error: "Unable to load budgets." });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const budget = await getCollection("budgets").findOne({ _id: new ObjectId(request.params.id) });
    if (!budget) {
      return response.status(404).json({ error: "Budget not found." });
    }
    return response.json(budget);
  } catch {
    return response.status(400).json({ error: "Invalid budget id." });
  }
});

router.post("/", async (request, response) => {
  const errors = validateBudget(request.body);
  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const budget = { ...cleanBudget(request.body), createdAt: new Date() };
    const result = await getCollection("budgets").insertOne(budget);
    return response.status(201).json({ ...budget, _id: result.insertedId });
  } catch {
    return response.status(500).json({ error: "Unable to create budget." });
  }
});

router.put("/:id", async (request, response) => {
  const errors = validateBudget(request.body);
  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const update = cleanBudget(request.body);
    const result = await getCollection("budgets").findOneAndUpdate(
      { _id: new ObjectId(request.params.id) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) {
      return response.status(404).json({ error: "Budget not found." });
    }
    return response.json(result);
  } catch {
    return response.status(400).json({ error: "Unable to update budget." });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const budgetId = new ObjectId(request.params.id);
    await getCollection("transactions").deleteMany({ budgetId: request.params.id });
    const result = await getCollection("budgets").deleteOne({ _id: budgetId });
    if (result.deletedCount === 0) {
      return response.status(404).json({ error: "Budget not found." });
    }
    return response.json({ message: "Budget and related transactions deleted." });
  } catch {
    return response.status(400).json({ error: "Unable to delete budget." });
  }
});

export default router;
