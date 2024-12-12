const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    if (err) {
      console.error("Error reading file directory : ", err);
      return res.status(500).send("Internal server error");
    }
    res.render("index", { files });
  });
});

app.get("/file/:filename", (req, res) => {
  const filepath = `./files/${req.params.filename}.txt`;
  fs.readFile(filepath, "utf-8", (err, filedata) => {
    if (err) {
      console.error("File not found : ", err);
      return res.status(404).send("File not found");
    }
    res.render("file", { filename: req.params.filename, filedata });
  });
});

app.get("/edit/:filename", (req, res) => {
  const name = req.params.filename + ".txt";
  res.render("edit", { name });
});

app.post("/edit", (req, res) => {
  const oldPath = `./files/${req.body.oldName}`;
  const newPath = `./files/${req.body.newName}`;
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Invalid Path : ", err);
      return res.status(500).send("Invalid Path");
    }
    res.redirect("/");
  });
});

app.post("/create", (req, res) => {
  const filepath = `./files/${req.body.title
    .toLowerCase()
    .split(" ")
    .join("")}.txt`;
  fs.writeFile(filepath, req.body.details, (err) => {
    if (err) {
      console.error("Error creating file : ", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/");
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
