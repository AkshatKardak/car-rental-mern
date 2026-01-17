const axios = require('axios');
const FormData = require('form-data');

const uploadToImgBB = async (fileBuffer) => {
    try {
        const formData = new FormData();
        formData.append('image', fileBuffer.toString('base64')); // ImgBB supports base64
        // Or filename if needed, but base64 is often easier for raw buffers with ImgBB API

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        if (response.data && response.data.data && response.data.data.url) {
            return response.data.data.url;
        } else {
            throw new Error('ImgBB Upload Failed');
        }
    } catch (error) {
        console.error('ImgBB Error:', error.response?.data || error.message);
        throw new Error('Image upload failed');
    }
};

module.exports = uploadToImgBB;
