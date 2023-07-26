// Model Class
class ActionItemModel {
    constructor() {
        this.dbName = "actionItems";
        this.actionItems = [];
    }

    async initializeData() {
        this.actionItems = await this.get();
    }

    // ... Code to fetch data from Firestore
    async get() {
        const collectionRef = collection(db, this.dbName);
        const q = query(collectionRef, orderBy("createdAt", "desc"));

        const actionItemsDb = [];
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const itemDb = {
                id: doc.id,
                text: doc.data().text,
                completed: doc.data().completed,
                hidden: doc.data().hidden,
                createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to JavaScript Date object
            };
            actionItemsDb.push(itemDb);
            console.log(
                `Document "${doc.data().text}", id = "${doc.id}" has been read.`
            );
        });

        this.actionItems = actionItemsDb; // Update the local actionItems array with data from Firestore
        return actionItemsDb; // Return the action items fetched from Firestore
    }

    async addItem(item) {
        // ... Code to add an item to Firestore
    }

    async updateItem(itemId, updatedFields) {
        // ... Code to update an item in Firestore
    }

    async deleteItem(itemId) {
        // ... Code to delete an item from Firestore
    }
}

// View Class
class ActionItemView {
    constructor(controller) {
        this.controller = controller;
        this.newItemInputNode = document.getElementById("newItemInput");
        this.newItemBtnNode = document.getElementById("newItemBtn");
        this.listContainerNode = document.getElementById("listContainer");
        this.trashSwitchBtnNode = document.getElementById("trashSwitchBtn");
        this.trashContainerNode = document.getElementById("trashContainer");
        this.TRASH_OPEN_CLASSNAME = "trash-bin-open";

        this.newItemBtnNode.addEventListener("click", () =>
            this.handleNewItemBtn()
        );
        this.trashSwitchBtnNode.addEventListener("click", () =>
            this.handleTrashSwitchBtn()
        );
    }

    handleNewItemBtn() {
        const newItemFromCustomer = {
            text: this.newItemInputNode.value,
            completed: false,
            hidden: false,
            createdAt: serverTimestamp(),
        };

        this.controller.addItem(newItemFromCustomer);
        this.newItemInputNode.value = "";
    }

    handleTrashSwitchBtn() {
        this.trashSwitchBtnNode.classList.toggle(this.TRASH_OPEN_CLASSNAME);
        const binOpen = this.trashSwitchBtnNode.classList.contains(
            this.TRASH_OPEN_CLASSNAME
        );

        if (!binOpen) {
            this.clearTrashList();
        } else {
            this.renderTrashList();
        }
    }

    // ... Other view-related methods (rendering lists, handling button clicks, etc.)
}

// Controller Class
class ActionItemController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async initializeApp() {
        await this.model.initializeData();
        this.view.renderActiveList();
    }

    addItem(item) {
        this.model.addItem(item);
        this.view.renderActiveList();
    }

    updateItem(itemId, updatedFields) {
        this.model.updateItem(itemId, updatedFields);
    }

    deleteItem(itemId) {
        this.model.deleteItem(itemId);
    }

    // ... Other controller-related methods (handling user actions, updating model and view, etc.)
}

// Initialize the application
function initializeAppMain() {
    const model = new ActionItemModel();
    const view = new ActionItemView(new ActionItemController(model, view));
    controller.initializeApp();
}

initializeAppMain();
