import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const isPlaceholder = (value) => /your_|placeholder|example/i.test(value || '');

export const requestImagePermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert(
            'Permiso necesario',
            'Permite el acceso a tus fotos para cambiar la imagen de perfil.'
        );
        return false;
    }
    return true;
};

export const pickImage = async () => {
    const hasPermission = await requestImagePermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
    });

    if (result.canceled) return null;

    const asset = result.assets?.[0];
    if (!asset?.uri) {
        throw new Error('No se pudo leer la imagen seleccionada.');
    }

    return asset;
};

export const uploadImageToCloudinary = async (asset) => {
    if (
        !CLOUDINARY_CLOUD_NAME
        || !CLOUDINARY_UPLOAD_PRESET
        || isPlaceholder(CLOUDINARY_CLOUD_NAME)
        || isPlaceholder(CLOUDINARY_UPLOAD_PRESET)
    ) {
        throw new Error(
            'Cloudinary no está configurado. En la carpeta Movil-2-Finanzas-Top-main, ' +
            'reemplaza EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME y EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ' +
            'en tu archivo .env por los valores de tu cuenta y crea un preset de carga sin firma.'
        );
    }

    const mimeType = asset.mimeType || 'image/jpeg';
    const mimeExtension = mimeType.split('/')[1]?.split(';')[0]?.toLowerCase();
    const fileExtension = asset.fileName?.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase();
    const extension = fileExtension || (mimeExtension === 'jpeg' ? 'jpg' : mimeExtension) || 'jpg';
    const formData = new FormData();

    formData.append('file', {
        uri: asset.uri,
        type: mimeType,
        name: asset.fileName || `profile_${Date.now()}.${extension}`,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
            },
        }
    );

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Cloudinary respondió con un formato inesperado (${response.status}).`);
    }

    if (!response.ok) {
        throw new Error(data.error?.message || `Cloudinary rechazó la imagen (${response.status}).`);
    }

    if (!data.secure_url) {
        throw new Error('Cloudinary no devolvió la dirección de la imagen.');
    }

    return data.secure_url;
};

export const selectAndUploadImage = async () => {
    const imageAsset = await pickImage();
    if (!imageAsset) return null;

    return uploadImageToCloudinary(imageAsset);
};