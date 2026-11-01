import express, { Request, Response } from "express";
import { dbClient } from "@repo/db/client";

import { router } from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", router);


app.get("/hello", async (req: Request, res: Response) => {
  // const { email, password, username } = req.body;
  const users = await dbClient.user.findMany();
  return res.json({
    message: "health check pass",
    status: 200,
    users,
  });
});

app.listen(8000, () => {
  console.log("Server is running on port : 8000");
});
