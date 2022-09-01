import session from "express-session";
import config from "../../config.js";

export function initSessionMiddleware() {
  return session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  });
}
