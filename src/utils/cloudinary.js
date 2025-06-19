export const getCloudinaryPublicId = (imageUrl) => {
    const encodedId = imageUrl.split("/upload/")[1]
        .replace(/v\d+\//, "")
        .replace(/\.[^/.]+$/, "");

    return decodeURIComponent(encodedId);
};