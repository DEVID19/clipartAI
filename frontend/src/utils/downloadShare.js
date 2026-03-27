import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

// Save a Base64 image to gallery

export const saveBase64Image = async (base64Data, styleName) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Storage permission denied. Please enable it in Settings.");
  }

  // Extract format from Base64 data (png, jpg, jpeg)
  const match = base64Data.match(/^data:image\/(\w+);base64,/);
  const format = match ? match[1] : "png";

  const filename = `clipart_${styleName}_${Date.now()}.${format}`;
  const localUri = FileSystem.documentDirectory + filename;

  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");

  // Write file
  await FileSystem.writeAsStringAsync(localUri, base64String, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Save to gallery
  const asset = await MediaLibrary.createAssetAsync(localUri);
  const album = await MediaLibrary.getAlbumAsync("Clipart AI");
  if (!album) {
    await MediaLibrary.createAlbumAsync("Clipart AI", asset, false);
  } else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  }

  return asset;
};

// Share a Base64 image via native share sheet
 
export const shareBase64Image = async (base64Data, styleName) => {
  // Extract format from Base64 data
  const match = base64Data.match(/^data:image\/(\w+);base64,/);
  const format = match ? match[1] : "png";

  const filename = `clipart_${styleName}_${Date.now()}.${format}`;
  const localUri = FileSystem.cacheDirectory + filename;

  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");

  // Write file to cache
  await FileSystem.writeAsStringAsync(localUri, base64String, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) throw new Error("Sharing is not available on this device.");

  await Sharing.shareAsync(localUri, {
    mimeType: `image/${format}`,
    dialogTitle: `Share your ${styleName} clipart`,
  });
};
