import { v2 as cloudinary } from "cloudinary";

export const deleteFromCloudinary = async (storageKey) => {
    const result = await cloudinary.uploader.destroy(storageKey);

    if (result.result !== "ok" && result.result !== "not found") {
        throw new Error("Failed to delete attachment from Cloudinary.");
    }

    return result;
};