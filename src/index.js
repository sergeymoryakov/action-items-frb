import { initializeApp } from "firebase/app";
import {
    getFirestore,
    updateDoc,
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { firebaseKeys, DB_NAME, TRASH_OPEN_CLASSNAME } from "./js-constants.js";

// TO-DO NEXT STEP:
// import { actionItems } from "./js-constants.js";
// Initialize Global Variable
let actionItems = [];

// Module View
class View {
    constructor(controller) {
        this.controller = controller;
        this.newItemInputNode = document.getElementById("newItemInput");
        this.newItemBtnNode = document.getElementById("newItemBtn");
        this.listContainerNode = document.getElementById("listContainer");
        this.trashSwitchBtnNode = document.getElementById("trashSwitchBtn");
        this.trashContainerNode = document.getElementById("trashContainer");
        this.attachEventListeners();
    }

    clearActiveList = () => {
        return (this.listContainerNode.innerHTML = "");
    };

    clearTrashList = () => {
        return (this.trashContainerNode.innerHTML = "");
    };

    clearInputField = () => {
        return (this.newItemInputNode.value = "");
    };

    // Create a list item element for rendering
    createListItem(item) {
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

    // Create a trash-list item element for rendering
    createTrashItem(item) {
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

    renderActiveList = () => {
        this.clearActiveList();

        // Create list item and append list container
        actionItems.forEach((item) => {
            if (!item.hidden) {
                const listItem = this.createListItem(item);
                this.listContainerNode.appendChild(listItem);
            }
        });

        // Set event listeners for checkboxes and btns
        const checkboxes = document.querySelectorAll(".item-checkbox");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", (event) =>
                this.controller.handleCheckboxChange(event)
            );
        });

        const hideButtons = document.querySelectorAll(".item-hide-btn");
        hideButtons.forEach((button) => {
            button.addEventListener("click", (event) =>
                this.controller.handleHideButtonClick(event)
            );
        });
    };

    renderTrashList = () => {
        this.clearTrashList();

        // Create list item and append list container
        actionItems.forEach((item) => {
            if (item.hidden) {
                const trashItem = this.createTrashItem(item);
                this.trashContainerNode.appendChild(trashItem);
            }
        });

        if (this.trashContainerNode.innerHTML == "") {
            this.trashContainerNode.innerText = "No items in trash bin.";
        }

        const restoreButtons = document.querySelectorAll(".restore-btn");
        restoreButtons.forEach((button) => {
            button.addEventListener("click", (event) =>
                this.controller.handleRestoreButtonClick(event)
            );
        });

        const deleteButtons = document.querySelectorAll(".item-delete-btn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", (event) =>
                this.controller.handleDeleteButtonClick(event)
            );
        });
    };
    attachEventListeners() {
        this.newItemBtnNode.addEventListener("click", (event) =>
            this.controller.handleNewItemBtn(event)
        );
        this.trashSwitchBtnNode.addEventListener("click", (event) =>
            this.controller.handleTrashSwitchBtn(event)
        );
    }
}

// Initialize Firebase and Firestore Cloud
const appFirebase = initializeApp(firebaseKeys);
const db = getFirestore(appFirebase);

// Module Model
class Model {
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

// Module Controller
class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View(this);
    }

    initializeAppData = async () => {
        actionItems = await this.model.get(DB_NAME);
        this.view.renderActiveList();
    };

    getItemFromUser = () => {
        const newItemFromCustomer = {
            id: this.generateUniqueId(),
            text: this.view.newItemInputNode.value,
            completed: false,
            hidden: false,
            createdAt: serverTimestamp(),
        };
        return newItemFromCustomer;
    };

    addItem = (newActionItem) => {
        actionItems.push(newActionItem);
    };

    generateUniqueId() {
        return uuidv4();
    }

    // Event handler for checkbox change event
    handleCheckboxChange = (event) => {
        const checkbox = event.target;
        const itemId = checkbox.id.split("_")[1];

        // Find the item in the local array
        const item = actionItems.find((item) => item.id === itemId);

        if (item) {
            // Toggle the completed state
            item.completed = !item.completed;
            console.log(
                `Action item ${itemId} status updated: ${item.completed}`
            );

            this.model.updateItemInFirestore(itemId, {
                completed: item.completed,
            });
            console.log("Element updated in Firestore.");
        }
        this.view.renderActiveList();
    };

    // Event handler for hide button click event
    handleHideButtonClick = (event) => {
        const button = event.target;
        const itemId = button.id.split("_")[1];

        // Update hidden status for item with relevant id:
        const item = actionItems.find((item) => item.id === itemId);
        if (item) {
            item.hidden = true;
            console.log(
                `Action item ${itemId} hidden status updated: ${item.hidden}`
            );
            this.model.updateItemInFirestore(itemId, { hidden: true });
            console.log("Element updated in Firestore.");
        }
        this.view.renderActiveList();
        this.view.renderTrashList();
    };

    // Event handler for delete button click event
    handleDeleteButtonClick(event) {
        const button = event.target;
        const itemId = button.id.split("_")[1];
        console.log(`request to delete item with id: ${itemId}`);

        //  Confirm radiness to delete
        if (!confirm("Please confirm permanent deletion.")) {
            return;
        }

        // // Update hidden status for item with relevant id:
        // const item = actionItems.find((item) => item.id === itemId);

        try {
            // Delete from Firestore
            this.model.deleteItemFromFireStore(itemId);

            // If successful, delete from local array
            actionItems = actionItems.filter((item) => item.id !== itemId);
            console.log(
                `Document with ID: ${itemId} has been deleted from Firestore`
            );
        } catch (error) {
            console.error(`Error deleting document with ID: ${itemId}`, error);
        }
        this.view.renderTrashList();
    }

    handleRestoreButtonClick(event) {
        const button = event.target;
        const itemId = button.id.split("_")[1];

        // Update hidden status for item with relevant id:
        const item = actionItems.find((item) => item.id === itemId);
        if (item) {
            item.hidden = false;
            console.log(
                `Action item ${itemId} hidden status updated: ${item.hidden}`
            );
            this.model.updateItemInFirestore(itemId, { hidden: false });
            console.log("Element updated in Firestore.");
        }
        this.view.renderActiveList();
        this.view.renderTrashList();
    }

    handleNewItemBtn = () => {
        const itemFromUser = this.getItemFromUser();
        if (!itemFromUser.text) {
            alert("Please enter the field");
            return;
        }

        // add new item to items list
        this.addItem(itemFromUser);

        // update Firebase
        this.model.addItemToFirestore(itemFromUser);

        this.view.clearInputField();
        this.view.renderActiveList();
    };

    handleTrashSwitchBtn = () => {
        this.view.trashSwitchBtnNode.classList.toggle(TRASH_OPEN_CLASSNAME);
        const binOpen =
            this.view.trashSwitchBtnNode.className.includes(
                TRASH_OPEN_CLASSNAME
            );
        if (!binOpen) {
            this.view.clearTrashList();
        } else {
            this.view.renderTrashList();
        }
        console.log(this.view.trashSwitchBtnNode.className);
        return;
    };
}

// Module Index-Init
const app = new Controller();

try {
    // app.initializeAppMain();
    app.initializeAppData();
} catch (error) {
    console.error("An error occured during app initialization:", error);
    alert(
        "Something went wrong. Please contact the app admin or try again later."
    );
}
