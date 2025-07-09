import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import io from 'socket.io-client';
import { ChatMessage } from '../types';

const socket = io('http://192.168.29.162:3005'); // replace with your IP

export default function ChatScreen({ username }: { username: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    socket.emit('join', username);

    socket.on('history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('system', (text: string) => {
      const systemMessage: ChatMessage = {
        username: 'System',
        text,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const sendMessage = () => {
    if (input.trim() === '') return;
    socket.emit('message', input);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
            <Text>{item.text}</Text>
            <Text style={{ fontSize: 10, color: '#888' }}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
          }}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{ marginLeft: 10, justifyContent: 'center' }}
        >
          <Text style={{ color: 'blue' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
