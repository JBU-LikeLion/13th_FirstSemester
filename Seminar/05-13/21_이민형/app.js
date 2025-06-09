const express = require("express");
const db = require("./mysql");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Get ok");
});

app.post("/users", (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) return res.status(400).json({ msg: "id, pw required" });
  db.query("INSERT INTO user (id, pw) VALUES (?, ?)", [id, pw], (err) => {
    if (err && err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ msg: "id exists" });
    if (err) return res.status(500).json({ msg: "db error" });
    res.json({ msg: "saved" });
  });
});

app.get("/db", (_, res) => {
  db.query("SELECT * FROM user", (err, rows) => {
    if (err) return res.status(500).json({ msg: "db error" });
    res.json(rows);
  });
});

app.listen(port, () => console.log(`http://localhost:${port}`));
