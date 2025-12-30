import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  return isValid;
}

function filterSensitiveUserData(user) {
  const { password, ...rest } = user;
  return rest;
}

async function createUser(user) {
  // 1. 입력받은 이메일이 이미 사용중인지 확인한다.
  const existedUser = await userRepository.findByEmail(user.email);

  // 2. 이메일이 사용중이라면 회원가입을 거부한다. (409 confilct)
  if (existedUser) {
    const error = new Error("User already exists");
    error.code = 409;
    error.data = { email: user.email };
    throw error;
  }

  // 3. 이메일이 사용중이 아니라면 유저를 DB에 저장한다.
  const hashedPassword = await hashPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });

  // 4. 새로 가입된 유저 정보를 생성된 id와 함께 반환한다.
  // 5. password와 같은 민감 정보는 반환하지 않는다.
  return filterSensitiveUserData(createdUser);
}

async function login(email, password) {
  // 1. 이메일로 유저를 조회한다.
  const user = await userRepository.findByEmail(email);

  // 2. 유저가 존재하지 않으면 에러를 반환한다.
  if (!user) {
    const error = new Error("Unathorized");
    error.code = 401;
    throw error;
  }

  // 3. 데이터베이스에 저장된 비밀번호와 입력받은 비밀번호를 비교한다.
  const isValid = await verifyPassword(password, user.password);

  // 4. 일치하지 않으면 401 에러를 반환한다.
  if (!isValid) {
    const error = new Error("Unathorized");
    error.code = 401;
    throw error;
  }

  // 5. 일치하면 유저 정보를 반환한다. (민감정보 제외)
  return filterSensitiveUserData(user);
}

export default {
  createUser,
  login,
};
