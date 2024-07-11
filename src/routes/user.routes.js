const { Router } = require("express");
const {loginUser , logoutUser, register} = require('../controllers/user.controller')
const {riseReport, missingDetail, allMissingDetails, updateMissingReport, updateReportImage,  deleteReport, getReportById, compareImage} = require('../controllers/missingPerson.controller.js')
const {feedbackMessage} = require('../controllers/feedback.controller.js')
const {contactMessage} = require('../controllers/contact.controller.js')
const  verifyJWT  = require("../middlewares/auth.middlewares.js");
const {upload} = require('../middlewares/multer.middleware.js')
const {Adminlogin, Adminregister, AllUsers} = require('../controllers/admin.controller.js')
const router =Router();
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/register").post(register);
router.route("/missingReport").post(verifyJWT, upload.single('missing_image'), riseReport);
router.route("/missingDetails").get(verifyJWT, missingDetail);
router.route("/allMissingDetails").get(allMissingDetails);
router.route('/getReport/:id').get(verifyJWT, getReportById);
router.route('/updatedetails/:id').patch(verifyJWT, updateMissingReport)
router.route("/updateImage/:id").patch(verifyJWT, upload.single('missing_image'), updateReportImage);
router.route("/deleteReport/:id").delete(verifyJWT, deleteReport);
router.route("/feedback").post(verifyJWT,feedbackMessage);
router.route("/contact").post(contactMessage);
router.route("/compareImage").post(verifyJWT,  upload.single('missing_image'), compareImage);
router.route("/AdminLogIn").post(Adminlogin);
router.route("/AdminRegister").post(Adminregister);
router.route('/AdmingetReport/:id').get(getReportById);
router.route("/AdmindeleteReport/:id").delete(deleteReport);
router.route('/Adminupdatedetails                                                                       /:id').patch( updateMissingReport)
router.route("/AdminupdateImage/:id").patch( upload.single('missing_image'), updateReportImage);
router.route("/AllUsers").get(AllUsers);
module.exports = router;



