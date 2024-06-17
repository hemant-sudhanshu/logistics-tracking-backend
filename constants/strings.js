export const strings = {
  filters: {
    all: "all",
    lastWeek: "lastWeek",
    lastMonth: "lastMonth",
    lastYear: "lastYear",
  },

  sortOptions: [
    {
      key: "date-desc",
      value: { date: -1 },
    },

    {
      key: "date-asc",
      value: { date: 1 },
    },
    {
      key: "title-desc",
      value: { title: -1 },
    },
    {
      key: "title-asc",
      value: { title: 1 },
    },
    {
      key: "shipmentId-desc",
      value: { shipmentId: -1 },
    },
    {
      key: "shipmentId-asc",
      value: { shipmentId: 1 },
    },
  ],

  common: {
    all: "all",
    incoming: "incoming",
    outgoing: "outgoing",
  },

  validations: {
    firstName3Characters: "First name should be at least 3 characters.",
    lastName3Characters: "Last name should be at least 3 characters.",
    emailRequired: "Email is required.",
    emailAlreadyRegistered: "Email is already registered.",
    emailNotFound: "Email address is not found.",
    passwordRequired: "Password is required.",
    password8Characters: "Password should be at least 8 characters.",
    incorrectPassword: "Incorrect password.",
  },
  messages: {
    invalidToken: "Invalid token!",
    noTokenProvided: "Access denied. No token provided.",
    invalidUser: "User is not valid.",
    success: "Success.",
    accessDenied: "Access Denied.",
    unauthorizedAccess: "Unauthorized access.",
    registeredSuccessfully: "You are successfully registered.",
    loggedIn: "You are now logged in.",
  },

  shipmentMessages: {
    success: "Success.",
    notFound: "No shipments found.",
    addedSuccussfully: "Shipment added successfully.",
    updatedSuccessfully: "Shipment updated successfully.",
    alreadyAdded: "Shipment is already added.",
  },
};
