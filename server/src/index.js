import dotenv from "dotenv";
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import testRouter from "./testRouter.js";
import express from "express";

dotenv.config();

const port = process.env.PORT || 5000;

if (port == null) {
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

app.listen(port, () => {
  logInfo(`Server started on port ${port}`);
});

// Host client code for Heroku
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );
  app.get("*", (req, res) =>
    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    ),
  );
}

// For Cypress testing
if (process.env.NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}
