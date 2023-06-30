const router = require("express").Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/getTodaysRate", isAuthenticated, userController.getTodaysRate);
router.get("/getTotalUsers", isAuthenticated, userController.getTotalUsers);
router.get("/totalUserCoinSold", isAuthenticated, userController.totalUserCoinSold);

module.exports = router;
