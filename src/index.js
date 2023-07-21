import { initializeApp } from "firebase/app";
import {
    getFirestore,
    updateDoc,
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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

let actionItems = [];
const DB_NAME = "actionItems";
const TRASH_OPEN_CLASSNAME = "trash-bin-open";

const newItemInputNode = document.getElementById("newItemInput");
const newItemBtnNode = document.getElementById("newItemBtn");
const listContainerNode = document.getElementById("listContainer");
const trashSwitchNode = document.getElementById("trashSwitch");
const trashContainerNode = document.getElementById("trashContainer");

initializeAppData();

async function initializeAppData() {
    actionItems = await get(DB_NAME);
    renderActiveList();
}

async function get(COLLECTION_NAME) {
    const actionItemsDb = [];
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    querySnapshot.forEach((doc) => {
        itemDb = {};
        itemDb.id = doc.id;
        itemDb.text = doc.data().text;
        itemDb.completed = doc.data().completed;
        itemDb.hidden = doc.data().hidden;
        actionItemsDb.push(itemDb);
        console.log(
            `Document "${doc.data().text}", id = "${doc.id}" have been read.`
        );
    });
    console.log(actionItemsDb);
    return actionItemsDb;
}

async function addItemToFirestore(item) {
    try {
        const docRef = doc(db, DB_NAME, item.id); // Use the UUID as the doc id
        await setDoc(docRef, item);
        console.log("Document successfully written with ID:", item.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

async function updateItemInFirestore(itemId, updatedFields) {
    try {
        const docRef = doc(db, DB_NAME, itemId);
        await updateDoc(docRef, updatedFields);
        console.log("Document successfully updated in Firestore!");
    } catch (error) {
        console.error("Error updating document in Firestore: ", error);
    }
}

async function deleteItemFromFireStore(itemId) {
    try {
        await deleteDoc(doc(db, DB_NAME, itemId));
    } catch (error) {
        console.error("Error deleting document from Firestore", error);
    }
}

// Event listener for new item
newItemBtnNode.addEventListener("click", function () {
    const itemFromUser = getItemFromUser();
    if (!itemFromUser.text) {
        alert("Please enter the field");
        return;
    }

    // add new item to items list
    addItem(itemFromUser);

    // update Firebase
    addItemToFirestore(itemFromUser);

    clearInputField();
    clearTrashList();
    renderActiveList();
});

trashSwitchNode.addEventListener("click", function () {
    trashSwitchNode.classList.toggle(TRASH_OPEN_CLASSNAME);
    const binOpen = trashSwitchNode.className.includes(TRASH_OPEN_CLASSNAME);
    if (!binOpen) {
        clearTrashList();
    } else {
        renderTrashList();
    }
    console.log(trashSwitchNode.className);
    return;
});

// Get new item from user
function getItemFromUser() {
    const newItemFromCustomer = {
        id: generateUniqueId(),
        text: newItemInputNode.value,
        completed: false,
        hidden: false,
    };
    return newItemFromCustomer;
}

function addItem(newActionItem) {
    actionItems.push(newActionItem);
}

// Generate unique id has not been used in array yet:
function generateUniqueId() {
    return uuidv4();
}

// Create list item template for rendering
function createListItem(item) {
    const listItem = document.createElement("li");
    if (item.completed) {
        listItem.className = "display-item-wrapper completed";
    } else {
        listItem.className = "display-item-wrapper";
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox_${item.id}`;
    checkbox.className = "item-checkbox";
    checkbox.checked = item.completed;

    const label = document.createElement("label");
    label.className = "display-item";
    label.htmlFor = `checkbox_${item.id}`;
    label.innerText = item.text;

    const hideButton = document.createElement("button");
    hideButton.className = "item-hide-btn";
    hideButton.id = `btn_${item.id}`;
    // hideButton.innerText = '';

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(hideButton);

    return listItem;
}

function createTrashItem(item) {
    const trashItem = document.createElement("li");
    if (item.completed) {
        trashItem.className = "display-item-wrapper completed";
    } else {
        trashItem.className = "display-item-wrapper";
    }

    const restoreButton = document.createElement("button");
    restoreButton.className = "restore-btn";
    restoreButton.id = `btn_${item.id}`;
    // restoreButton.innerText = '';

    const label = document.createElement("label");
    label.className = "display-item";
    label.htmlFor = `checkbox_${item.id}`;
    label.innerText = item.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "item-delete-btn";
    deleteButton.id = `delete-btn_${item.id}`;
    // deleteButton.innerText = '';

    trashItem.appendChild(restoreButton);
    trashItem.appendChild(label);
    trashItem.appendChild(deleteButton);

    return trashItem;
}

function clearInputField() {
    return (newItemInputNode.value = "");
}

function clearActiveList() {
    return (listContainerNode.innerHTML = "");
}

// Render the list
function renderActiveList() {
    clearActiveList();

    // Create list item and append list container
    actionItems.forEach((item) => {
        if (!item.hidden) {
            const listItem = createListItem(item);
            listContainerNode.appendChild(listItem);
        }
    });

    // Set event listeners for checkboxes and btns
    const checkboxes = document.querySelectorAll(".item-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckboxChange);
    });

    const hideButtons = document.querySelectorAll(".item-hide-btn");
    hideButtons.forEach((button) => {
        button.addEventListener("click", handleHideButtonClick);
    });
}

function clearTrashList() {
    return (trashContainerNode.innerHTML = "");
}

function renderTrashList() {
    clearTrashList();

    // Create list item and append list container
    actionItems.forEach((item) => {
        if (item.hidden) {
            const trashItem = createTrashItem(item);
            trashContainerNode.appendChild(trashItem);
        }
    });

    if (trashContainerNode.innerHTML == "") {
        trashContainerNode.innerText = "No items in trash bin.";
    }

    const restoreButtons = document.querySelectorAll(".restore-btn");
    restoreButtons.forEach((button) => {
        button.addEventListener("click", handleRestoreButtonClick);
    });

    const deleteButtons = document.querySelectorAll(".item-delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", handleDeleteButtonClick);
    });
}

// Event handler for checkbox change event
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const itemId = checkbox.id.split("_")[1];

    // Find the item in the local array
    const item = actionItems.find((item) => item.id === itemId);

    if (item) {
        // Toggle the completed state
        item.completed = !item.completed;
        console.log(`Action item ${itemId} status updated: ${item.completed}`);

        updateItemInFirestore(itemId, { completed: item.completed });
        console.log("Element updated in Firestore.");
    }
    renderActiveList();
}

// Event handler for hide button click event
function handleHideButtonClick(event) {
    const button = event.target;
    const itemId = button.id.split("_")[1];

    //  Confirm radiness to delete
    // if (!confirm("Please confirm moving item to trash bin")) {
    //     return;
    // }

    // Update hidden status for item with relevant id:
    const item = actionItems.find((item) => item.id === itemId);
    if (item) {
        item.hidden = true;
        console.log(
            `Action item ${itemId} hidden status updated: ${item.hidden}`
        );
        updateItemInFirestore(itemId, { hidden: true });
        console.log("Element updated in Firestore.");
    }
    renderActiveList();
    clearTrashList();
}

// Event handler for delete button click event
function handleDeleteButtonClick(event) {
    const button = event.target;
    const itemId = button.id.split("_")[1];
    console.log(`request to delete item with id: ${itemId}`);

    //  Confirm radiness to delete
    if (!confirm("Please confirm permanent deletion.")) {
        return;
    }

    // Update hidden status for item with relevant id:
    const item = actionItems.find((item) => item.id === itemId);
    if (item) {
        deleteItemFromFireStore(itemId);
        console.log(
            `Document with ID: ${itemId} has been deleted from Firestore`
        );
    }
    renderTrashList();
}

function handleRestoreButtonClick(event) {
    const button = event.target;
    const itemId = button.id.split("_")[1];

    // Update hidden status for item with relevant id:
    const item = actionItems.find((item) => item.id === itemId);
    if (item) {
        item.hidden = false;
        console.log(
            `Action item ${itemId} hidden status updated: ${item.hidden}`
        );
        updateItemInFirestore(itemId, { hidden: false });
        console.log("Element updated in Firestore.");
    }
    renderActiveList();
    renderTrashList();
}
