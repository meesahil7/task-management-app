const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateTokenAndSetCookie } = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "passwords-don't-match" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "user-already-exists" });
    }

    const salt = await bcrypt.genSalt(7);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hash,
    });

    await newUser.save();

    res.status(201).json({
      message: "user-registration-successfull",
      newUser,
    });
  } catch (err) {
    console.log({ message: "error-in-signup-controller", error: err.message }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "invalid-credentials" });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "login-successfull",
      token,
    });
  } catch (err) {
    console.log({ message: "error-in-login-controller", error: err.message }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("quleepJwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged-out-successfully" });
  } catch (err) {
    console.log({ message: "error-in-logout-controller", error: err.message }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

module.exports = { signup, login, logout };
