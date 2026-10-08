"use strict";

const budgetForm = document.querySelector("#budget-form");
const budgetInput = document.querySelector("#budget");
const expensesInput = document.querySelector("#expenses");
const promptButton = document.querySelector("#prompt-entry");
const formError = document.querySelector("#form-error");
const balanceValue = document.querySelector("#balance-value");
const resultMessage = document.querySelector("#result-message");
const resultStatus = document.querySelector("#result-status");
const resultPanel = document.querySelector(".result-panel");

/**
 * Return the amount left after subtracting expenses from the budget.
 */
function calculateBalance(budget, expenses) {
  return budget - expenses;
}

/**
 * Format an amount as Kenyan shillings.
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate, display, and log a budget snapshot.
 */
function showBudgetSummary(budget, expenses) {
  const remainingBalance = calculateBalance(budget, expenses);
  const spentPercent = budget === 0
    ? 0
    : Math.round((expenses / budget) * 100);
  const isOverBudget = remainingBalance < 0;

  balanceValue.textContent = formatCurrency(remainingBalance);
  resultStatus.textContent = isOverBudget
    ? "OVER YOUR BUDGET"
    : "YOUR PLAN AT A GLANCE";
  resultMessage.textContent = isOverBudget
    ? `You’ve spent ${formatCurrency(Math.abs(remainingBalance))} more than your budget.`
    : `You’ve used ${spentPercent}% of your budget. Keep going at your own pace.`;

  resultPanel.classList.toggle("over-budget", isOverBudget);

  console.log("SpendWise budget summary");
  console.log(`Monthly budget: ${formatCurrency(budget)}`);
  console.log(`Total expenses: ${formatCurrency(expenses)}`);
  console.log(`Remaining balance: ${formatCurrency(remainingBalance)}`);

  return remainingBalance;
}

/**
 * Validate numeric inputs and return a budget/expenses pair, or null.
 */
function readBudgetValues(budgetValue, expensesValue) {
  const budget = Number(budgetValue);
  const expenses = Number(expensesValue);

  if (
    budgetValue === "" ||
    expensesValue === "" ||
    !Number.isFinite(budget) ||
    !Number.isFinite(expenses)
  ) {
    formError.textContent = "Enter a valid amount for both fields.";
    return null;
  }

  if (budget < 0 || expenses < 0) {
    formError.textContent = "Amounts can’t be negative. Please check your entries.";
    return null;
  }

  formError.textContent = "";
  return { budget, expenses };
}

budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = readBudgetValues(budgetInput.value, expensesInput.value);
  if (values === null) {
    return;
  }

  showBudgetSummary(values.budget, values.expenses);
});

promptButton.addEventListener("click", () => {
  const budgetResponse = window.prompt("What is your monthly budget in KSh?");
  if (budgetResponse === null) {
    return;
  }

  const expensesResponse = window.prompt("How much have you spent so far in KSh?");
  if (expensesResponse === null) {
    return;
  }

  const values = readBudgetValues(
    budgetResponse.trim(),
    expensesResponse.trim()
  );

  if (values === null) {
    return;
  }

  budgetInput.value = values.budget;
  expensesInput.value = values.expenses;

  showBudgetSummary(values.budget, values.expenses);
});