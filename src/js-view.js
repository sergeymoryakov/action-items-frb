import { storeInstance } from "./js-constants.js";

export class View {
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
        storeInstance.actionItems.forEach((item) => {
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
        storeInstance.actionItems.forEach((item) => {
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
