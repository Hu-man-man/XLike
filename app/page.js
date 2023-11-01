'use client'

import useFirebase from "./hooks/useFirebase"
import  FirebaseContext  from "./hooks/context"
import { firebaseConfig } from "./firebaseConfig"

import Login from "./Login/page"
import Feed from "./Feed/page"

export default function Home() {

  const {user, firebase} = useFirebase(firebaseConfig);  //hook qui gère la connection

  return  (
    <FirebaseContext.Provider value={{ user, firebase }}> {/* contexte pour partager la connection avec tous les composants de l'app */}
      { (user ? <Feed /> : <Login />)}
    </FirebaseContext.Provider>
    )
}
