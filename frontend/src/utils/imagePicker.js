import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const MAX_DIMENSION = 1024;
const COMPRESS_QUALITY = 0.82;

//  Pick image from gallery

export const pickFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Gallery permission denied. Please enable it in Settings.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  return processPickedImage(asset);
};

// Capture image from camera

export const captureFromCamera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera permission denied. Please enable it in Settings.');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  return processPickedImage(asset);
};

//  Process picked image: resize + compress + get base64
 
const processPickedImage = async (asset) => {
  const { uri, width, height, mimeType } = asset;

  // Determine if resize needed
  const needsResize = width > MAX_DIMENSION || height > MAX_DIMENSION;

  const actions = [];
  if (needsResize) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    actions.push({
      resize: {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
      },
    });
  }

  const manipResult = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: COMPRESS_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  return {
    uri: manipResult.uri,
    base64: manipResult.base64,
    mimeType: 'image/jpeg',
    width: manipResult.width,
    height: manipResult.height,
    originalWidth: width,
    originalHeight: height,
    sizeKB: Math.round((manipResult.base64.length * 3) / 4 / 1024),
  };
};
