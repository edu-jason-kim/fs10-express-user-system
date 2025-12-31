import passport from "passport";
import googleStrategy from "../middlewares/passport/googleStrategy.js";
import jwtStrategy from "../middlewares/passport/jwtStrategy.js";
import localStrategy from "../middlewares/passport/localStrategy.js";
import userRepository from "../repositories/userRepository.js";

// passport 설정들
passport.use("local", localStrategy);
passport.use("access-token", jwtStrategy.accessTokenStrategy);
passport.use("refresh-token", jwtStrategy.refreshTokenStrategy);
passport.use(googleStrategy);

// session에 user id를 저장하는 과정
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// session에 저장된 user id로 사용자 정보를 꺼내서
// req.user로 할당하는 과정
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
