import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
// import { closeFullscreen } from '../../src/store/slices/uiSlice';
// import { useToast } from '../../src/hooks/useToast';
import { saveBase64Image, shareBase64Image } from "../src/utils/downloadShare";
import { useState } from "react";
import { closeFullscreen } from "../src/store/slices/uiSlice";
import { useToast } from "../src/hooks/useToast";

const { width, height } = Dimensions.get("window");

const STYLE_LABELS = {
  cartoon: "Cartoon",
  flat_illustration: "Flat Art",
  anime: "Anime",
  pixel_art: "Pixel Art",
  sketch: "Sketch",
};

export default function FullscreenScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { fullscreenImage } = useSelector((s) => s.ui);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!fullscreenImage) {
    router.back();
    return null;
  }

  const { uri, style } = fullscreenImage;
  const label = STYLE_LABELS[style] || style;

  const handleClose = () => {
    dispatch(closeFullscreen());
    router.back();
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await saveBase64Image(uri, label);
      toast.success("Saved to gallery!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      await shareBase64Image(uri, label);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className="flex-1 bg-black/95"
    >
      <StatusBar style="light" />

      {/* Top bar */}
      <View
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-5 pt-14 pb-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <TouchableOpacity
          onPress={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-base">{label}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Image */}
      <Image source={{ uri }} style={{ width, height }} contentFit="contain" />

      {/* Bottom actions */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-x-3 px-5 pb-12 pt-4"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <TouchableOpacity
          onPress={handleDownload}
          disabled={downloading}
          className="flex-1 flex-row items-center justify-center gap-x-2 py-3.5 rounded-xl bg-primary"
          activeOpacity={0.85}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="download-outline" size={18} color="#fff" />
          )}
          <Text className="text-white font-semibold">Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          disabled={sharing}
          className="flex-1 flex-row items-center justify-center gap-x-2 py-3.5 rounded-xl bg-surface border border-border"
          activeOpacity={0.85}
        >
          {sharing ? (
            <ActivityIndicator color="#7C6FFF" size="small" />
          ) : (
            <Ionicons name="share-outline" size={18} color="#7C6FFF" />
          )}
          <Text className="text-primary font-semibold">Share</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
