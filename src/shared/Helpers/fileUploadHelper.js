

import fs from "fs/promises";

import {v2 as cloudinary} from "cloudinary";


export const uploadToCloudinary = async(filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder : "project-management-saas/attachments",
            resource_type : 'auto',
            ...options,
        });

        await fs.unlink(filePath);

        return {
            url : result.secure_url,
            storageKey : result.public_id,
            originalFilename : result.original_filename,
            format : result.format,
            bytes : result.bytes,
            resourceType : result.resource_type,
        };
    } catch (error) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw error
        }
    }
}