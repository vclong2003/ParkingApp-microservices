import {ApiTypes} from "@src/types/types.api";
import axios from "axios";
import {useState} from "react";

const uploadInstance = axios.create({
    baseURL: ApiTypes.UPLOAD_HOST,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

export function useUpload() {
    const [isUploading, setIsUploading] = useState(false);

    // Upload avatar --------------------------------------------------------
    type TUploadAvatarPayload = {
        file: {
            uri: string;
            type: string;
            name: string;
        };
    };
    const uploadAvatar = async ({file}: TUploadAvatarPayload) => {
        setIsUploading(true);
        const payload = new FormData();
        payload.append("file", file);

        try {
            const response = await uploadInstance.post("/avatar", payload);
            const path = (response?.data?.path as string) || "";
            return path;
        } catch (error) {
            return "";
        } finally {
            setIsUploading(false);
        }
    };

    // Upload parking lot media ------------------------------------------------------
    type TUploadParkingLotMediaPayload = {
        files: {
            uri: string;
            type: string;
            name: string;
        }[];
    };
    const uploadParkingLotMedia = async ({files}: TUploadParkingLotMediaPayload) => {
        setIsUploading(true);
        const payload = new FormData();
        files.forEach(file => {
            payload.append("files", file);
        });

        try {
            const response = await uploadInstance.post("/parkingLot/media", payload);
            const paths = (response?.data?.paths as string[]) || [];
            return paths;
        } catch (error) {
            return [];
        } finally {
            setIsUploading(false);
        }
    };

    // Upload parking lot service media -----------------------------------------------
    type TUploadParkingLotServiceMediaPayload = {
        files: {
            uri: string;
            type: string;
            name: string;
        }[];
    };
    const uploadParkingLotServiceMedia = async ({files}: TUploadParkingLotServiceMediaPayload) => {
        setIsUploading(true);
        const payload = new FormData();
        files.forEach(file => {
            payload.append("files", file);
        });

        try {
            const response = await uploadInstance.post("/parkingLotService/media", payload);
            const paths = (response?.data?.paths as string[]) || [];
            return paths;
        } catch (error) {
            return [];
        } finally {
            setIsUploading(false);
        }
    };

    // Upload vehicle image -----------------------------------------------------------
    type TUploadVehicleImagePayload = {
        file: {
            uri: string;
            type: string;
            name: string;
        };
    };
    const uploadVehicleImage = async ({file}: TUploadVehicleImagePayload) => {
        setIsUploading(true);
        const payload = new FormData();
        payload.append("file", file);

        try {
            const response = await uploadInstance.post("/vehicle/image", payload);
            const path = (response?.data?.path as string) || "";
            return path;
        } catch (error) {
            return "";
        } finally {
            setIsUploading(false);
        }
    };

    return {uploadAvatar, uploadParkingLotMedia, uploadParkingLotServiceMedia, uploadVehicleImage, isUploading};
}
