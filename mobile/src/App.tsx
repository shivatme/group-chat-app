import React, { useState } from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import ChatScreen from './screens/ChatScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SocketProvider } from './context/SocketContext';

export default function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <SocketProvider>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: '#0e0e23' }}
          edges={['top', 'bottom']}
        >
          {!joined ? (
            <View style={styles.container}>
              <Text style={styles.title}>GAMERSBERG CHAT</Text>
              <Text style={styles.subtitle}>
                Enter your username to join the chat lobby
              </Text>

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#aaa"
                style={styles.input}
              />

              <TouchableOpacity
                style={[styles.button, { opacity: username.trim() ? 1 : 0.5 }]}
                onPress={() => username.trim() && setJoined(true)}
              >
                <Text style={styles.buttonText}>Join Chat</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ChatScreen username={username} onLeave={() => setJoined(false)} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </SocketProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e23',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0ff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#4d4dff',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#1a1a40',
  },
  button: {
    backgroundColor: '#6c63ff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#6c63ff',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
