# Action Items List Application

This application allows users to manage their action items with capabilities to add new items, mark them as completed, and move them to a recycle bin. All data is persisted using Google's Firebase.

## Technologies Used:

HTML
CSS
JavaScript
Parcel
Firebase

## Features:

Add New Action Items: Users can add new tasks or action items.
Mark as Completed: Action items can be marked as completed.
Recycle Bin: Completed or unwanted items can be moved to the recycle bin.
Persistent Data: All data is stored and retrieved from Firebase, ensuring that user data is always available across sessions.

## Setup and Installation:

### Clone the Repository:

git clone [repository_url]

### Navigate to the project directory:

cd [project_folder_name]

### Install Dependencies (assuming you have Node.js and npm installed):

npm install

### Run the Application (using Parcel or your preferred method):

parcel index.html

The application should now be running on http://localhost:1234/ or the respective port provided by your tool.

## Firebase Setup:

To connect with Firebase:

Create a new project in Firebase.
Navigate to Firestore and create a new collection named actionItems.
Under project settings, get your Firebase configuration object.
Replace the firebaseConfig object in index.js with your configuration.

## Contributing:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Ensure to update tests as appropriate.

## License:

MIT, https://choosealicense.com/licenses/mit/
