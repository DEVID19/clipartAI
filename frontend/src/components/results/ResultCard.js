import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useState } from "react";
import { saveBase64Image, shareBase64Image } from "../../utils/downloadShare";
const STATUS_COLORS = {
  pending: "#4A4A65",
  processing: "#7C6FFF",
  completed: "#4ADE80",
  failed: "#F87171",
};

const STATUS_LABELS = {
  pending: "Waiting...",
  processing: "Generating...",
  completed: "Done",
  failed: "Failed",
};

function SkeletonPulse({ width, height, style }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 900 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#2A2A3D",
          borderRadius: 12,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export default function ResultCard({
  result,
  cardWidth,
  index,
  onViewFullscreen,
  onToast,
}) {
  const [downloading, setDownloading] = useState(false);
  const cardHeight = cardWidth + 52;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await saveBase64Image(result.resultUrl, result.label || result.style);
      onToast.success("Saved to gallery!");
    } catch (err) {
      onToast.error(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await shareBase64Image(result.resultUrl, result.label || result.style);
    } catch (err) {
      onToast.error(err.message);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(350)}
      style={{ width: cardWidth }}
    >
      <View
        className="rounded-2xl overflow-hidden border border-border bg-card"
        style={{ width: cardWidth }}
      >
        {/* Image area */}
        <View style={{ width: cardWidth, height: cardWidth }}>
          {result.status === "completed" && result.resultUrl ? (
            <TouchableOpacity
              onPress={() => onViewFullscreen(result.resultUrl, result.style)}
              activeOpacity={0.92}
              style={{ flex: 1 }}
            >
              <Image
                source={{ uri: result.resultUrl }}
                style={{ width: cardWidth, height: cardWidth }}
                contentFit="cover"
                transition={400}
              />
              {/* Expand icon overlay */}
              <View className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 items-center justify-center">
                <Ionicons name="expand-outline" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          ) : result.status === "failed" ? (
            <View className="flex-1 items-center justify-center bg-error/5">
              <Ionicons name="alert-circle-outline" size={32} color="#F87171" />
              <Text className="text-error text-xs mt-2 text-center px-2">
                {result.error?.includes("timeout")
                  ? "Timed out"
                  : "Generation failed"}
              </Text>
            </View>
          ) : (
            <View className="flex-1 p-3">
              <SkeletonPulse width={cardWidth - 24} height={cardWidth - 90} />
              <View className="mt-2 items-center gap-y-1">
                <ActivityIndicator size="small" color="#7C6FFF" />
                <Text className="text-text-muted text-xs">
                  {result.status === "processing"
                    ? "Generating..."
                    : "In queue..."}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="px-3 py-2">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-text-primary font-semibold text-xs"
              numberOfLines={1}
            >
              {result.label || result.style}
            </Text>
            <View className="flex-row items-center gap-x-0.5">
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[result.status] }}
              />
              <Text
                className="text-xs ml-0.5"
                style={{ color: STATUS_COLORS[result.status] }}
              >
                {STATUS_LABELS[result.status]}
              </Text>
            </View>
          </View>

          {/* Action buttons — only when completed */}
          {result.status === "completed" && (
            <View className="flex-row gap-x-2 mt-2">
              <TouchableOpacity
                onPress={handleDownload}
                disabled={downloading}
                className="flex-1 flex-row items-center justify-center gap-x-1 py-1.5 rounded-lg bg-primary/10"
              >
                {downloading ? (
                  <ActivityIndicator size={12} color="#7C6FFF" />
                ) : (
                  <Ionicons name="download-outline" size={13} color="#7C6FFF" />
                )}
                <Text className="text-primary text-xs font-semibold">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                className="flex-1 flex-row items-center justify-center gap-x-1 py-1.5 rounded-lg bg-surface border border-border"
              >
                <Ionicons name="share-outline" size={13} color="#8B8BA7" />
                <Text className="text-text-secondary text-xs font-semibold">
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
