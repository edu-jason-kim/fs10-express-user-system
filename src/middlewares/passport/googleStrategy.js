import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userService from "../../services/userService.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  // 사용자가 구글 로그인 confirm 이후 실행되는 함수
  async (accessToken, refreshToken, profile, done) => {
    // 구글로 로그인 성공한 사용자를, 우리 서비스 사용자로 회원가입
    const user = await userService.oauthCreateOrUpdate(
      profile.provider,
      profile.id,
      profile.emails[0].value,
      profile.displayName
    );

    done(null, user);
  }
);

export default googleStrategy;
