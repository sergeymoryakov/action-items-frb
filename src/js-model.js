import { initializeApp } from "firebase/app";
import {
    getFirestore,
    updateDoc,
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";
import { firebaseKeys, DB_NAME } from "./js-constants.js";

// Initialize Firebase and Firestore Cloud
const appFirebase = initializeApp(firebaseKeys);
const db = getFirestore(appFirebase);

// Module Model
export class Model {
    constructor() {}

    get = async (COLLECTION_NAME) => {
        const ref = collection(db, COLLECTION_NAME);
        const q = query(ref, orderBy("createdAt", "desc"));

        const actionItemsDb = [];
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const itemDb = {};
            itemDb.id = doc.id;
            itemDb.text = doc.data().text;
            itemDb.completed = doc.data().completed;
            itemDb.hidden = doc.data().hidden;
            itemDb.createdAt = doc.data().createdAt;
            actionItemsDb.push(itemDb);
            console.log(
                `Document "${doc.data().text}", id = "${
                    doc.id
                }" have been read.`
            );
        });
        console.log(actionItemsDb);
        return actionItemsDb;
    };

    addItemToFirestore = async (item) => {
        try {
            const docRef = doc(db, DB_NAME, item.id); // Use the UUID as the doc id
            await setDoc(docRef, item);
            console.log("Document successfully written with ID:", item.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    updateItemInFirestore = async (itemId, updatedFields) => {
        try {
            const docRef = doc(db, DB_NAME, itemId);
            await updateDoc(docRef, updatedFields);
            console.log("Document successfully updated in Firestore!");
        } catch (error) {
            console.error("Error updating document in Firestore: ", error);
        }
    };

    deleteItemFromFireStore = async (itemId) => {
        try {
            await deleteDoc(doc(db, DB_NAME, itemId));
        } catch (error) {
            console.error("Error deleting document from Firestore", error);
        }
    };
}
