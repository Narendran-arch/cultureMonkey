import { createApp, createError } from "h3";
import companyRoutes from "./routes/company.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "./middlewares/cors.js"

const app = createApp({
  onError(error, event) {
    // If it's already an H3 error → respect it
    if (error?.statusCode) {
      event.node.res.statusCode = error.statusCode;
      return {
        success: false,
        error: {
          message: error.statusMessage,
        },
      };
    }

    // Fallback
    event.node.res.statusCode = 500;
    return {
      success: false,
      error: {
        message: "Internal Server Error",
      },
    };
  },
});
app.use(cors
);
app.use(companyRoutes);
app.use(userRoutes);

app.use(() => {
  throw createError({
    statusCode: 404,
    statusMessage: "Route Not Found",
  });
});

export default app;
