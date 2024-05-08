import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, TextInput, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Entypo } from '@expo/vector-icons';
import firebase from 'firebase/app';
import 'firebase/database';
import colors from '../colors';

const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

const Home = () => {
    const navigation = useNavigation();
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const onChatIconClick = () => {
        navigation.navigate("Chat");
    };

    const toggleSearchBar = () => {
        setIsSearching(prevState => !prevState);
    };

    const handleSearch = () => {
        // Perform search in Firebase
        const usersRef = firebase.database().ref('users');
        usersRef.orderByChild('username').equalTo(searchQuery).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    // User found, update search results state
                    const userData = snapshot.val();
                    const resultsArray = Object.values(userData);
                    setSearchResults(resultsArray);
                } else {
                    // User not found, clear search results
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error("Error searching for user:", error);
            });
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={toggleSearchBar}>
                    <FontAwesome name="search" size={24} color={colors.gray} style={{ marginLeft: 15 }} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <Image
                    source={{ uri: catImageUrl }}
                    style={{
                        width: 40,
                        height: 40,
                        marginRight: 15,
                    }}
                />
            ),
        });
    }, [navigation, isSearching]);

    return (
        <View style={styles.container}>
            {isSearching && (
                <View>
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        placeholder="Search"
                        autoFocus
                    />
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id} // Assuming users have unique IDs
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => console.log("User selected:", item)}>
                                <Text>{item.username}</Text> {/* Assuming 'username' is a property of the user object */}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            <TouchableOpacity
                onPress={onChatIconClick}
                style={styles.chatButton}
            >
                <Entypo name="chat" size={24} color={colors.lightGray} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: "#fff",
    },
    chatButton: {
        backgroundColor: colors.primary,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .9,
        shadowRadius: 8,
        marginRight: 20,
        marginBottom: 50,
    },
    searchInput: {
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 20,
        width: "90%",
    },
});

export default Home;
