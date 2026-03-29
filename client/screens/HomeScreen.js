import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://localhost:3000/api'; // Reminder: change to computers local IP address if I need to test on my physical phone

export default function HomeScreen({ navigation }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch data from the SQLite backend
    const fetchMatches = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setMatches(data);
        } catch (error) {
            console.error("Error fetching matches. Make sure backend is running!", error);
        } finally {
            setLoading(false);
        }
    };

    // useFocusEffect ensures the data refreshes every time we navigate back to this screen
    useFocusEffect(
        useCallback(() => {
            fetchMatches();
        }, [])
    );

    // How a single match card should look
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>🎮 {item.game_title}</Text>
            <Text style={styles.subtitle}>Character: {item.character_played}</Text>
            <Text style={styles.stats}>Kills: {item.kills}  |  KDA: {item.kda_ratio}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>No matches logged yet.</Text>}
                />
            )}

            <TouchableOpacity 
                style={styles.addButton}
                // Temp alert
                onPress={() => alert('Temp Alert')} 
            >
                <Text style={styles.addButtonText}>+ Log New Match</Text>
            </TouchableOpacity>
        </View>
    );
}

// Basic styling
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 16, color: '#555', marginBottom: 5 },
    stats: { fontSize: 16, fontWeight: '600', color: '#007BFF' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
    addButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});