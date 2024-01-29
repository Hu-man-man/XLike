"use client";
import { useContext, useState } from "react";
import FirebaseContext from "../hooks/context";

export default function Login() {

  const [loading, setLoading] = useState(true);

  const { firebase } = useContext(FirebaseContext) || {};
  const { auth } = firebase || {};

  const handleLogin = async () => {
    if (!auth || !auth.login) {
        console.error("Authentification non disponible");
        return;
    }

    setLoading(true); // Mettre à jour l'état de chargement pour indiquer le chargement en cours

    try {
        await auth.login();
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
    } finally {
        setLoading(false); // Mettre à jour l'état de chargement une fois que la connexion est terminée (réussie ou non)
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
