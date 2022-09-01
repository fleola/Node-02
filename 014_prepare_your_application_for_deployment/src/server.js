import app from "./app.js";
import config from "./config.js";

const port = config.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
