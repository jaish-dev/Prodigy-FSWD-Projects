// Load environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Load models
const EmployeeModel = require("./Models/Employee");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());

// Connect to MongoDB
const DB_URI = process.env.MONGODB_URI;
if (!DB_URI) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(3001, () => {
      console.log("Server is live on port 3001");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// JWT Authentication Middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized: Invalid token" });
    req.user = decoded;
    next();
  });
};

// Home route (protected)
app.get("/Home", verifyUser, async (req, res) => {
  try {
    const user = await EmployeeModel.findById(req.user.id).select("name email _id");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Welcome to Home",
      user: {
        name: user.name,
        email: user.email,
        id: user._id
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Signup route
app.post("/Signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await EmployeeModel.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax", // Use 'None' + secure: true in production over HTTPS
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({ message: "Successfully Logged In" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", // Same as used in login
    secure: process.env.NODE_ENV === "production"
  });

  return res.status(200).json({ message: "Logged out successfully" });
});
