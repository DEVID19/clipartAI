import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
export default function OverallProgress({ styleResults }) {
  const total = styleResults.length;
  const completed = styleResults.filter(
    (r) => r.status === "completed" || r.status === "failed",
  ).length;
  const successCount = styleResults.filter(
    (r) => r.status === "completed",
  ).length;

  const progress = total > 0 ? completed / total : 0;
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 600 });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View className="bg-card rounded-2xl p-4 border border-border">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-text-primary font-semibold text-sm">
          Generating cliparts
        </Text>
        <Text className="text-text-secondary text-xs">
          {successCount}/{total} ready
        </Text>
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-surface rounded-full overflow-hidden">
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: "#7C6FFF",
              borderRadius: 99,
            },
            barStyle,
          ]}
        />
      </View>

      {/* Per-style status dots */}
      <View className="flex-row gap-x-2 mt-3 flex-wrap gap-y-1">
        {styleResults.map((r) => (
          <View key={r.style} className="flex-row items-center gap-x-1">
            <View
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  r.status === "completed"
                    ? "#4ADE80"
                    : r.status === "failed"
                      ? "#F87171"
                      : r.status === "processing"
                        ? "#7C6FFF"
                        : "#2A2A3D",
              }}
            />
            <Text className="text-text-muted text-xs">
              {r.label || r.style}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
