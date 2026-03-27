import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { setSelectedImage, toggleStyle, setCustomPrompt, startGeneration } from '../../src/store/slices/generationSlice';
import { pickFromGallery, captureFromCamera } from '../../src/utils/imagePicker';
import { useToast } from '../../src/hooks/useToast';
import StyleChip from '../../src/components/styles/StyleChip';
import PromptInput from '../../src/components/common/PromptInput';
import ImageUploadZone from '../../src/components/upload/ImageUploadZone';

const ALL_STYLES = [
  { id: 'cartoon', label: 'Cartoon', icon: 'emoticon-happy-outline', color: '#FF6B9D' },
  { id: 'flat_illustration', label: 'Flat Art', icon: 'vector-square', color: '#4ADE80' },
  { id: 'anime', label: 'Anime', icon: 'star-four-points', color: '#60A5FA' },
  { id: 'pixel_art', label: 'Pixel Art', icon: 'grid', color: '#FBBF24' },
  { id: 'sketch', label: 'Sketch', icon: 'pencil-outline', color: '#C084FC' },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const { selectedImage, selectedStyles, customPrompt, overallStatus } = useSelector(
    (s) => s.generation
  );

  const [pickingImage, setPickingImage] = useState(false);
  const isStarting = overallStatus === 'starting';

  const handleGallery = useCallback(async () => {
    try {
      setPickingImage(true);
      const image = await pickFromGallery();
      if (image) {
        dispatch(setSelectedImage(image));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPickingImage(false);
    }
  }, [dispatch, toast]);

  const handleCamera = useCallback(async () => {
    try {
      setPickingImage(true);
      const image = await captureFromCamera();
      if (image) {
        dispatch(setSelectedImage(image));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPickingImage(false);
    }
  }, [dispatch, toast]);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage) {
      toast.error('Please upload a photo first.');
      return;
    }
    if (selectedStyles.length === 0) {
      toast.error('Please select at least one style.');
      return;
    }

    try {
      const result = await dispatch(
        startGeneration({
          imageBase64: selectedImage.base64,
          mimeType: selectedImage.mimeType,
          styles: selectedStyles,
          customPrompt,
        })
      ).unwrap();

      router.push(`/result/${result.sessionId}`);
    } catch (err) {
      toast.error(err || 'Failed to start generation. Please try again.');
    }
  }, [selectedImage, selectedStyles, customPrompt, dispatch, router, toast]);

  const showImageOptions = () => {
    Alert.alert('Choose Image', 'Upload from gallery or take a new photo', [
      { text: 'Gallery', onPress: handleGallery },
      { text: 'Camera', onPress: handleCamera },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
       >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} className="px-5 pt-6 pb-4">
          <Text className="text-3xl font-bold text-text-primary tracking-tight">
            Clipart <Text className="text-primary">AI</Text>
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            Transform your photo into stunning clipart
          </Text>
        </Animated.View>

        {/* Image Upload Zone */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-5 mb-6">
          <ImageUploadZone
            image={selectedImage}
            onPress={showImageOptions}
            loading={pickingImage}
          />
          {selectedImage && (
            <View className="flex-row items-center justify-end mt-2 gap-x-1">
              <Ionicons name="checkmark-circle" size={14} color="#4ADE80" />
              <Text className="text-success text-xs">
                {selectedImage.width}x{selectedImage.height} · {selectedImage.sizeKB}KB
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Style Selection */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-5 mb-6">
          <Text className="text-text-primary font-semibold text-base mb-3">
            Choose Styles
          </Text>
          <Text className="text-text-secondary text-xs mb-4">
            All selected styles generate in parallel
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {ALL_STYLES.map((style) => (
              <StyleChip
                key={style.id}
                style={style}
                selected={selectedStyles.includes(style.id)}
                onPress={() => dispatch(toggleStyle(style.id))}
              />
            ))}
          </View>
          <Text className="text-text-muted text-xs mt-3">
            {selectedStyles.length} style{selectedStyles.length !== 1 ? 's' : ''} selected
          </Text>
        </Animated.View>

        {/* Custom Prompt */}
        {/* <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-5 mb-6">
          <PromptInput
            value={customPrompt}
            onChangeText={(t) => dispatch(setCustomPrompt(t))}
          />
        </Animated.View> */}

        {/* Generate Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="px-5">
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={isStarting || !selectedImage}
            className={`rounded-2xl py-4 items-center flex-row justify-center gap-x-2 ${
              selectedImage && !isStarting ? 'bg-primary' : 'bg-border'
            }`}
            activeOpacity={0.8}
          >
            {isStarting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons
                name="sparkles"
                size={20}
                color={selectedImage ? '#fff' : '#4A4A65'}
              />
            )}
            <Text
              className={`font-bold text-base ${
                selectedImage && !isStarting ? 'text-white' : 'text-text-muted'
              }`}
            >
              {isStarting ? 'Starting...' : `Generate ${selectedStyles.length} Style${selectedStyles.length !== 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
