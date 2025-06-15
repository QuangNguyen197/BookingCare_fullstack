import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { Sequelize } from "sequelize";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("Create a new user succeed!");
    } catch (e) {
      reject(e);
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

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true, // raw: true will return plain object instead of instance of Sequelize model in log
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async(resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId},
        raw: true,

      })
      if (user) {
        resolve(user)
      }
      else {
        resolve({})
      }
    }catch (e) {
      reject(e);
    }

  })
}
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id }
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();

        // Re-rendering user table after editiing 
        let allUsers = await db.User.findAll()
        resolve(allUsers);
        resolve();
      } else {
        resolve();
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

let deleteUserById = (id) => {
  return new Promise (async(resolve, reject)=> {
    try {
      let user = await db.User.findOne({
        where: {id: id}
      });
      if (user) {
        await user.destroy();
      }
      let allUsers = await db.User.findAll()
      resolve(allUsers);
      resolve(); // return;
      

    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
