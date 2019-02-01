import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAmq1c54y4rEE58iz9RJUCQliofglSRCc8',
  authDomain: 'ninja-smoovies.firebaseapp.com',
  databaseURL: 'https://ninja-smoovies.firebaseio.com',
  projectId: 'ninja-smoovies',
  storageBucket: 'ninja-smoovies.appspot.com',
  messagingSenderId: '232513341828'
}
const firebaseApp = firebase.initializeApp(config)
//   firebaseApp.firestore().settings({timestampsInSnapshots: true});

//  export firebase
export default firebaseApp.firestore()
