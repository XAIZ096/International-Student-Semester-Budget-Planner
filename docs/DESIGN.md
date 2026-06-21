# Design Document: International Student Semester Budget Planner

## Project Description

International Student Semester Budget Planner is a web application designed for international college students who need to organize semester expenses across categories such as tuition, rent, food, transportation, travel, and money received from family. Unlike a general personal finance tracker, this app focuses on the semester-based planning problem international students often face: large education costs, recurring living expenses, family support, and transactions that may use different currency labels.

The application uses Node.js, Express, MongoDB with the native Node.js driver, HTML5, CSS, and vanilla ES6 JavaScript. It does not use React, Mongoose, template engines, server-side rendering, or CommonJS `require` syntax.

## User Personas

### Persona 1: International Undergraduate Student

Name: Alex Chen  
Age: 21  
Background: Alex is an international student studying in the United States. Alex pays rent, tuition, food, transportation, and travel costs during the semester. Some money comes from family support, and some transactions may be tracked with currency labels such as USD or CNY.  
Goal: Alex wants a simple app to plan a semester budget and avoid overspending before the semester ends.  
Pain Point: Alex's expenses are spread across bank apps, notes, and messages from family, so it is difficult to see the remaining budget by category.

### Persona 2: International Graduate Student

Name: Mina Park  
Age: 24  
Background: Mina is a graduate student who needs to manage tuition payments, rent, groceries, and occasional travel.  
Goal: Mina wants to quickly record income and expenses and see how much money remains for each budget category.  
Pain Point: Regular finance apps feel too broad and do not organize spending around an academic semester.

## User Stories

1. As an international student, I want to create semester budget categories so I can plan spending for rent, food, tuition, travel, and daily life.
2. As an international student, I want to add income and expense records with a currency label so I can track money from different sources.
3. As an international student, I want to connect each transaction to a budget category so I can see where my money is going.
4. As an international student, I want to view remaining budget by category so I can avoid overspending during the semester.
5. As an international student, I want to edit or delete incorrect budget and transaction records so my data stays accurate.

## Main Features

- Budget category CRUD: create, read, update, and delete semester budget categories.
- Transaction CRUD: create, read, update, and delete income or expense transactions.
- Category connection: each transaction belongs to a budget category.
- Currency labels: transactions can include labels such as USD, CNY, or SGD and a manual exchange rate to USD.
- Dashboard summary: total income, total expenses, balance, and remaining budget by category.
- Client-side rendering: pages load data from the Express API and render using vanilla JavaScript.

## Data Model

### Collection: `budgets`

```json
{
  "_id": "ObjectId",
  "category": "Rent",
  "semester": "Fall 2026",
  "limitAmount": 6400,
  "currency": "USD",
  "notes": "Four months of housing",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: `transactions`

```json
{
  "_id": "ObjectId",
  "description": "Monthly rent",
  "type": "expense",
  "amount": 1600,
  "currency": "USD",
  "exchangeRateToUsd": 1,
  "date": "2026-09-01",
  "budgetId": "ObjectId as string",
  "notes": "September rent",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Design Mockups

### Dashboard Page

```text
+---------------------------------------------------+
| Semester Budget Planner | Dashboard Budgets ...   |
+---------------------------------------------------+
| International Student Semester Budget Planner      |
| [Manage Budgets] [Add Transaction]                 |
+---------------------------------------------------+
| Total Income | Total Expenses | Balance            |
+---------------------------------------------------+
| Budget Progress                                   |
| Rent: spent / limit [progress bar] remaining       |
| Food: spent / limit [progress bar] remaining       |
+---------------------------------------------------+
```

### Budgets Page

```text
+-----------------------------+---------------------+
| Create Budget Category      | Budget Categories   |
| Category: [Rent]            | Rent                |
| Semester: [Fall 2026]       | Fall 2026           |
| Limit: [6400]               | $6,400 USD          |
| Currency: [USD]             | [Edit] [Delete]     |
| Notes: [optional]           |                     |
| [Save Budget] [Clear]       |                     |
+-----------------------------+---------------------+
```

### Transactions Page

```text
+-----------------------------+---------------------+
| Add Transaction             | Transactions        |
| Description: [Monthly rent] | Expense             |
| Type: [Expense]             | Monthly rent        |
| Amount: [1600]              | $1,600 USD          |
| Currency: [USD]             | Category: Rent      |
| Rate to USD: [1]            | [Edit] [Delete]     |
| Date: [2026-09-01]          |                     |
| Category: [Rent]            |                     |
| [Save Transaction] [Clear]  |                     |
+-----------------------------+---------------------+
```

## Instructions for Use

1. Open the dashboard to view total income, total expenses, balance, and category progress.
2. Go to the Budgets page and create categories such as tuition, rent, food, transportation, and travel.
3. Go to the Transactions page and add income or expenses.
4. Select a budget category for each transaction.
5. Use edit and delete buttons to keep records accurate.
6. Use the type filter on the Transactions page to view only income or expenses.

## Architecture Notes

- Backend: Node.js and Express.
- Database: MongoDB native Node.js driver.
- Frontend: HTML5, CSS modules, and vanilla ES6 JavaScript modules.
- Rendering: client-side rendering only.
- Environment variables: MongoDB connection string is stored in `.env`, which is excluded from Git.
