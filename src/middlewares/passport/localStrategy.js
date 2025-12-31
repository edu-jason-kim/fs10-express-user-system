import { Strategy as LocalStrategy } from "passport-local";
import userService from "../../services/userService.js";

const localStrategy = new LocalStrategy(
  // 기본 필드명은 `username`과 `password`다. 프로젝트에서는 `email`을 사용하므로 `usernameField` 옵션을 설정한다.
  { usernameField: "email" },

  // verify function 작성
  // 사용자의 인증정보를 통해 유효성을 확인하고, 결과를 passport한테 알려줌
  async (email, password, done) => {
    try {
      const user = await userService.login(email, password);
      if (!user) {
        done(null, false);
      }
      return done(null, user); // req.user에 세팅해줌
    } catch (error) {
      return done(error);
    }
  }
);

export default localStrategy;
