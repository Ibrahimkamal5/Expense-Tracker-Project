## Link Explain
[Project Explanation Video](https://drive.google.com/file/d/1dLWQzkKfv6rWNuW7o8CJalSYxwz37GXN/view?usp=sharing)

# Expense Tracker
Expense Tracker is a web application for managing personal expenses.

The application uses a **Node.js and Express backend**, **PostgreSQL** for data storage, and a **JavaScript/Bootstrap frontend**.

The frontend communicates with the backend through a REST API using `fetch` and `async/await`.

## Technologies

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- CSS Grid
- Node.js
- Express.js
- PostgreSQL
- `pg`
- `dotenv`
- REST API
- Thunder Client

## Project Structure

```text
expense-tracker/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── schema.sql
│   └── .env.example
│
└── README.md
```

> The `.env` file and `node_modules` folder are not included in the final submission.

## How to Run

### Backend

1. Open the `backend` folder in VS Code.

2. Install the required packages:

```bash
npm install
```

3. Create a PostgreSQL database named:

```text
expense_tracker
```

4. Run the `schema.sql` file on the `expense_tracker` database.

5. Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=expense_tracker
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

6. Start the backend:

```bash
node server.js
```

For development, `nodemon` can also be used:

```bash
nodemon server.js
```

7. The backend will run on:

```text
http://localhost:3000
```

### Frontend

1. Open the `frontend` folder in VS Code.

2. Make sure the backend server is running.

3. Open `index.html` using the **Live Server** extension.

4. The frontend communicates with the backend through the REST API.

## REST API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/expenses`     | Get all expenses  |
| GET    | `/api/expenses/:id` | Get one expense   |
| POST   | `/api/expenses`     | Add a new expense |
| PUT    | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Features

- [x] Add an expense with validation
- [x] Delete an expense
- [x] Edit an expense using a Bootstrap modal
- [x] Filter expenses by category
- [x] Show all expenses using the `All` filter
- [x] Summary cards for total amount, expense count, and highest expense
- [x] Data is stored in PostgreSQL
- [x] Frontend communicates directly with the REST API
- [x] Refresh data from the server after add, edit, and delete operations
- [x] Bootstrap loading spinner
- [x] Bootstrap alerts for errors and successful operations
- [x] Responsive layout for mobile and desktop screens
- [x] CSS Grid used for the summary cards
- [x] Client-side and server-side validation
- [x] Parameterized SQL queries

## Phase 2 Frontend

During Phase 2, the frontend was built directly against the backend API.

The page includes a navigation bar, summary cards, an expense form, category filtering, an editable expenses table, loading feedback, and error handling.

### Adding an Expense

The form collects:

- Title
- Amount
- Category
- Date

Before sending the request, the frontend validates the entered data.

A valid expense is sent to:

```text
POST /api/expenses
```

using `fetch`, `async/await`, and JSON.

After the expense is successfully saved by the server, the frontend requests the latest expense list again.

### Displaying Expenses

The frontend retrieves expenses from:

```text
GET /api/expenses
```

The response is converted from JSON into JavaScript data and the table rows are created dynamically using the DOM.

### Editing an Expense

Each expense has an **Edit** button.

The current expense is located using its ID and loaded into a Bootstrap modal.

After editing, the frontend sends:

```text
PUT /api/expenses/:id
```

After the update is successfully stored in PostgreSQL, the frontend requests the latest data from the server again.

The date is converted when necessary so that it can be displayed correctly inside the HTML `input type="date"` field.

### Deleting an Expense

Each expense has a **Delete** button.

Before deletion, the user is asked for confirmation.

The frontend sends:

```text
DELETE /api/expenses/:id
```

After successful deletion, the expense list is loaded again from the server and the summary is recalculated.

### Filtering

Expenses can be filtered by:

```text
All
Food
Transport
Bills
Entertainment
Other
```

The filter is applied to the locally stored list of expenses.

The summary cards continue to represent **all expenses**, even when the table is filtered.

### Summary Cards

The application displays:

- Total amount
- Number of expenses
- Highest expense

The summary is calculated from the complete expense list received from the server.

### Loading and Error Handling

A Bootstrap spinner is displayed while the expense list is being loaded.

Bootstrap alerts are used to show successful operations and errors.

If the backend server is unavailable, the application displays a clear message asking the user to make sure the backend is running.

## Phase 3 Improvements

### CSS Grid

CSS Grid was added to the summary cards:

- Three columns on larger screens.
- One column on smaller screens.

This provides a cleaner layout and demonstrates the use of CSS Grid independently from Bootstrap's grid system.

### Responsive Design

The page was tested for different screen sizes.

Bootstrap responsive classes and custom CSS media queries were used to improve the layout on mobile devices.

The expenses table uses `table-responsive` so that it can be viewed on smaller screens without breaking the page layout.

### Code Organization

The JavaScript was organized into separate functions based on responsibility, including:

- Loading expenses
- Rendering the table
- Updating the summary
- Adding expenses
- Editing expenses
- Deleting expenses
- Filtering expenses
- Displaying alerts

The backend validation logic was also separated into a reusable validation function.

### API Response Handling

The frontend uses a reusable response handler to process JSON responses and API errors consistently.

### Date Handling

The frontend handles the difference between the date format returned by the API and the format required by HTML `input type="date"`.

### Clean Code

Temporary debugging `console.log` statements were removed from the final code.

Meaningful variable and function names are used throughout the project, and comments are kept where they help explain the code.

## Validation

### Frontend Validation

The frontend validates:

- Title is required.
- Amount must be greater than zero.
- Category is required.
- Date is required.

### Backend Validation

The backend validates the same incoming data before sending it to PostgreSQL.

The backend also verifies:

- The ID is a valid integer.
- The category is one of the allowed categories.
- The amount is a positive number.
- The date has the expected format.

## Database and Security

The application uses PostgreSQL to permanently store expenses.

SQL queries use parameterized values such as:

```sql
WHERE id = $1
```

instead of directly inserting user data into SQL queries.

This keeps user input separate from the SQL statement and helps protect against SQL injection.

Database configuration and passwords are stored in `.env`.

The `.env` file should **never be uploaded or submitted**.

The `node_modules` folder should also not be included in the final ZIP.

## Screenshots

### Desktop

![Desktop Screenshot](image.png)

### Medium

![Medium Screenshot](image-1.png)

### Mobile

![Mobile Screenshot](image-2.png)

## What Was the Hardest Part?

The hardest part was understanding how the frontend, backend, and database communicate with each other.

I had to understand how REST API requests work, how to use `fetch` with `async/await`, how Express handles requests and responses, and how Node.js communicates with PostgreSQL using `pg`.

Another important part was implementing validation and parameterized SQL queries.

During the frontend phase, I also had to understand how data returned from the API is converted into DOM elements, how POST, PUT, and DELETE requests work, and how the page can refresh its data from the server after each operation.

I solved these challenges by testing the API endpoints with Thunder Client, debugging the application step by step, and checking the browser console when frontend problems occurred.

## Conclusion

The project demonstrates a complete web application flow:

```text
Frontend
   ↓
fetch()
   ↓
Express REST API
   ↓
pg
   ↓
PostgreSQL
```

The frontend and backend communicate through REST API endpoints, while PostgreSQL provides persistent storage for the expenses.

The project includes CRUD operations, validation, filtering, responsive design, CSS Grid, loading feedback, error handling, and a Bootstrap-based user interface.

## Final Submission

Before creating the final ZIP:

- Make sure the project runs according to this README.
- Make sure `node_modules` is removed.
- Make sure `.env` is removed.
- Keep `.env.example`.
- Keep `package.json` and `package-lock.json`.
- Keep `schema.sql`.
- Keep the README and screenshots.
