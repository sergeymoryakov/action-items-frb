import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBf5QBUUQ3EZGXw-pEKsBAo4J2ssdNCOv4",
    authDomain: "action-items-firebase.firebaseapp.com",
    projectId: "action-items-firebase",
    storageBucket: "action-items-firebase.appspot.com",
    messagingSenderId: "453868384210",
    appId: "1:453868384210:web:b2d8bd1b94e38bd8f9a20b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

async function add() {
    try {
        const docRef = await addDoc(collection(db, "actionItems"), {
            text: "Pay apartment rental fee",
            completed: false,
            hidden: false,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function get() {
    const querySnapshot = await getDocs(collection(db, "actionItems"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().text}`);
    });
}

// add();
get();
