import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./index"; // Adjust the import path as necessary

const sessionId = "abc123";
const itemsColRef = collection(db, "sessions", sessionId, "items");

const unsubscribeItems = onSnapshot(itemsColRef, (snapshot) => {
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("Items changed:", items);
});

const usernamesColRef = collection(db, "sessions", sessionId, "usernames");

const unsubscribeUsernames = onSnapshot(usernamesColRef, (snapshot) => {
  const users = snapshot.docs.map((doc) => doc.id); // or doc.data() if you store more info
  console.log("Usernames changed:", users);
});
export { unsubscribeItems, unsubscribeUsernames };
