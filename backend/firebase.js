const firebaseConfig = {
  apiKey: "AIzaSyDVvKmrS2qS-S5KpdvV6xQzz6Z_9v5FnvI",
  authDomain: "women-safety-app-e262b.firebaseapp.com",
  databaseURL: "https://women-safety-app-e262b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "women-safety-app-e262b",
  storageBucket: "women-safety-app-e262b.firebasestorage.app",
  messagingSenderId: "388759907776",
  appId: "1:388759907776:web:1e352c74efb0ce54ee2c25",
  measurementId: "G-J5NVXNGTH4"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

window.auth = auth;
window.database = db;