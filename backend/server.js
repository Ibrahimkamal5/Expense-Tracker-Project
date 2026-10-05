const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const allowedCategories = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Other",
];

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* =========================
   Middleware
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   Validation
========================= */

function validateExpenseData(title, amount, category, date) {
  if (typeof title !== "string" || title.trim() === "") {
    return "Title is required";
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "Amount must be a number greater than 0";
  }

  if (!allowedCategories.includes(category)) {
    return "Invalid category";
  }

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "Date must be in YYYY-MM-DD format";
  }

  return null;
}

/* =========================
   GET - All Expenses
========================= */

app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(`
          SELECT
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(
              date,
              'DD-MM-YYYY'
            ) AS date
          FROM expenses
          ORDER BY id
        `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get expenses",
    });
  }
});

/* =========================
   GET - One Expense
========================= */

app.get("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      message: "Invalid id",
    });
  }

  try {
    const result = await pool.query(
      `
          SELECT
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(
              date,
              'DD-MM-YYYY'
            ) AS date
          FROM expenses
          WHERE id = $1
          `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get expense",
    });
  }
});

/* =========================
   POST - Add Expense
========================= */

app.post("/api/expenses", async (req, res) => {
  const { title, amount, category, date } = req.body;

  const validationError = validateExpenseData(title, amount, category, date);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const numericAmount = Number(amount);

  try {
    const result = await pool.query(
      `
          INSERT INTO expenses
            (
              title,
              amount,
              category,
              date
            )
          VALUES
            ($1, $2, $3, $4)
          RETURNING
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(
              date,
              'DD-MM-YYYY'
            ) AS date
          `,
      [title.trim(), numericAmount, category, date],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Invalid expense data",
    });
  }
});

/* =========================
   PUT - Update Expense
========================= */

app.put("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      message: "Invalid id",
    });
  }

  const { title, amount, category, date } = req.body;

  const validationError = validateExpenseData(title, amount, category, date);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const numericAmount = Number(amount);

  try {
    const result = await pool.query(
      `
          UPDATE expenses
          SET
            title = $1,
            amount = $2,
            category = $3,
            date = $4
          WHERE id = $5
          RETURNING
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(
              date,
              'DD-MM-YYYY'
            ) AS date
          `,
      [title.trim(), numericAmount, category, date, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Invalid expense data",
    });
  }
});

/* =========================
   DELETE - Delete Expense
========================= */

app.delete("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      message: "Invalid id",
    });
  }

  try {
    const result = await pool.query(
      `
          DELETE FROM expenses
          WHERE id = $1
          RETURNING id
          `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
});

/* =========================
   Start Server
========================= */

app.listen(3000);
