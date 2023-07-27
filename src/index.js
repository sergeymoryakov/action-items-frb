import { Controller } from "./js-controller.js";

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
