
import { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
//import { firebaseConfig } from "../firebaseConfig";

export default function useFirebase(config) {
  const GoogleProvider = new GoogleAuthProvider();
  const [auth, setAuth] = useState(null);

  const [user, setUser] = useState(null); //données user données par firebase

  useEffect(() => {
    const app = initializeApp(config);
    setAuth(getAuth(app));  //authentification

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
  }, [auth]);

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
      }
    }
  };
}
