import userService from "../services/userService.js";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  console.log("Check email", email);
  let password = req.body.password;

  // check email exist
  // compare password
  // return userInfor
  // access_token: JWT

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

module.exports = {
  handleLogin: handleLogin,
};
