"use client"
import { useContext } from "react";
import  FirebaseContext  from "../hooks/context"

export default function login() {
    const { firebase : { auth } } = useContext(FirebaseContext);

    return (
      <main>
        <div className="flex items-center justify-center flex-col h-screen">
          <h1 className="italic text-blue-600 font-black text-2xl font-['Comic_Sans_Ms']">Touiteur</h1>
          <br />
          <button
            onClick={auth.login}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </button>
        </div>
      </main>
    );
  }