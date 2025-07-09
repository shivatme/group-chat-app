import React, { useState } from 'react';
import { Button, SafeAreaView, TextInput, View, Text } from 'react-native';
import ChatScreen from './screens/ChatScreen';

export default function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>
          Enter your username
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          style={{ borderWidth: 1, padding: 10, borderRadius: 5 }}
        />
        <Button
          title="Join Chat"
          onPress={() => username.trim() && setJoined(true)}
        />
      </SafeAreaView>
    );
  }

  return <ChatScreen username={username} />;
}
