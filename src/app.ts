import express, { Application, Request, Response, NextFunction} from "express";
import {ExpressError, NotFoundError } from "./expressError";
// import morgan from "morgan";
// import cors from "cors";

//TODO: finish importing routes
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import noteRoutes from "./routes/notes";
import resourceRoutes from "./routes/resources";

import { jwtAuth } from "./middleware/auth";
// import { add } from "./add.js";

const app: Application = express();
app.use(express.json());
app.use(jwtAuth);

app.use("/dashboard", dashboardRoutes)
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/resources", resourceRoutes);

/** Sample route */
// app.get("/", function (req: Request, res: Response) {
//   return res.send(`2 + 3 = ${add(2, 3)}`);
// });

/** Handle 404 errors -- this matches everything */
app.use(function (req: Request, res: Response, next: NextFunction) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err: ExpressError, req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  /* istanbul ignore next (ignore for coverage) */
  const status = err?.status ?? 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

export default app;