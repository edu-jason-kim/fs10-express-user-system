import userRepository from "../repositories/userRepository.js";

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
  const createdUser = await userRepository.save(user);

  // 4. 새로 가입된 유저 정보를 생성된 id와 함께 반환한다.
  // 5. password와 같은 민감 정보는 반환하지 않는다.
  return filterSensitiveUserData(createdUser);
}

export default {
  createUser,
};
