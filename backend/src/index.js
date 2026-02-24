import express from "express";
import cors from "cors";
import { pool, initDb } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// CRUD: Notes
app.get("/api/notes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM notes ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
    [title, content]
  );
  res.status(201).json(rows[0]);
});

app.put("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  const { rows } = await pool.query(
    "UPDATE notes SET title=$1, content=$2 WHERE id=$3 RETURNING *",
    [title, content, id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM notes WHERE id=$1", [id]);
  if (rowCount === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await initDb();
  console.log(`API running on port ${port}`);
});