// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, Alert, View, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const PostList = ({ token }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://1u7ywwy8b8.execute-api.eu-central-1.amazonaws.com/Prod/posts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Failed to fetch posts.');
            }
        };

        fetchPosts();
    }, [token]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <Text>{item.body}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    postContainer: {
        padding: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://1m8ji8zcq2.execute-api.eu-central-1.amazonaws.com/Prod/login', {
                email,
                password
            });

            const { IdToken, RefreshToken } = response.data;
            setToken(IdToken);
            setIsLoggedIn(true);
        } catch (error) {
            Alert.alert('Login Failed', 'Please check your email and password.');
        }
    };

    return (
        <SafeAreaView style={appStyles.container}>
            {!isLoggedIn ? (
                <View>
                    <Text style={appStyles.title}>Mundum Bulletin</Text>
                    <TextInput
                        style={appStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={appStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Button title="Login" onPress={handleLogin} />
                </View>
            ) : (
                <PostList token={token} />
            )}
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20px', // avoid overlapping with the status bar
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginBottom: 10,
        width: '80%',
    },
});

export default App;