import { useContext } from "react";
import  FirebaseContext  from "../hooks/context"

export default function feed() {

  const {user, firebase : { auth } } = useContext(FirebaseContext)

  return (
    <main>
      <div className="h-screen">
        <h1>FEEEEEEEEEEEEEEED</h1>
        <img src={user.photoURL} alt={user.displayName}/>
        <h2>{user.displayName}</h2>
        <h3>{user.email}</h3>
        <button
            onClick={auth.logout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log out
          </button>
      </div>
    </main>
  );
}
