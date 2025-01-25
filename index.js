import express from "express";
import { uploadRouter } from "./src/middleware/fileUpload.js"; 
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const app = express();


app.use(express.json());

app.use("/api/upload", uploadRouter);

app.use('/src/uploads',express.static('/src/uploads'));

const _filename=fileURLToPath(import.meta.url);
const _dirname=path.dirname(_filename);
const uploadedDir=path.join(_dirname,"uploads");
if(!fs.existsSync(uploadedDir)){
fs.mkdirSync(uploadedDir);
}


app.get("/", (req, res) => {
  res.status(200).send("Welcome to the File Upload Service!");
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
