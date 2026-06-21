# International Student Semester Budget Planner

Author: Xinhao Chen

Class Link: [Add the course Canvas or class website link here.](https://northeastern.instructure.com/courses/249954/assignments/3196235)

## Project Objective

International Student Semester Budget Planner is a Node + Express + MongoDB application for international students who need to manage semester expenses such as tuition, rent, food, transportation, travel, and family support. The app lets users create semester budget categories, add income and expense transactions with currency labels, connect transactions to budgets, and view remaining budget by category.

This project uses the required architecture:

- Node.js
- Express
- MongoDB Native Node.js Driver
- HTML5
- CSS
- Vanilla ES6 JavaScript modules

This project does not use:

- Mongoose
- React
- Template engines such as EJS, Pug, Jade, or Handlebars
- CommonJS `require`
- Server-side rendering

## Screenshot

![Dashboard Screenshot](public/images/dashboard.png)

![Budgets Screenshot](public/images/budgets.png)

![Transactions Screenshot](public/images/transactions.png)

![About Screenshot](public/images/about.png)

Example location: `docs/screenshot.png`

## Main Features

- Create, view, edit, and delete budget categories.
- Create, view, edit, and delete transactions.
- Assign each transaction to a budget category.
- Add a currency label and manual exchange rate to each transaction.
- View total income, total expenses, balance, and remaining budget by category.
- Filter transactions by income or expense.

## MongoDB Collections

1. `budgets`
2. `transactions`

Both collections support CRUD operations.

## Instructions to Build and Run

1. Clone the repository.

```bash
git clone YOUR_REPOSITORY_LINK
cd international-student-semester-budget-planner
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file based on `.env.example`.

```bash
cp .env.example .env
```

4. Add your MongoDB connection string to `.env`.

```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=semester_budget_planner
PORT=3000
```

5. Seed the database with more than 1,000 records for the rubric requirement.

```bash
npm run seed
```

6. Start the app.

```bash
npm start
```

7. Open the app in a browser.

```text
http://localhost:3000
```

## Development Commands

Run the server in watch mode:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Format files with Prettier:

```bash
npm run format
```

## Project Pages

- `index.html`: dashboard and summary.
- `budgets.html`: budget category CRUD.
- `transactions.html`: transaction CRUD.
- `about.html`: instructions for using the app.

## Deployment

Recommended deployment option: Render.

Required environment variables on the deployment platform:

```text
MONGO_URI
DB_NAME
PORT
```

Do not upload `.env` to GitHub. The `.gitignore` file excludes `.env`.

## AI Usage Disclosure

AI was used for planning, writing assistance, and code drafting support. The final code should be reviewed, tested, and understood before submission.

## License

This project uses the MIT License.
