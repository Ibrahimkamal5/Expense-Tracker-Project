const API_URL = "http://localhost:3000/api/expenses";

let allExpenses = [];
let editingExpenseId = null;

// =========================
// DOM Elements
// =========================

const expensesTableBody = document.getElementById("expensesTableBody");

const totalAmount = document.getElementById("totalAmount");

const expenseCount = document.getElementById("expenseCount");

const highestExpense = document.getElementById("highestExpense");

const loadingSpinner = document.getElementById("loadingSpinner");

const alertContainer = document.getElementById("alertContainer");

const categoryFilter = document.getElementById("categoryFilter");

// Add Form
const expenseForm = document.getElementById("expenseForm");

const titleInput = document.getElementById("title");

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");

const dateInput = document.getElementById("date");

const titleError = document.getElementById("titleError");

const amountError = document.getElementById("amountError");

const categoryError = document.getElementById("categoryError");

const dateError = document.getElementById("dateError");

// Edit Modal
const editExpenseModalElement = document.getElementById("editExpenseModal");

const editExpenseForm = document.getElementById("editExpenseForm");

const editTitleInput = document.getElementById("editTitle");

const editAmountInput = document.getElementById("editAmount");

const editCategoryInput = document.getElementById("editCategory");

const editDateInput = document.getElementById("editDate");

const editModal = new bootstrap.Modal(editExpenseModalElement);

// =========================
// Alert
// =========================

function showAlert(message, type = "danger") {
  alertContainer.innerHTML = `
    <div
      class="alert alert-${type} alert-dismissible fade show"
      role="alert"
    >
      ${message}

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  `;
}

// =========================
// Response Helper
// =========================

async function parseResponse(response) {
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`,
    );
  }

  return data;
}

// =========================
// Date Helpers
// =========================

function dateToInputValue(date) {
  if (!date) {
    return "";
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [day, month, year] = date.split("-");

    return `${year}-${month}-${day}`;
  }

  return "";
}

// =========================
// Load Expenses
// =========================

async function loadExpenses() {
  try {
    loadingSpinner.classList.remove("d-none");

    const response = await fetch(API_URL);

    const expenses = await parseResponse(response);

    allExpenses = expenses;

    updateSummary(allExpenses);

    displayExpenses(allExpenses);
  } catch (error) {
    showAlert(
      "Unable to connect to the server. Please make sure the backend is running.",
    );
  } finally {
    loadingSpinner.classList.add("d-none");
  }
}

// =========================
// Display Expenses
// =========================

function displayExpenses(expenses) {
  expensesTableBody.innerHTML = "";

  if (expenses.length === 0) {
    expensesTableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-muted py-4"
        >
          No expenses found.
        </td>
      </tr>
    `;

    return;
  }

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        ${expense.title}
      </td>

      <td>
        $${Number(expense.amount).toFixed(2)}
      </td>

      <td>
        <span class="badge bg-primary">
          ${expense.category}
        </span>
      </td>

      <td>
        ${expense.date}
      </td>

      <td>

        <button
          class="btn btn-warning btn-sm"
          onclick="openEditModal(${expense.id})"
        >
          Edit
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="deleteExpense(${expense.id})"
        >
          Delete
        </button>

      </td>
    `;

    expensesTableBody.appendChild(row);
  });
}

// =========================
// Summary
// =========================

function updateSummary(expenses) {
  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  const count = expenses.length;

  const amounts = expenses.map((expense) => {
    return Number(expense.amount);
  });

  const highest = amounts.length > 0 ? Math.max(...amounts) : 0;

  totalAmount.textContent = `$${total.toFixed(2)}`;

  expenseCount.textContent = count;

  highestExpense.textContent = `$${highest.toFixed(2)}`;
}

// =========================
// Add Expense Validation
// =========================

function clearAddFormErrors() {
  titleError.textContent = "";
  amountError.textContent = "";
  categoryError.textContent = "";
  dateError.textContent = "";
}

function validateAddForm(title, amount, category, date) {
  clearAddFormErrors();

  let isValid = true;

  if (!title) {
    titleError.textContent = "Title is required";

    isValid = false;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    amountError.textContent = "Amount must be greater than 0";

    isValid = false;
  }

  if (!category) {
    categoryError.textContent = "Category is required";

    isValid = false;
  }

  if (!date) {
    dateError.textContent = "Date is required";

    isValid = false;
  }

  return isValid;
}

// =========================
// Add Expense
// =========================

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();

  const amount = Number(amountInput.value);

  const category = categoryInput.value;

  const date = dateInput.value;

  if (!validateAddForm(title, amount, category, date)) {
    return;
  }

  const expenseData = {
    title,
    amount,
    category,
    date,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(expenseData),
    });

    await parseResponse(response);

    expenseForm.reset();

    await loadExpenses();

    showAlert("Expense added successfully.", "success");
  } catch (error) {
    showAlert(error.message);
  }
});

// =========================
// Delete Expense
// =========================

async function deleteExpense(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this expense?",
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    await parseResponse(response);

    await loadExpenses();

    showAlert("Expense deleted successfully.", "success");
  } catch (error) {
    showAlert(error.message);
  }
}

// =========================
// Filter
// =========================

function applyFilter() {
  const selectedCategory = categoryFilter.value;

  if (selectedCategory === "All") {
    displayExpenses(allExpenses);

    return;
  }

  const filteredExpenses = allExpenses.filter((expense) => {
    return expense.category === selectedCategory;
  });

  displayExpenses(filteredExpenses);
}

categoryFilter.addEventListener("change", applyFilter);

// =========================
// Open Edit Modal
// =========================

function openEditModal(id) {
  const expense = allExpenses.find((expense) => {
    return expense.id === id;
  });

  if (!expense) {
    return;
  }

  editingExpenseId = id;

  editTitleInput.value = expense.title;

  editAmountInput.value = expense.amount;

  editCategoryInput.value = expense.category;

  editDateInput.value = dateToInputValue(expense.date);

  editModal.show();
}

// =========================
// Update Expense
// =========================

editExpenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = editTitleInput.value.trim();

  const amount = Number(editAmountInput.value);

  const category = editCategoryInput.value;

  const date = editDateInput.value;

  if (!title) {
    showAlert("Title is required.");

    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showAlert("Amount must be greater than 0.");

    return;
  }

  if (!category) {
    showAlert("Category is required.");

    return;
  }

  if (!date) {
    showAlert("Date is required.");

    return;
  }

  const updatedExpense = {
    title,
    amount,
    category,
    date,
  };

  try {
    const response = await fetch(`${API_URL}/${editingExpenseId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updatedExpense),
    });

    await parseResponse(response);

    editModal.hide();

    await loadExpenses();

    showAlert("Expense updated successfully.", "success");
  } catch (error) {
    showAlert(error.message);
  }
});

// =========================
// Initial Load
// =========================

loadExpenses();
