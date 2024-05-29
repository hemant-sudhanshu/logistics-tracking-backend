import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { setUser, getUser, extractToken } from "../services/tokenService.js";

const validateEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? false : true;
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};



const handleBadRequest = (res, message) => {
  return res.status(400).json({
    success: false,
    message: message,
  });
};

const handleUnauthorizedRequest = (res, message) => {
  return res.status(401).json({
    success: false,
    message: message,
  });
};

const handleInternalServerError = (res, error) => {
  return res.status(500).json({
    success: false,
    message: error.message,
  });
};

export const handleUserSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate Name
    if (!firstName || firstName.length < 3) {
      return handleBadRequest(
        res,
        "First name should be at least 3 characters."
      );
    }
    if (!lastName || lastName.length < 3) {
      return handleBadRequest(
        res,
        "Last name should be at least 3 characters."
      );
    }

    // validate the email
    if (!email) {
      return handleBadRequest(res, "Email is required.");
    }

    const isEmailNotRegistered = await validateEmail(email);
    if (!isEmailNotRegistered) {
      return handleBadRequest(res, "Email is already registered.");
    }

    // Validate Password
    if (!validatePassword(password)) {
      return handleBadRequest(res, "Password should be at least 8 characters.");
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 8);

    // create a new user

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = setUser(user);
    res.cookie("token", token);

    const result = {
      name: user.name,
      role: user.role,
      email: user.email,
    };

    return res.status(201).json({
      success: true,
      token: token,
      expiresIn: 1200,
      message: "You are successfully registered.",
      data: result,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

export const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate the email
    if (!email) {
      return handleBadRequest(res, "Email is required.");
    }

    // Validate Password
    if (!password) {
      return handleBadRequest(res, "Password is required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email address is not found.",
      });
    }

    // That means the user is existing and trying to signin from the right portal
    // Now check if the password match
    let isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // if the password match Sign a the token and issue it to the user
      let token = setUser(user);
      res.cookie("token", token);

      let result = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
      };

      return res.status(200).json({
        success: true,
        token: `${token}`,
        expiresIn: 1200,
        message: "You are now logged in.",
        data: result,
      });
    } else {
      return res.status(403).json({
        message: "Incorrect password.",
      });
    }
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

export const handleUserProfile = async (req, res) => {
  try {
    //Extract token from the request header
    const token = extractToken(req);

    // Handle unauthorized access
    if (!token) {
      return handleUnauthorizedRequest(res, "Unauthorized access.");
    }

    // Verify token
    const user = getUser(token);
    if (!user) {
      return handleUnauthorizedRequest(res, "Unauthorized access.");
    }

    // Create user JSON object
    let result = {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message: "Success.",
      data: result,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
