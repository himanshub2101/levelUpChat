import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { TouchableOpacity, View, Text, TextInput, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function Chat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={onSignOut}
        >
          <AntDesign name="logout" size={24} color={colors.gray} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  const handleSearch = async () => {
    try {
      const q = query(collection(firestore, 'users'), where('username', '==', searchQuery));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username,
      }));
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for user: ', error);
    }
  };

  const handleChat = (recipientId, recipientName) => {
    // Navigate to chat screen with the selected user
    navigation.navigate('Chat', {
      recipientId,
      recipientName
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ margin: 10, padding: 5, borderWidth: 1, borderColor: 'gray' }}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for a user"
      />
      <TouchableOpacity onPress={handleSearch} style={{ marginHorizontal: 10, marginBottom: 5 }}>
        <Text>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChat(item.id, item.username)}>
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
// import { TouchableOpacity, View, Text } from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// import { collection, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';
// import { auth, firestore } from '../config/firebase';
// import { useNavigation } from '@react-navigation/native';
// import { AntDesign } from '@expo/vector-icons';
// import colors from '../colors';

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [recipientId, setRecipientId] = useState(null); // State to store the recipient's user ID
//   const [recipientName, setRecipientName] = useState(""); // State to store the recipient's name
//   const navigation = useNavigation();

//   const onSignOut = () => {
//     signOut(auth).catch(error => console.log('Error logging out: ', error));
//   };

//   // Function to handle sending messages
//   const handleSend = useCallback(async (newMessages = []) => {
//     const message = newMessages[0];
//     try {
//       await addDoc(collection(firestore, 'chats'), {
//         _id: message._id,
//         text: message.text,
//         createdAt: message.createdAt,
//         user: message.user,
//         recipientId: recipientId // Include recipient's ID in the message document
//       });
//     } catch (error) {
//       console.error('Error sending message: ', error);
//     }
//   }, [recipientId]);

//   // Function to load chat messages
//   useEffect(() => {
//     if (!recipientId) return; // Don't fetch messages if recipient is not selected

//     const q = query(
//       collection(firestore, 'chats'),
//       orderBy('createdAt', 'desc'),
//       where('recipientId', '==', recipientId) // Query messages for the selected recipient only
//     );

//     const unsubscribe = onSnapshot(q, querySnapshot => {
//       const fetchedMessages = querySnapshot.docs.map(doc => ({
//         _id: doc.id,
//         text: doc.data().text,
//         createdAt: doc.data().createdAt.toDate(),
//         user: doc.data().user
//       }));
//       setMessages(fetchedMessages);
//     });

//     return unsubscribe;
//   }, [recipientId]);

//   // Function to handle selecting a recipient
//   const handleSelectRecipient = (recipientId, recipientName) => {
//     setRecipientId(recipientId);
//     setRecipientName(recipientName);
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity
//           style={{ marginRight: 10 }}
//           onPress={onSignOut}
//         >
//           <AntDesign name="logout" size={24} color={colors.gray} />
//         </TouchableOpacity>
//       )
//     });
//   }, [navigation]);

//   // Render bubble with sender's name for received messages
//   const renderBubble = (props) => {
//     const { currentMessage } = props;
//     const isCurrentUser = currentMessage.user._id === auth.currentUser.uid;

//     return (
//       <View>
//         {!isCurrentUser && (
//           <Text style={{ fontSize: 12, color: 'gray', alignSelf: 'flex-start' }}>
//             {recipientName}
//           </Text>
//         )}
//         <Bubble {...props} />
//       </View>
//     );
//   };

//   const renderLoading = () => (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Loading messages...</Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       {!recipientId ? (
//         // Render a list of users to select a recipient
//         <View>
//           <Text>Select a user to chat with:</Text>
//           {/* Example list of users */}
//           <TouchableOpacity onPress={() => handleSelectRecipient("user1", "User 1")}>
//             <Text>User 1</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleSelectRecipient("user2", "User 2")}>
//             <Text>User 2</Text>
//           </TouchableOpacity>
//           {/* Add more users as needed */}
//         </View>
//       ) : (
//         // Render the chat interface once a recipient is selected
//         <GiftedChat
//           messages={messages}
//           onSend={handleSend}
//           user={{
//             _id: auth.currentUser.uid,
//             avatar: 'https://i.pravatar.cc/300'
//           }}
//           renderBubble={renderBubble}
//           renderLoading={renderLoading}
//         />
//       )}
//     </View>
//   );
// }
