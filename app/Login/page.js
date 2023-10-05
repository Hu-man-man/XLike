import { useContext } from "react";
import  FirebaseContext  from "../hooks/context"

export default function login() {
    const { firebase : { auth } } = useContext(FirebaseContext);
    return (
      <main>
        <div className="flex items-center justify-center h-screen">
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