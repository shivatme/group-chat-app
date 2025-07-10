import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChatMessage } from '../types';
import { useSocket } from '../context/SocketContext';

export default function ChatScreen({
  username,
  onLeave,
}: {
  username: string;
  onLeave: () => void;
}) {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    socket.emit('join', username);

    const handleMessage = (msg: ChatMessage) =>
      setMessages(prev => [...prev, msg]);
    const handleSystem = (text: string) => {
      const systemMessage: ChatMessage = {
        username: 'System',
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    socket.on('history', setMessages);
    socket.on('message', handleMessage);
    socket.on('system', handleSystem);

    return () => {
      socket.off('history', setMessages);
      socket.off('message', handleMessage);
      socket.off('system', handleSystem);
    };
  }, [username, socket]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('message', input.trim());
    setInput('');
  };

  const leaveChat = () => {
    socket.emit('leave', username);
    onLeave();
  };
  function MessageItme({ item, index }: { item: ChatMessage; index: number }) {
    const isOwnMessage = item.username === username;
    const isSystemMessage = item.username === 'System';
    const prevMessage = messages[index - 1];
    const isSameSenderAsPrevious =
      prevMessage && prevMessage.username === item.username;
    const showUsername =
      !isSystemMessage && (!prevMessage || !isSameSenderAsPrevious);

    const topMargin = isSameSenderAsPrevious ? 4 : 8;

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageWrapper}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
          <Text style={styles.systemTimestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageWrapper,
          isOwnMessage ? styles.ownMessageWrapper : styles.otherMessageWrapper,
          { marginTop: topMargin },
        ]}
      >
        {showUsername && !isOwnMessage && (
          <Text style={styles.username}>{item.username}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Room</Text>
        <TouchableOpacity onPress={leaveChat}>
          <Icon name="exit-outline" size={24} color="#ff4da6" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <MessageItme item={item} index={index} />
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ paddingBottom: 10 }}
        onScroll={event => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const layoutHeight = event.nativeEvent.layoutMeasurement.height;
          const contentHeight = event.nativeEvent.contentSize.height;

          const distanceFromBottom = contentHeight - (offsetY + layoutHeight);
          const threshold = 500;

          setShowScrollToBottom(distanceFromBottom > threshold);
        }}
        scrollEventThrottle={100}
      />
      {showScrollToBottom && (
        <TouchableOpacity
          style={styles.scrollToBottomButton}
          onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
          activeOpacity={0.8}
        >
          <Icon name="chevron-down-circle" size={32} color="#ffffff" />
        </TouchableOpacity>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendButton, { opacity: input.trim() ? 1 : 0.5 }]}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e23',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    backgroundColor: '#121231',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaveButton: {
    color: '#ff4da6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 12,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },

  scrollToBottomText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  systemUsername: {
    color: '#ff4da6',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 14,
    marginBottom: 2,
  },
  Text: {
    color: '#fff',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopColor: '#333',
    borderTopWidth: 1,
    backgroundColor: '#121231',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a40',
    borderColor: '#4d4dff',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#6c63ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    shadowColor: '#6c63ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  systemBubble: {
    backgroundColor: '#ff4da622',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  messageWrapper: {
    paddingHorizontal: 10,
  },
  ownMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: '#6c63ff',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#26264d',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'right',
  },
  username: {
    color: '#6c63ff',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 14,
  },
  systemMessageWrapper: {
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  systemMessageText: {
    color: '#888',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  systemTimestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#444cf7',
    borderRadius: 50,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    zIndex: 999,
  },
});
