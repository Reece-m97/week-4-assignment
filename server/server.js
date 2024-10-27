// imports
import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

// setup the server
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// connect database
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// test endpoint
app.get("/", (req, res) => res.json("It's working init!"));

app.get("/haunted_guestbook", async function (req, res) {
  const result = await db.query("SELECT * FROM haunted_guestbook");
  const guestbook = result.rows;

  res.json(guestbook);
});

// POST endpoint
app.post("/haunted_guestbook", async function (request, response) {
  // get the request body (data from the form)
  const { name, message, year } = request.body; // destructuring data

  // make the query to the db
  try {
    const result = await db.query(
      "INSERT INTO haunted_guestbook (name, message, year) VALUES ($1, $2, $3)",
      [name, message, year]
    );
    response.json(result.rows[0]); // Return the inserted row
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Database error while adding entry" });
  }
});

app.patch("/haunted_guestbook/:id/haunt", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE haunted_guestbook SET haunts = haunts + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "Message not found" });
    } else {
      res.json({ success: true, message: "Message haunted successfully!" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while haunting the message.",
    });
  }
});

// start server
app.listen(8080, function () {
  console.log(`Server is running on port 8080`);
});
