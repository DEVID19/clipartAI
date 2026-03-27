import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useGenerationPoller } from '../../src/hooks/useGenerationPoller';
import { useToast } from '../../src/hooks/useToast';
import { resetGeneration } from '../../src/store/slices/generationSlice';
import { openFullscreen } from '../../src/store/slices/uiSlice';
import ResultCard from '../../src/components/results/ResultCard';
import OverallProgress from '../../src/components/results/OverallProgress';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ResultScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { sessionId } = useLocalSearchParams();

  const { overallStatus, styleResults, selectedImage } = useSelector((s) => s.generation);

  // Start polling
  useGenerationPoller();

  const isDone = ['completed', 'partial', 'failed'].includes(overallStatus);
  const completedCount = styleResults.filter((r) => r.status === 'completed').length;
  const totalCount = styleResults.length;

  const handleBack = useCallback(() => {
    if (isDone) {
      dispatch(resetGeneration());
    }
    router.back();
  }, [isDone, dispatch, router]);

  const handleViewFullscreen = useCallback(
    (resultUrl, style) => {
      dispatch(openFullscreen({ uri: resultUrl, style }));
      router.push('/fullscreen');
    },
    [dispatch, router]
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-border">
        <TouchableOpacity
          onPress={handleBack}
          className="w-9 h-9 rounded-full bg-surface items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={18} color="#F0F0FF" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-text-primary font-bold text-lg">Your Cliparts</Text>
          <Text className="text-text-secondary text-xs">
            {isDone
              ? `${completedCount}/${totalCount} completed`
              : `Generating ${totalCount} style${totalCount !== 1 ? 's' : ''}...`}
          </Text>
        </View>
        {isDone && completedCount > 0 && (
          <View className="flex-row items-center gap-x-1">
            <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
            <Text className="text-success text-xs font-semibold">Done</Text>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        {!isDone && (
          <Animated.View entering={FadeIn} className="mb-5">
            <OverallProgress styleResults={styleResults} />
          </Animated.View>
        )}

        {/* Original image */}
        {selectedImage && (
          <Animated.View entering={FadeInDown.duration(300)} className="mb-5">
            <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-2">
              Original
            </Text>
            <View className="rounded-2xl overflow-hidden bg-surface border border-border">
              <Image
                source={{ uri: selectedImage.uri }}
                style={{ width: '100%', height: 180 }}
                contentFit="cover"
              />
            </View>
          </Animated.View>
        )}

        {/* Results grid */}
        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
          Generated Styles
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {styleResults.map((result, index) => (
            <ResultCard
              key={result.style}
              result={result}
              cardWidth={CARD_WIDTH}
              index={index}
              onViewFullscreen={handleViewFullscreen}
              onToast={toast}
            />
          ))}
        </View>

        {/* Done message */}
        {isDone && overallStatus === 'failed' && (
          <Animated.View
            entering={FadeInDown}
            className="mt-6 p-4 rounded-2xl bg-error/10 border border-error/20"
          >
            <Text className="text-error text-sm text-center">
              Generation failed. Please try again.
            </Text>
          </Animated.View>
        )}

        {isDone && completedCount > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
            <TouchableOpacity
              onPress={() => {
                dispatch(resetGeneration());
                router.back();
              }}
              className="rounded-2xl py-4 bg-surface border border-border items-center"
            >
              <Text className="text-text-secondary font-semibold">Create Another</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
