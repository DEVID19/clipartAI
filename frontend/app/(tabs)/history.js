import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { removeHistoryItem, clearHistory } from '../../src/store/slices/historySlice';
import { openFullscreen } from '../../src/store/slices/uiSlice';

export default function HistoryScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((s) => s.history);

  const handleClearAll = () => {
    Alert.alert('Clear History', 'Remove all saved generations?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => dispatch(clearHistory()),
      },
    ]);
  };

  const handleView = (resultUrl, style) => {
    dispatch(openFullscreen({ uri: resultUrl, style }));
    router.push('/fullscreen');
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Remove this generation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(removeHistoryItem(id)),
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
      <View className="bg-card rounded-2xl overflow-hidden mb-4 border border-border">
        {/* Original thumbnail + metadata */}
        <View className="flex-row items-center px-4 pt-4 pb-3 gap-x-3">
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: 44, height: 44, borderRadius: 10 }}
            contentFit="cover"
          />
          <View className="flex-1">
            <Text className="text-text-primary font-semibold text-sm">
              {item.styles.length} Style{item.styles.length !== 1 ? 's' : ''} Generated
            </Text>
            <Text className="text-text-muted text-xs">
              {new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className="w-8 h-8 rounded-full items-center justify-center"
          >
            <Ionicons name="trash-outline" size={16} color="#4A4A65" />
          </TouchableOpacity>
        </View>

        {/* Clipart thumbnails row */}
        <ScrollRow styles={item.styles} onView={handleView} />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center px-5 pt-6 pb-4">
        <Text className="flex-1 text-2xl font-bold text-text-primary">History</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text className="text-error text-sm font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="time-outline" size={56} color="#2A2A3D" />
          <Text className="text-text-secondary text-base font-semibold mt-4 text-center">
            No generations yet
          </Text>
          <Text className="text-text-muted text-sm text-center mt-2">
            Your generated cliparts will appear here after creation.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// Horizontal scroll row of style thumbnails
function ScrollRow({ styles, onView }) {
  const { ScrollView } = require('react-native');
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}
    >
      {styles.map((s) => (
        <TouchableOpacity
          key={s.style}
          onPress={() => onView(s.resultUrl, s.style)}
          activeOpacity={0.85}
        >
          <View className="rounded-xl overflow-hidden border border-border">
            <Image
              source={{ uri: s.resultUrl }}
              style={{ width: 100, height: 100 }}
              contentFit="cover"
            />
            <View className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
              <Text className="text-white text-xs font-semibold">{s.label || s.style}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
