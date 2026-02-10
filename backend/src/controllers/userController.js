const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, profilePicture } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                profilePicture: updatedUser.profilePicture,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const { notifications, darkMode, language, twoFactorAuth } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update preferences
        if (!user.preferences) {
            user.preferences = {};
        }

        if (notifications !== undefined) user.preferences.notifications = notifications;
        if (darkMode !== undefined) user.preferences.darkMode = darkMode;
        if (language !== undefined) user.preferences.language = language;
        if (twoFactorAuth !== undefined) user.preferences.twoFactorAuth = twoFactorAuth;

        await user.save();

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
