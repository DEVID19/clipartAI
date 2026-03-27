import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ZONE_HEIGHT = 220;

export default function ImageUploadZone({ image, onPress, loading }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={loading}>
      <View
        className="rounded-3xl overflow-hidden border-2 border-dashed"
        style={{
          height: ZONE_HEIGHT,
          borderColor: image ? '#7C6FFF' : '#2A2A3D',
          backgroundColor: image ? '#16161F' : '#16161F',
        }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center gap-y-3">
            <ActivityIndicator size="large" color="#7C6FFF" />
            <Text className="text-text-secondary text-sm">Processing image...</Text>
          </View>
        ) : image ? (
          <Animated.View entering={FadeIn.duration(300)} className="flex-1">
            <Image
              source={{ uri: image.uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            {/* Overlay tap hint */}
            <View
              className="absolute bottom-0 left-0 right-0 py-2 items-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
            >
              <View className="flex-row items-center gap-x-1.5">
                <Ionicons name="swap-horizontal-outline" size={14} color="#fff" />
                <Text className="text-white text-xs font-semibold">Tap to change photo</Text>
              </View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={ZoomIn.duration(300)}
            className="flex-1 items-center justify-center gap-y-3 px-8"
          >
            <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
              <Ionicons name="cloud-upload-outline" size={32} color="#7C6FFF" />
            </View>
            <Text className="text-text-primary font-bold text-base text-center">
              Upload Your Photo
            </Text>
            <Text className="text-text-secondary text-xs text-center leading-5">
              Tap to choose from gallery or take a new photo.{'\n'}JPEG, PNG or WebP — max 10MB
            </Text>
            <View className="flex-row gap-x-3 mt-1">
              <View className="flex-row items-center gap-x-1">
                <Ionicons name="images-outline" size={14} color="#4A4A65" />
                <Text className="text-text-muted text-xs">Gallery</Text>
              </View>
              <View className="w-px bg-border h-4" />
              <View className="flex-row items-center gap-x-1">
                <Ionicons name="camera-outline" size={14} color="#4A4A65" />
                <Text className="text-text-muted text-xs">Camera</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
}
