import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let message = await doctorService.getTopDoctorService(+limit);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error occurred from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getDoctorsFromService();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error occurred from server",
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let message = await doctorService.saveInforFromService(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error occurred from server",
    });
  }
};

let getDetailsDoctor = async (req, res) => {
  try {
    let message = await doctorService.getDetailsDoctorFromService(req.query.id);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error occured from server",
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailsDoctor: getDetailsDoctor,
};
