import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const API_URL = 'http://localhost:3000/api'; // Use this for Local PC

// const API_URL = 'http://10.0.0.13:3000/api'; // Use this if trying to remote connect to phone


export default function FormScreen({ route, navigation }) {
    const editingMatch = route.params?.match;

    // Pre-fill the state if editing, otherwise start blank
    const [gameTitle, setGameTitle] = useState(editingMatch ? editingMatch.game_title : '');
    const [characterPlayed, setCharacterPlayed] = useState(editingMatch ? editingMatch.character_played : '');
    const [kills, setKills] = useState(editingMatch ? editingMatch.kills.toString() : '');
    const [kdaRatio, setKdaRatio] = useState(editingMatch ? editingMatch.kda_ratio.toString() : '');

    const handleSave = async () => {
        // Basic validation
        if (!gameTitle || !characterPlayed || !kills || !kdaRatio) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        // Structure the data to match what your Express backend expects
        const matchData = {
            game_title: gameTitle,
            character_played: characterPlayed,
            kills: parseInt(kills, 10),
            kda_ratio: parseFloat(kdaRatio)
        };

        try {
            // Determine if we are creating a new match (POST) or updating an old one (PUT)
            const url = editingMatch ? `${API_URL}/${editingMatch.id}` : API_URL;
            const method = editingMatch ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matchData)
            });

            if (response.ok) {
                // If successful, go back to the Home screen
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to save match');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Make sure your backend is running.');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!editingMatch) return;

        try {
            const response = await fetch(`${API_URL}/${editingMatch.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to delete match');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Game Title</Text>
            <TextInput 
                style={styles.input} 
                value={gameTitle} 
                onChangeText={setGameTitle} 
                placeholder="e.g. Valorant" 
            />

            <Text style={styles.label}>Character Played</Text>
            <TextInput 
                style={styles.input} 
                value={characterPlayed} 
                onChangeText={setCharacterPlayed} 
                placeholder="e.g. Omen" 
            />

            <Text style={styles.label}>Kills</Text>
            <TextInput 
                style={styles.input} 
                value={kills} 
                onChangeText={setKills} 
                keyboardType="numeric" 
                placeholder="e.g. 15" 
            />

            <Text style={styles.label}>KDA Ratio</Text>
            <TextInput 
                style={styles.input} 
                value={kdaRatio} 
                onChangeText={setKdaRatio} 
                keyboardType="numeric" 
                placeholder="e.g. 2.5" 
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>💾 Save Match</Text>
            </TouchableOpacity>

            {editingMatch && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>🗑️ Delete Match</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
    saveButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    deleteButton: { backgroundColor: '#DC3545', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});