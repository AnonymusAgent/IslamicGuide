import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, Clipboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../constants/theme';
import { useApp, AIMessage } from '../contexts/AppContext';

const SUGGESTED_QUESTIONS = [
  'What does the Quran say about patience?',
  'What is the importance of Salah in Islam?',
  'Explain the five pillars of Islam',
  'What are the conditions for a valid fast?',
  'How should a Muslim deal with hardship?',
  'What is the ruling on missing a prayer?',
  'Explain Tawakkul (reliance on Allah)',
  'What is the significance of Surah Al-Fatiha?',
];

const ISLAMIC_SYSTEM_PROMPT = `You are an expert Islamic scholar assistant. You must:
1. ONLY provide information about Islam based on the Quran, authentic Hadith (primarily Sahih al-Bukhari, Sahih Muslim, and the four Sunan), scholarly consensus (Ijma), and established Fiqh.
2. ALWAYS cite specific Quran verses (Surah:Ayah) and/or Hadith references (Book, Number) for every Islamic ruling or statement.
3. Present the views of the four major Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) when there are scholarly differences, without declaring one universally correct.
4. NEVER issue fatwas or personal rulings. Say "consult a qualified scholar" for complex personal matters.
5. Format responses clearly with: Answer, Evidence (Quran/Hadith), Scholarly Notes.
6. For non-Islamic topics, politely redirect: "This is an Islamic guidance assistant. Please ask about Islamic topics."
7. Always maintain respect and follow Islamic etiquette.`;

export default function AIGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { aiMessages, addAIMessage, clearAIChat, colors } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const C = colors;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    if (aiMessages.length > 0) scrollToBottom();
  }, [aiMessages.length, streamingText]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    setIsLoading(true);
    setStreamingText('');

    // Add user message
    await addAIMessage({ role: 'user', content: messageText });

    // Build conversation history for context
    const history = aiMessages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch('https://api.onspace.ai/ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer onspace-public',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: ISLAMIC_SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: messageText },
          ],
          stream: true,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const reader = response.body?.getReader();
      let fullText = '';

      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                const delta = data.choices?.[0]?.delta?.content || '';
                if (delta) {
                  fullText += delta;
                  setStreamingText(fullText);
                }
              } catch { /* skip malformed */ }
            }
          }
        }
      } else {
        const data = await response.json();
        fullText = data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';
      }

      setStreamingText('');
      if (fullText) {
        await addAIMessage({ role: 'assistant', content: fullText });
      }
    } catch (err) {
      setStreamingText('');
      await addAIMessage({
        role: 'assistant',
        content: 'I apologize, I am unable to connect right now. Please check your internet connection and try again.\n\nIn the meantime, you can explore the Quran, Hadith, and Duas sections for authentic Islamic guidance.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text: string) => {
    Clipboard.setString(text);
  };

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: `${C.primary}60`, borderColor: `${C.gold}30` }]}>
            <Text style={styles.avatarText}>☪</Text>
          </View>
        )}
        <Pressable
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: C.userMessage, borderColor: `${C.gold}30` }]
              : [styles.aiBubble, { backgroundColor: C.aiMessage, borderColor: `${C.primary}40` }],
          ]}
          onLongPress={() => copyMessage(item.content)}
        >
          <Text style={[styles.bubbleText, { color: C.textPrimary }]}>{item.content}</Text>
          <Text style={[styles.messageTime, { color: C.textMuted }]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Pressable>
        {isUser && (
          <View style={[styles.avatar, { backgroundColor: `${C.gold}20`, borderColor: `${C.gold}30` }]}>
            <MaterialIcons name="person" size={18} color={C.gold} />
          </View>
        )}
      </View>
    );
  };

  const showSuggestions = aiMessages.length === 0 && !isLoading;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>AI Islamic Guide</Text>
          <Text style={[styles.headerSub, { color: C.textMuted }]}>Powered by Gemini 3</Text>
        </View>
        <Pressable onPress={clearAIChat} style={styles.clearBtn}>
          <MaterialIcons name="delete-outline" size={22} color={C.textMuted} />
        </Pressable>
      </View>

      {/* Disclaimer */}
      <View style={[styles.disclaimer, { backgroundColor: `${C.warning}15`, borderColor: `${C.warning}30` }]}>
        <MaterialIcons name="info-outline" size={14} color={C.warning} />
        <Text style={[styles.disclaimerText, { color: C.textSecondary }]}>
          Always verify with qualified scholars. This AI cites sources but is not a fatwa service.
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={aiMessages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[styles.messages, showSuggestions && styles.messagesCenter]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.welcomeEmoji}>☪️</Text>
            <Text style={[styles.welcomeTitle, { color: C.textPrimary }]}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: C.textSecondary }]}>
              Ask questions about the Quran, Hadith, Islamic rulings, and more. All answers include authentic citations.
            </Text>
          </View>
        }
        ListFooterComponent={
          (isLoading || streamingText) ? (
            <View style={[styles.messageRow, styles.aiRow]}>
              <View style={[styles.avatar, { backgroundColor: `${C.primary}60`, borderColor: `${C.gold}30` }]}>
                <Text style={styles.avatarText}>☪</Text>
              </View>
              <View style={[styles.bubble, styles.aiBubble, { backgroundColor: C.aiMessage, borderColor: `${C.primary}40` }]}>
                {streamingText ? (
                  <Text style={[styles.bubbleText, { color: C.textPrimary }]}>{streamingText}</Text>
                ) : (
                  <View style={styles.typingDots}>
                    <ActivityIndicator size="small" color={C.gold} />
                    <Text style={[styles.typingText, { color: C.textMuted }]}>Researching sources...</Text>
                  </View>
                )}
              </View>
            </View>
          ) : null
        }
      />

      {/* Suggested Questions */}
      {showSuggestions && (
        <View style={styles.suggestions}>
          <Text style={[styles.suggestionsLabel, { color: C.textMuted }]}>Suggested Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <Pressable
                key={i}
                style={[styles.suggestionChip, { backgroundColor: C.card, borderColor: `${C.gold}30` }]}
                onPress={() => sendMessage(q)}
              >
                <Text style={[styles.suggestionText, { color: C.textSecondary }]}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputArea, { backgroundColor: C.surface, borderTopColor: C.cardBorder, paddingBottom: insets.bottom + 8 }]}>
        <View style={[styles.inputRow, { backgroundColor: C.chatInput, borderColor: C.cardBorder }]}>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: C.textPrimary }]}
            placeholder="Ask an Islamic question..."
            placeholderTextColor={C.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
            blurOnSubmit={false}
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: input.trim() && !isLoading ? C.gold : `${C.gold}40` }]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || isLoading}
          >
            <MaterialIcons name="send" size={18} color={input.trim() && !isLoading ? C.primaryDark : C.textMuted} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 1 },
  clearBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  disclaimer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16 },
  messages: { padding: Spacing.md, paddingBottom: 20, gap: 16 },
  messagesCenter: { flexGrow: 1, justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingHorizontal: Spacing.xl, gap: 12 },
  welcomeEmoji: { fontSize: 48 },
  welcomeTitle: { fontSize: 22, fontWeight: '400', textAlign: 'center' },
  welcomeSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  messageRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  avatarText: { fontSize: 18 },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 22 },
  messageTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  typingDots: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4 },
  typingText: { fontSize: 13 },
  suggestions: { paddingTop: Spacing.sm },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.md,
    marginBottom: 6,
  },
  suggestionsScroll: { paddingHorizontal: Spacing.md },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginRight: 8,
    maxWidth: 220,
  },
  suggestionText: { fontSize: 13, lineHeight: 18 },
  inputArea: {
    borderTopWidth: 1,
    padding: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingLeft: Spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
