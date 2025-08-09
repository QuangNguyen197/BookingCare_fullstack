import userService from "../services/userService.js";

let handleLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
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
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({
      errCode: -1,
      message: "Internal server error",
    });
  }
};

let handleGetAllUser = async (req, res) => {
  let id = req.query.id;
  let users = await userService.getAllUsers(id);
  console.log(users);

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
      user: [],
    });
  }

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

// let handleResetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email || !newPassword) {
//     return res.status(200).json({
//       errCode: 1,
//       errMessage: "Missing required parameter",
//     });
//   }
//   let message = await userService.resetPassword(email, newPassword);
//   return res.status(200).json(message);
// };

let getAllCode = async (req, res) => {
  try {
    let message = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(message);
  } catch (e) {
    console.log("Get the exceptions", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUser: handleGetAllUser,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  // handleResetPassword: handleResetPassword,
  getAllCode: getAllCode,
};
