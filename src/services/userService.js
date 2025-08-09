import db from "../models/index.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exist
        // compare password
        let user = await db.User.findOne({
          where: { email: email },
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          raw: true,
        });
        if (user) {
          // bcrypt.compareSync
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User not found";
        }
      } else {
        // return error
        userData.errCode = 1;
        userData.errMessage = "Your email is not found in system";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: { exclude: ["password"] },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check email is exist ???
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage:
            "Your email is already used. Please eneter another email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: "Invalid user",
      });
    }

    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      errMessage: "Deleted user successful!",
    });
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.gender || !data.positionId || !data.roleId) {
        resolve({
          errCode: 2,
          errMessage: "Mising required parameters!",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.gender = data.gender;
        user.positionId = data.positionId;
        user.roleId = data.roleId;
        user.phonenumber = data.phonenumber;
        if (data.image) {
          user.image = data.image;
        }

        await user.save();

        resolve({
          errCode: 0,
          errMessage: "Updated user successfull!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// let resetPassword = (email, newPassword) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let user = await db.User.findOne({
//         where: { email: email },
//         raw: false,
//       });
//       if (!user) {
//         return resolve({
//           errCode: 1,
//           errMessage: "User not found",
//         });
//       }
//       let hash = await bcrypt.hashSync(newPassword);
//       user.password = hash;

//       await user.save();
//       resolve({
//         errCode: 0,
//         errMessage: "Reset password successfully",
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

let getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: type },
        });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  updateUserData: updateUserData,
  deleteUser: deleteUser,
  // resetPassword: resetPassword,
  getAllCodeService: getAllCodeService,
};
