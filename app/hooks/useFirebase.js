'use client';
import { useState, useEffect } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";

export default function useFirebase(config) {
  const GoogleProvider = new GoogleAuthProvider();
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null); //données user données par firebase
  const [db, setDb] = useState(null);   

  useEffect(() => {
    const app = initializeApp(config);
    setAuth(getAuth(app));  // Initialise authentification
    setDb(getFirestore(app)); // Initialise Firestore 

    if (auth) {
        const unsubscribe = auth.onAuthStateChanged(authUser => { //écoute 
            console.log(authUser)
            if (authUser) {
                setUser(authUser)
            } else {setUser(null)};
        }  
        );
        return () => unsubscribe();
    }
  }, [auth, db]);

  const login = async () => {
    await signInWithPopup(auth, GoogleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  }

  return {
    user,
    firebase: {
      auth: {
        login,
        logout
      },
      db
    }
  };
}
