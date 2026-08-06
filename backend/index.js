import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Comunicação entre o front-end e o back-end usar JSON
app.use(express.json());
app.use(
  cors({
    credential: true,
    origin: "http://localhost:3000",
  }),
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
