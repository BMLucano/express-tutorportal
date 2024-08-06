import express, { Application, Request, Response, NextFunction} from "express";
import {ExpressError, NotFoundError } from "./expressError";
// import morgan from "morgan";
// import cors from "cors";

//TODO: finish importing routes
import authRoutes from "./routes/auth"
import { jwtAuth, studentAuth } from "./middleware/auth";
import User from "./models/user";
// import { add } from "./add.js";

const app: Application = express();
app.use(express.json());
app.use(jwtAuth);

app.use("/auth", authRoutes);

/** Sample route */
// app.get("/", function (req: Request, res: Response) {
//   return res.send(`2 + 3 = ${add(2, 3)}`);
// });
app.get('/dashboard', studentAuth, async function(req: Request, res: Response,
    next: NextFunction){

      const username = res.locals.user.username;
      const dashboardData = await User.getUserDashboard(username);

      return res.json( dashboardData )
})


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