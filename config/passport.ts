import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { User } from '../schema/schemas';

passport.serializeUser((user: any, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id: string, done) => {
  return User.findByPk(id)
    .then((user) => {
      done(undefined, user);
    })
    .catch((error) => {
      done(error);
    });
});

passport.use(
  new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      return User.findByEmail(email)
        .then((user) => {
          if (!user || !user.comparePassword(password)) {
            return done(undefined, false, {
              message: 'Incorrect username or password',
            });
          }
          return done(undefined, user);
        })
        .catch((error) => {
          console.log(error);
          return done(error);
        });
    },
  ),
);

export default passport;
