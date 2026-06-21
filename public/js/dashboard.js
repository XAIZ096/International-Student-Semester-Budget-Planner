import { apiRequest, formatCurrency } from "./api.js";

const summaryCards = document.querySelector("#summaryCards");
const budgetSummary = document.querySelector("#budgetSummary");

function renderSummary(data) {
  summaryCards.innerHTML = `
    <article class="card summary-card">
      <span>Total Income</span>
      <strong>${formatCurrency(data.totalIncome)}</strong>
    </article>
    <article class="card summary-card">
      <span>Total Expenses</span>
      <strong>${formatCurrency(data.totalExpenses)}</strong>
    </article>
    <article class="card summary-card">
      <span>Balance</span>
      <strong>${formatCurrency(data.balance)}</strong>
    </article>
  `;
}

function renderBudgetProgress(items) {
  if (items.length === 0) {
    budgetSummary.innerHTML = `<p class="card">No budgets yet. Create budget categories first.</p>`;
    return;
  }

  budgetSummary.innerHTML = items
    .map((item) => {
      const spentPercent =
        item.limitAmount > 0 ? Math.min((item.expenses / item.limitAmount) * 100, 100) : 0;
      return `
        <article class="card">
          <h3>${item.category}</h3>
          <p>Spent: ${formatCurrency(item.expenses)} / Limit: ${formatCurrency(item.limitAmount, item.currency)}</p>
          <div class="progress-bar" aria-label="${item.category} progress">
            <div class="progress-value" style="width: ${spentPercent}%"></div>
          </div>
          <p>Remaining: ${formatCurrency(item.remaining, item.currency)}</p>
        </article>
      `;
    })
    .join("");
}

async function loadDashboard() {
  try {
    const data = await apiRequest("/api/transactions/summary");
    renderSummary(data);
    renderBudgetProgress(data.summaryByBudget);
  } catch (error) {
    summaryCards.innerHTML = `<p class="card">${error.message}</p>`;
  }
}

loadDashboard();
