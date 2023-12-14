'use client'

import useFirebase from "./hooks/useFirebase"
import  FirebaseContext  from "./hooks/context"
import { firebaseConfig } from "./firebaseConfig"

import Login from "./Login/page"
import Feed from "./Feed/page"

export default function Home() {
//   const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID
//   }

  const {user, firebase} = useFirebase(firebaseConfig);  //hook qui gère la connection

  return  (
    <FirebaseContext.Provider value={{ user, firebase }}> {/* contexte pour partager la connection avec tous les composants de l'app */}
      { (user ? <Feed /> : <Login />)}
    </FirebaseContext.Provider>
    )
}
