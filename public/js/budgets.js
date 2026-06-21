import { apiRequest, formatCurrency, getFormData } from "./api.js";

const form = document.querySelector("#budgetForm");
const budgetList = document.querySelector("#budgetList");
const message = document.querySelector("#budgetMessage");
const resetButton = document.querySelector("#resetBudgetForm");

function clearForm() {
  form.reset();
  document.querySelector("#budgetId").value = "";
  message.textContent = "";
}

function fillForm(budget) {
  document.querySelector("#budgetId").value = budget._id;
  document.querySelector("#category").value = budget.category;
  document.querySelector("#semester").value = budget.semester;
  document.querySelector("#limitAmount").value = budget.limitAmount;
  document.querySelector("#currency").value = budget.currency;
  document.querySelector("#notes").value = budget.notes || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteBudget(id) {
  const shouldDelete = confirm("Delete this budget and its related transactions?");
  if (!shouldDelete) {
    return;
  }
  await apiRequest(`/api/budgets/${id}`, { method: "DELETE" });
  message.textContent = "Budget deleted.";
  await loadBudgets();
}

function renderBudgets(budgets) {
  if (budgets.length === 0) {
    budgetList.innerHTML = `<p class="list-item">No budget categories yet.</p>`;
    return;
  }

  budgetList.innerHTML = "";
  budgets.forEach((budget) => {
    const item = document.createElement("article");
    item.className = "list-item";
    item.innerHTML = `
      <h3>${budget.category}</h3>
      <div class="budget-meta">
        <span>${budget.semester}</span>
        <span>${formatCurrency(budget.limitAmount, budget.currency)}</span>
      </div>
      <p>${budget.notes || "No notes added."}</p>
      <div class="button-row">
        <button type="button" data-action="edit">Edit</button>
        <button type="button" class="secondary" data-action="delete">Delete</button>
      </div>
    `;
    item.querySelector('[data-action="edit"]').addEventListener("click", () => fillForm(budget));
    item
      .querySelector('[data-action="delete"]')
      .addEventListener("click", () => deleteBudget(budget._id));
    budgetList.appendChild(item);
  });
}

async function loadBudgets() {
  const budgets = await apiRequest("/api/budgets");
  renderBudgets(budgets);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = getFormData(form);
  const id = document.querySelector("#budgetId").value;
  try {
    if (id) {
      await apiRequest(`/api/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) });
      message.textContent = "Budget updated.";
    } else {
      await apiRequest("/api/budgets", { method: "POST", body: JSON.stringify(data) });
      message.textContent = "Budget created.";
    }
    clearForm();
    await loadBudgets();
  } catch (error) {
    message.textContent = error.message;
  }
});

resetButton.addEventListener("click", clearForm);
loadBudgets();
