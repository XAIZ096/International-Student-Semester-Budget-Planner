import { apiRequest, formatCurrency, getFormData } from "./api.js";

const form = document.querySelector("#transactionForm");
const transactionList = document.querySelector("#transactionList");
const message = document.querySelector("#transactionMessage");
const resetButton = document.querySelector("#resetTransactionForm");
const budgetSelect = document.querySelector("#budgetId");
const typeFilter = document.querySelector("#typeFilter");
let budgets = [];

function clearForm() {
  form.reset();
  document.querySelector("#transactionId").value = "";
  document.querySelector("#exchangeRateToUsd").value = "1";
  document.querySelector("#date").value = new Date().toISOString().slice(0, 10);
  message.textContent = "";
}

function budgetName(id) {
  return budgets.find((budget) => budget._id === id)?.category || "Unknown category";
}

function fillForm(transaction) {
  document.querySelector("#transactionId").value = transaction._id;
  document.querySelector("#description").value = transaction.description;
  document.querySelector("#type").value = transaction.type;
  document.querySelector("#amount").value = transaction.amount;
  document.querySelector("#transactionCurrency").value = transaction.currency;
  document.querySelector("#exchangeRateToUsd").value = transaction.exchangeRateToUsd;
  document.querySelector("#date").value = transaction.date;
  document.querySelector("#budgetId").value = transaction.budgetId;
  document.querySelector("#transactionNotes").value = transaction.notes || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteTransaction(id) {
  const shouldDelete = confirm("Delete this transaction?");
  if (!shouldDelete) {
    return;
  }
  await apiRequest(`/api/transactions/${id}`, { method: "DELETE" });
  message.textContent = "Transaction deleted.";
  await loadTransactions();
}

function renderBudgetOptions() {
  budgetSelect.innerHTML = budgets
    .map(
      (budget) => `<option value="${budget._id}">${budget.category} (${budget.semester})</option>`,
    )
    .join("");
}

function renderTransactions(transactions) {
  if (transactions.length === 0) {
    transactionList.innerHTML = `<p class="list-item">No transactions found.</p>`;
    return;
  }

  transactionList.innerHTML = "";
  transactions.forEach((transaction) => {
    const item = document.createElement("article");
    item.className = "list-item";
    item.innerHTML = `
      <span class="badge ${transaction.type}">${transaction.type}</span>
      <h3>${transaction.description}</h3>
      <div class="transaction-meta">
        <span>${formatCurrency(transaction.amount, transaction.currency)}</span>
        <span>${transaction.date}</span>
        <span>${budgetName(transaction.budgetId)}</span>
        <span>Rate to USD: ${transaction.exchangeRateToUsd}</span>
      </div>
      <p>${transaction.notes || "No notes added."}</p>
      <div class="button-row">
        <button type="button" data-action="edit">Edit</button>
        <button type="button" class="secondary" data-action="delete">Delete</button>
      </div>
    `;
    item
      .querySelector('[data-action="edit"]')
      .addEventListener("click", () => fillForm(transaction));
    item
      .querySelector('[data-action="delete"]')
      .addEventListener("click", () => deleteTransaction(transaction._id));
    transactionList.appendChild(item);
  });
}

async function loadBudgets() {
  budgets = await apiRequest("/api/budgets");
  renderBudgetOptions();
}

async function loadTransactions() {
  const query = typeFilter.value ? `?type=${typeFilter.value}` : "";
  const transactions = await apiRequest(`/api/transactions${query}`);
  renderTransactions(transactions);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = getFormData(form);
  const id = document.querySelector("#transactionId").value;
  try {
    if (id) {
      await apiRequest(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) });
      message.textContent = "Transaction updated.";
    } else {
      await apiRequest("/api/transactions", { method: "POST", body: JSON.stringify(data) });
      message.textContent = "Transaction created.";
    }
    clearForm();
    await loadTransactions();
  } catch (error) {
    message.textContent = error.message;
  }
});

resetButton.addEventListener("click", clearForm);
typeFilter.addEventListener("change", loadTransactions);

await loadBudgets();
clearForm();
await loadTransactions();
