import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userRepository from "../../repositories/userRepository.js";

const accessTokenOptions = {
  // Authorization: Bearer xxxx
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // jwt 사인할때 사용한 key
  secretOrKey: process.env.JWT_SECRET,
};

function cookieExtractor(req) {
  let token;
  if (req && req.cookies) {
    token = req.cookies["refreshToken"];
  }
  return token;
}

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

async function verifyFunction(payload, done) {
  try {
    const userId = payload.userId;
    const user = await userRepository.findById(userId);
    if (!user) {
      done(null, false);
    }
    done(null, user); // req.user
  } catch (error) {
    done(error)
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, verifyFunction);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, verifyFunction);

export default {
  accessTokenStrategy,
  refreshTokenStrategy,
};
