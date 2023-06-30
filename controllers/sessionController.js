const UserSchema = require("../schemas/userSchema");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sessionController = {
  getSession: async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ user });
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const image = req.file;
      const userExists = await UserSchema.findOne({ email }).lean();

      if (userExists) {
        res.status(400).send("User Already Exists");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userCreated = {};
        if (image) {
          const filePath = `/${image.destination}/${image.filename}`;

          userCreated = await UserSchema.create({ ...req.body, password: hashedPassword, profilePic: filePath });
        } else {
          userCreated = await UserSchema.create({ ...req.body, password: hashedPassword });
        }

        if (userCreated) {
          const accessToken = jwt.sign({ id: userCreated._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: process.env.SESSION_EXPIRE * 60 * 60 * 1000 });
          const user = userCreated;
          res.status(201).json({ user, accessToken });
        } else {
          res.status(400).send("Invalid User Data");
        }
      }
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        res.status(400).send("Please Enter Email");
      }

      if (!password) {
        res.status(400).send("Please Password");
      }

      const user = await UserSchema.findOne({ email: email });

      if (user && (await bcrypt.compare(password, user.password))) {
        //Create JWT
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("jwt", accessToken, { httpOnly: true });
        res.status(200).json({ user, accessToken });
      }
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  logout: async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.sendStatus(204); //No Content
      } else {
        res.clearCookie("jwt", { httpOnly: true });
        res.sendStatus(204);
      }
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  update: async (req, res, next) => {
    try {
      const image = req.file;
      if (image) {
        const filePath = `/${image.destination}/${image.filename}`;

        await UserSchema.findOneAndUpdate({ _id: req.user._id }, { $set: { ...req.body, profilePic: filePath } });
      } else {
        await UserSchema.findOneAndUpdate({ _id: req.user._id }, { $set: { ...req.body } });
      }

      res.sendStatus(204);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserSchema.findOneAndUpdate({ _id: req.user._id }, { $set: { password: hashedPassword } });

      res.sendStatus(204);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },
};

module.exports = sessionController;
