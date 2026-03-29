import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://localhost:3000/api';

export default function HomeScreen({ navigation }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMatches = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setMatches(data);
        } catch (error) {
            console.error("Error fetching matches:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refreshes the list automatically every time we come back from the Form screen
    useFocusEffect(
        useCallback(() => {
            fetchMatches();
        }, [])
    );

    // Individual card. Now wrapped it in a TouchableOpacity so tapping it opens the Form screen with the data
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Form', { match: item })}
        >
            <Text style={styles.title}>🎮 {item.game_title}</Text>
            <Text style={styles.subtitle}>Character: {item.character_played}</Text>
            <Text style={styles.stats}>Kills: {item.kills}  |  KDA: {item.kda_ratio}</Text>
            <Text style={styles.editHint}>Tap to Edit or Delete</Text>
        </TouchableOpacity>
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

            {/* Navigation button for logging a new match */}
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Form')} 
            >
                <Text style={styles.addButtonText}>+ Log New Match</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 16, color: '#555', marginBottom: 5 },
    stats: { fontSize: 16, fontWeight: '600', color: '#007BFF' },
    editHint: { color: '#888', marginTop: 10, fontSize: 12, fontStyle: 'italic' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
    addButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});