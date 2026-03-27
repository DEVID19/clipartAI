import { TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Map icon names to libraries
const ICON_MAP = {
  'emoticon-happy-outline': { lib: 'MaterialCommunityIcons' },
  'vector-square': { lib: 'MaterialCommunityIcons' },
  'star-four-points': { lib: 'MaterialCommunityIcons' },
  grid: { lib: 'Ionicons' },
  'pencil-outline': { lib: 'MaterialCommunityIcons' },
};

function StyleIcon({ name, size, color }) {
  const config = ICON_MAP[name];
  if (!config) return null;
  if (config.lib === 'Ionicons') {
    return <Ionicons name={name} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export default function StyleChip({ style, selected, onPress }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(selected ? 1 : 0.5);

  useEffect(() => {
    opacity.value = withTiming(selected ? 1 : 0.55, { duration: 200 });
  }, [selected]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      style={animStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View
        className="flex-row items-center gap-x-2 px-3.5 py-2.5 rounded-xl border"
        style={{
          backgroundColor: selected ? `${style.color}18` : '#1E1E2E',
          borderColor: selected ? style.color : '#2A2A3D',
        }}
      >
        <StyleIcon
          name={style.icon}
          size={16}
          color={selected ? style.color : '#4A4A65'}
        />
        <Text
          className="font-semibold text-sm"
          style={{ color: selected ? style.color : '#4A4A65' }}
        >
          {style.label}
        </Text>
        {selected && (
          <View
            className="w-4 h-4 rounded-full items-center justify-center"
            style={{ backgroundColor: style.color }}
          >
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
      </View>
    </AnimatedTouchable>
  );
}
