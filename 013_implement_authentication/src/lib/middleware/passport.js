import passport from "passport";
import passportGithub2 from "passport-github2";
import config from "../../config.js";

const githubStrategy = new passportGithub2.Strategy(
  {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL,
  },
  function (accessToken, refreshToken, profile, done = (error, user) => {}) {
    const user = { username: profile.username };
    done(null, user);
  }
);

passport.use(githubStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const checkAuthorization = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  }

  response.status(401).end();
};

export { passport, checkAuthorization };
