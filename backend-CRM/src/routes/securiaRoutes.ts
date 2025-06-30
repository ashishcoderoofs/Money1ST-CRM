import express from 'express';
import User from '../models/User';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Add authentication middleware for all Securia routes
router.use(authenticate);

router.post('/reauth', async (req: AuthRequest, res) => {
  try {
    console.log("🔍 Securia reauth attempt");
    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.user?.email, "Role:", req.user?.role);

    if (!req.user) {
      console.log("❌ No authenticated user found");
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Check if user has Securia access (Admin only)
    const hasSecuriaAccess = req.user.role === 'Admin';
    
    if (!hasSecuriaAccess) {
      console.log(`❌ User ${req.user.email} with role ${req.user.role} denied Securia access`);
      return res.status(403).json({ 
        success: false, 
        message: "Access denied - Only Admin users can access Securia",
        userRole: req.user.role,
        requiredRoles: ['Admin']
      });
    }

    console.log(`✅ Securia access granted to ${req.user.email} (${req.user.role})`);
    return res.status(200).json({ 
      success: true, 
      message: "Securia access authenticated successfully",
      user: {
        email: req.user.email,
        role: req.user.role,
        hasSecuriaAccess: true
      }
    });

  } catch (err) {
    console.error("🔥 Securia reauth error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Add a status endpoint to check Securia access
router.get('/status', async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const hasSecuriaAccess = req.user.role === 'Admin';
    
    return res.status(200).json({
      success: true,
      hasAccess: hasSecuriaAccess,
      user: {
        email: req.user.email,
        role: req.user.role
      },
      message: hasSecuriaAccess ? 'Securia access available' : 'Securia access denied'
    });
  } catch (err) {
    console.error("🔥 Securia status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
