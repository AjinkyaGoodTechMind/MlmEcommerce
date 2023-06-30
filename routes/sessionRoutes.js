const router = require("express").Router();
const sessionController = require("../controllers/sessionController");
const { isAuthenticated } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profilePic/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

router.get("/getSession", isAuthenticated, sessionController.getSession);

router.put("/changePassword", isAuthenticated, sessionController.changePassword);

router.post("/register", upload.single("profilePic"), sessionController.register);

router.post("/login", sessionController.login);

router.get("/logout", sessionController.logout);

router.put("/update", isAuthenticated, upload.single("image"), sessionController.update);

module.exports = router;
