import bcrypt from "bcrypt";
import { User } from "../../models/user.js";
import { setUser, getUser, extractToken } from "../../services/tokenService.js";
import {
  handleBadRequest,
  handleInternalServerError,
  handleUnauthorizedRequest,
  handleNotFoundRequest,
} from "../../services/errorHandler.js";
import { strings } from "../../constants/strings.js";

const { validations, messages, userRoles } = strings;

/**
 * Validates if the given email is not already registered.
 * @param {string} email - The email to validate.
 * @returns {Promise<boolean>} - Returns true if email is not registered, false otherwise.
 */
const validateEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? false : true;
};

/**
 * Validate if the password meets the required length.
 * @param {string} password - User's password.
 * @returns {boolean} - Returns true if password is valid, otherwise false.
 */
const validatePassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Handle user signup process.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const handleUserSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, address } = req.body;

    // Validate Name
    if (!firstName || firstName.length < 3) {
      return handleBadRequest(res, validations.firstName3Characters);
    }
    if (!lastName || lastName.length < 3) {
      return handleBadRequest(res, validations.lastName3Characters);
    }

    // validate email
    if (!email) {
      return handleBadRequest(res, validations.emailRequired);
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

    const newRole = role ? role : userRoles[0];

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: newRole,
      address,
    });

    const token = setUser(user);
    res.cookie("token", token);

    return res.status(201).json({
      success: true,
      token: token,
      expiresIn: 1200,
      message: messages.registeredSuccessfully,
      data: user,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

/**
 * Handle user login process.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate the email
    if (!email) {
      return handleBadRequest(res, validations.emailRequired);
    }

    // Validate Password
    if (!password) {
      return handleBadRequest(res, validations.passwordRequired);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return handleNotFoundRequest(res, validations.emailNotFound);
    }

    // That means the user is existing and trying to signin from the right portal
    // Now check if the password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // if the password match Sign a the token and issue it to the user
      const token = setUser(user);
      res.cookie("token", token);

      return res.status(200).json({
        success: true,
        token: `${token}`,
        expiresIn: 1200,
        message: messages.loggedIn,
        data: user,
      });
    } else {
      return res.status(403).json({
        message: validations.incorrectPassword,
      });
    }
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

/**
 * Handle fetching the user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const handleUserProfile = async (req, res) => {
  try {
    //Extract token from the request header
    const token = extractToken(req);

    // Handle unauthorized access
    if (!token) {
      return handleUnauthorizedRequest(res, messages.unauthorizedAccess);
    }

    // Verify token
    const user = getUser(token);
    if (!user) {
      return handleUnauthorizedRequest(res, messages.unauthorizedAccess);
    }

    return res.status(200).json({
      success: true,
      message: messages.success,
      data: user,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
