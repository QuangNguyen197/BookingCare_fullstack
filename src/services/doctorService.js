import db from "../models/index.js";

let getTopDoctorService = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDoctorsFromService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveInforFromService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    console.log(inputData);
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkDown ||
        !inputData.action
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkDown: inputData.contentMarkDown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkDown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });

          if (doctorMarkDown) {
            doctorMarkDown.contentHTML = inputData.contentHTML;
            doctorMarkDown.contentMarkDown = inputData.contentMarkDown;
            doctorMarkDown.description = inputData.description;
            await doctorMarkDown.save();
          }
        }

        resolve({
          errCode: 0,
          errMessage: "Successfully save doctor inforamtion",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailsDoctorFromService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }
      let doctor = await db.User.findOne({
        where: { id: inputId },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Markdown,
            attributes: ["description", "contentHTML", "contentMarkDown"],
          },
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
        ],

        raw: false,
        nest: true,
      });
      if (doctor && doctor.image) {
        doctor.image = new Buffer(doctor.image, "base64").toString("binary");
      }

      if (!doctor) {
        doctor = {};
      }

      resolve({
        errCode: 0,
        data: doctor,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorService: getTopDoctorService,
  getDoctorsFromService: getDoctorsFromService,
  saveInforFromService: saveInforFromService,
  getDetailsDoctorFromService: getDetailsDoctorFromService,
};
