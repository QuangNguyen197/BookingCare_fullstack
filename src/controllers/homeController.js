import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll(); // User is the name of the model
    console.log("Check data: ", data);
    return res.render("homepage.ejs", {
      dataUser: JSON.stringify(data),
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.send("Error from server");
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  console.log(req.body);
  return res.send("post crud from server");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("displayCRUD.ejs", {
    dataTable: data, // should not JSONstring in ejs
    // because ejs already know how to convert to Javascript, not like React
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    // check user data not found
    // let userData
    let userData = await CRUDService.getUserInfoById(userId);
    console.log(userData);
    return res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    return res.send("Cannor Found a user");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUserData(data); // re-redering allUsers with the new changes of one record
  return res.render("displayCRUD.ejs", {
    dataTable: allUsers,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  let deletedUser = await CRUDService.deleteUserById(id);
  if (id) {
    return res.send("Deleted User Success!");
  } else {
    return res.send("Unsuccessfully Delete");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
