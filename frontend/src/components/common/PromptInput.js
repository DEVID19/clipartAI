import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

export default function PromptInput({ value, onChangeText }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setExpanded((e) => !e)}
        className="flex-row items-center gap-x-2 py-2"
        activeOpacity={0.7}
      >
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-forward'}
          size={14}
          color="#8B8BA7"
        />
        <Text className="text-text-secondary text-sm font-semibold">
          Custom Prompt (optional)
        </Text>
        {value.length > 0 && (
          <View className="w-2 h-2 rounded-full bg-primary ml-1" />
        )}
      </TouchableOpacity>

      {expanded && (
        <Animated.View entering={FadeInDown.duration(200)}>
          <View className="mt-2 rounded-xl border border-border bg-surface overflow-hidden">
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="e.g. wearing sunglasses, colorful background..."
              placeholderTextColor="#4A4A65"
              multiline
              maxLength={300}
              style={{
                color: '#F0F0FF',
                fontSize: 13,
                padding: 12,
                minHeight: 72,
                textAlignVertical: 'top',
              }}
            />
            <View className="flex-row items-center justify-between px-3 py-2 border-t border-border">
              <Text className="text-text-muted text-xs">
                Adds context to every style
              </Text>
              <Text className="text-text-muted text-xs">{value.length}/300</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
