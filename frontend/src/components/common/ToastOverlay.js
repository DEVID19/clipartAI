import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
const TOAST_CONFIG = {
  success: { icon: "checkmark-circle", color: "#4ADE80", bg: "#0D2E1A" },
  error: { icon: "alert-circle", color: "#F87171", bg: "#2E0D0D" },
  info: { icon: "information-circle", color: "#7C6FFF", bg: "#16133A" },
};

export default function ToastOverlay() {
  const insets = useSafeAreaInsets();
  const { toastMessage, toastType } = useSelector((s) => s.ui);

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toastMessage) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(-100, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [toastMessage]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const config = TOAST_CONFIG[toastType] || TOAST_CONFIG.info;

  if (!toastMessage && opacity.value === 0) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: insets.top + 8,
          left: 16,
          right: 16,
          zIndex: 9999,
        },
        animStyle,
      ]}
    >
      <View
        className="flex-row items-center gap-x-3 px-4 py-3 rounded-2xl border"
        style={{
          backgroundColor: config.bg,
          borderColor: `${config.color}40`,
        }}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
        <Text className="flex-1 text-text-primary text-sm font-medium">
          {toastMessage}
        </Text>
      </View>
    </Animated.View>
  );
}
