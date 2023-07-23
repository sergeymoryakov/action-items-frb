# Action Items List Application

This application allows users to manage their action items with capabilities to add new items, mark them as completed, and move them to a recycle bin. All data is persisted using Google's Firebase.

## Technologies Used:

<ul>
<li>HTML</li>
<li>CSS</li>
<li>JavaScript</li>
<li>Parcel</li>
<li>Firebase</li>
</ul>

## Features:

<ul>
<li>Add New Action Items: Users can add new tasks or action items.</li>
<li>Mark as Completed: Action items can be marked as completed.</li>
<li>Recycle Bin: Completed or unwanted items can be moved to the recycle bin.</li>
<li>Persistent Data: All data is stored and retrieved from Firebase, ensuring that user data is always available across sessions.</li>
</ul>

## Setup and Installation:

### Clone the Repository:

<code>git clone [repository_url]</code>

### Navigate to the project directory:

<code>cd [project_folder_name]</code>

### Install Dependencies (assuming you have Node.js and npm installed):

<code>npm install</code>

### Run the Application (using Parcel or your preferred method):

<code>parcel index.html</code>

The application should now be running on <code>http://localhost:1234/</code> or the respective port provided by your tool.

## Firebase Setup:

To connect with Firebase:

<ul>
<li>Create a new project in Firebase.</li>
<li>Navigate to Firestore and create a new collection named actionItems.</li>
<li>Under project settings, get your Firebase configuration object.</li>
<li>Replace the firebaseConfig object in index.js with your configuration.</li>
</UL>

## Contributing:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Ensure to update tests as appropriate.

## License:

[MIT](https://choosealicense.com/licenses/mit)
[MIT](https://choosealicense.com/licenses/mit/)
