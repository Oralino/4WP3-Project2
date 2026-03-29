import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://localhost:3000/api';

export default function HomeScreen({ navigation }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State to track which game folders are expanded (open)
    const [expandedGames, setExpandedGames] = useState({});

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

    useFocusEffect(
        useCallback(() => {
            fetchMatches();
        }, [])
    );

    // Function to group the flat array of matches by their game_title
    const groupMatchesByGame = () => {
        return matches.reduce((groups, match) => {
            const game = match.game_title;
            if (!groups[game]) {
                groups[game] = [];
            }
            groups[game].push(match);
            return groups;
        }, {});
    };

    // Function to toggle a specific folder open or closed
    const toggleFolder = (gameTitle) => {
        setExpandedGames(prevState => ({
            ...prevState,
            [gameTitle]: !prevState[gameTitle] // Flip the folder state from true to false or vice versa
        }));
    };

    const groupedMatches = groupMatchesByGame();
    // Get an array of just the unique game titles to use as our list items
    const gameTitles = Object.keys(groupedMatches);

    // Tenders a Folder, and if expanded, renders the matches inside it
    const renderFolder = ({ item: gameTitle }) => {
        const gameMatches = groupedMatches[gameTitle];
        const isExpanded = expandedGames[gameTitle];

        return (
            <View style={styles.folderContainer}>
                <TouchableOpacity 
                    style={styles.folderHeader} 
                    onPress={() => toggleFolder(gameTitle)}
                >
                    <Text style={styles.folderTitle}>📁 {gameTitle} ({gameMatches.length})</Text>
                    <Text style={styles.folderIcon}>{isExpanded ? '🔽' : '▶️'}</Text>
                </TouchableOpacity>

                {/* The Matches Inside (Only shows if isExpanded is true) */}
                {isExpanded && (
                    <View style={styles.folderContent}>
                        {gameMatches.map((match) => (
                            <TouchableOpacity 
                                key={match.id.toString()}
                                style={styles.card}
                                onPress={() => navigation.navigate('Form', { match: match })}
                            >
                                <Text style={styles.subtitle}>👤 {match.character_played}</Text>
                                <Text style={styles.stats}>Kills: {match.kills}  |  KDA: {match.kda_ratio}</Text>
                                <Text style={styles.editHint}>Tap to Edit or Delete</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={gameTitles}
                    keyExtractor={(item) => item}
                    renderItem={renderFolder}
                    ListEmptyComponent={<Text style={styles.emptyText}>No matches logged yet.</Text>}
                />
            )}

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
    
    // Folder Styles
    folderContainer: { marginBottom: 10 },
    folderHeader: { backgroundColor: '#343a40', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    folderTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    folderIcon: { color: 'white', fontSize: 18 },
    folderContent: { paddingLeft: 10, paddingRight: 10, paddingTop: 10, borderLeftWidth: 2, borderColor: '#343a40', marginLeft: 10 },
    
    // Match Card Styles
    card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    subtitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    stats: { fontSize: 15, fontWeight: '600', color: '#007BFF' },
    editHint: { color: '#888', marginTop: 8, fontSize: 12, fontStyle: 'italic' },
    
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
    addButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});