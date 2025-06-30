import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/reauth', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Reauth attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    // ✅ Select password explicitly (because select: false in schema)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.role !== 'Admin') {
      console.log("❌ Not an admin");
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    console.log("✅ Admin authenticated successfully");
    return res.status(200).json({ success: true, message: "Authenticated" });

  } catch (err) {
    console.error("🔥 Reauth error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
