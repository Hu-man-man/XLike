"use client";

import { useContext, useState } from "react";
import FirebaseContext from "../hooks/context";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { firebase } = useContext(FirebaseContext) || {};
  const { auth } = firebase || {};

  const handleLogin = async () => {
    if (!auth) {
      console.error("Authentification non disponible");
      return;
    }

    setLoading(true);

    try {
      await auth.login(); // Utilisez la méthode login de l'objet auth
      console.log("Connecté avec succès !");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex items-center justify-center flex-col h-screen">
        <h1 className="italic text-blue-600 font-black text-2xl font-['Comic_Sans_Ms']">
          Touiteur
        </h1>
        <br />
        <button
          onClick={handleLogin}
          disabled={loading || !auth}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Chargement..." : "Se connecter avec Google"}
        </button>
      </div>
    </main>
  );
}
