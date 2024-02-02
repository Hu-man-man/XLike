"use client";

import { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const GoogleProvider = new GoogleAuthProvider();

export default function useFirebase(config) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    console.log("Initializing Firebase...");
    const app = initializeApp(config);
    const authInstance = getAuth(app);
    console.log("Auth instance:", authInstance);
    setAuth(authInstance);
    setDb(getFirestore(app));

    // Utilisation d'une promesse pour attendre que l'authentification soit initialisée
    const authPromise = new Promise(resolve => {
      const unsubscribe = authInstance.onAuthStateChanged(user => {
        if (user) {
          setUser(user);
        }
        resolve();
      });
      return unsubscribe;
    });

    // Mettre à jour l'état firebaseInitialized une fois que Firebase est initialisé
    authPromise.then(() => {
      setFirebaseInitialized(true);
    });

    return () => {
      setAuth(null); // Nettoyez l'objet auth lors du démontage
    };
  }, [config]);

  // Effectuez d'autres actions en fonction de l'état de l'authentification
  useEffect(() => {
    console.log("Auth object:", auth);
    if (auth) {
      // Mettez à jour les méthodes d'authentification
      auth.login = async () => {
        console.log("Attempting login...");
        try {
          const result = await signInWithPopup(auth, GoogleProvider);
          console.log("Connecté avec succès !");
          return result.user;
        } catch (error) {
          console.error("Erreur lors de la connexion :", error);
          throw error;
        }
      };

      auth.logout = async () => {
        console.log("Attempting logout...");
        try {
          await signOut(auth);
          console.log("Déconnecté avec succès !");
        } catch (error) {
          console.error("Erreur lors de la déconnexion :", error);
          throw error;
        }
      };
    }
  }, [auth]);

  return {
    user,
    firebase: {
      auth,
      db,
      firebaseInitialized,
    }
  };
}
