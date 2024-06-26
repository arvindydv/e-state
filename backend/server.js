import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

const __dirname = path.resolve();
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// app.use(express.static("public"));

// api routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listing.routes.js";
// import commentRouter from "./routes/comment.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/listing", listingRouter);
// app.use("/api/comments", commentRouter);

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

export default app;
