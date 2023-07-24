
const firebaseConfig = {
    apiKey: "AIzaSyBf5QBUUQ3EZGXw-pEKsBAo4J2ssdNCOv4",
    authDomain: "action-items-firebase.firebaseapp.com",
    projectId: "action-items-firebase",
    storageBucket: "action-items-firebase.appspot.com",
    messagingSenderId: "453868384210",
    appId: "1:453868384210:web:b2d8bd1b94e38bd8f9a20b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class Model {
    constructor(db) {
        this.db = db;
    }

    async get(COLLECTION_NAME) {
        const ref = collection(this.db, COLLECTION_NAME);
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
        });
        return actionItemsDb;
    }

    // ... other Firebase interaction methods (add, update, delete) will go here ...
}

    addItemToFirestore(item) {
        // ... existing code to add item to Firestore ...
    }
    
    updateItemInFirestore(item) {
        // ... existing code to update item in Firestore ...
    }
    
    deleteItemFromFirestore(itemId) {
        // ... existing code to delete item from Firestore ...
    }
    
    // ... any other methods related to data manipulation and Firebase operations ...
}

class View {
    constructor() {
        this.newItemInputNode = document.getElementById("newItemInput");
        this.newItemBtnNode = document.getElementById("newItemBtn");
        this.listContainerNode = document.getElementById("listContainer");
        this.trashSwitchNode = document.getElementById("trashSwitch");
        this.trashContainerNode = document.getElementById("trashContainer");
    }

    renderActiveList(actionItems) {
        // ... existing rendering code using actionItems ...
    }

    // ... other DOM interaction methods will go here ...
}

    renderTrashList(actionItems) {
        // ... existing rendering code using actionItems ...
    }
    
    clearInputField() {
        // ... existing code to clear input field ...
    }
    
    // ... other methods related to DOM interactions and UI rendering ...
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.actionItems = [];
    }

    async initializeAppData() {
        this.actionItems = await this.model.get(DB_NAME);
        this.view.renderActiveList(this.actionItems);
    }

    // ... other methods that manage the flow between Model and View will go here ...
}

    handleNewItemButtonClick() {
        // Logic to handle when a new item is added.
        // This should involve getting data from the view, updating the model, and then updating the view.
    }
    
    handleCheckboxChange() {
        // Logic to handle checkbox changes (marking items as complete/incomplete).
    }
    
    // ... other event handling methods and logic to manage the flow between Model and View ...
    
    attachEventListeners() {
        // Attach event listeners to DOM elements.
        // For instance:
        // this.view.newItemBtnNode.addEventListener('click', this.handleNewItemButtonClick.bind(this));
    }

    start() {
        this.initializeAppData();
        this.attachEventListeners();
    }
}

// Create instances of Model, View, and Controller
const model = new Model(db);
const view = new View();
const controller = new Controller(model, view);

// Start the application
controller.start();
