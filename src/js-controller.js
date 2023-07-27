import { serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { DB_NAME, TRASH_OPEN_CLASSNAME } from "./js-constants.js";
import { storeInstance } from "./js-constants.js";
import { View } from "./js-view.js";
import { Model } from "./js-model.js";

export class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View(this);
    }

    initializeAppData = async () => {
        storeInstance.actionItems = await this.model.get(DB_NAME);
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
        storeInstance.actionItems.push(newActionItem);
    };

    generateUniqueId() {
        return uuidv4();
    }

    // Event handler for checkbox change event
    handleCheckboxChange = (event) => {
        const checkbox = event.target;
        const itemId = checkbox.id.split("_")[1];

        // Find the item in the local array
        const item = storeInstance.actionItems.find(
            (item) => item.id === itemId
        );

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
        const item = storeInstance.actionItems.find(
            (item) => item.id === itemId
        );
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
        // const item = storeInstance.actionItems.find((item) => item.id === itemId);

        try {
            // Delete from Firestore
            this.model.deleteItemFromFireStore(itemId);

            // If successful, delete from local array
            storeInstance.actionItems = storeInstance.actionItems.filter(
                (item) => item.id !== itemId
            );
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
        const item = storeInstance.actionItems.find(
            (item) => item.id === itemId
        );
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
