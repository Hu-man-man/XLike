// "use client";
// import { useContext, useState } from "react";
// import FirebaseContext from "../hooks/context";

// export default function Login() {

//   const [loading, setLoading] = useState(true);

//   const { firebase } = useContext(FirebaseContext) || {};
//   const { auth } = firebase || {};

//   const handleLogin = async () => {
//     if (!auth || !auth.login) {
//         console.error("Authentification non disponible");
//         return;
//     }

//     setLoading(true); 

//     try {
//         await auth.login();
//     } catch (error) {
//         console.error("Erreur lors de la connexion :", error);
//     } finally {
//         setLoading(false);
//     }
// };

//   return (
//     <main>
//       <div className="flex items-center justify-center flex-col h-screen">
//         <h1 className="italic text-blue-600 font-black text-2xl font-['Comic_Sans_Ms']">
//           Touiteur
//         </h1>
//         <br />
//         <button
//           onClick={handleLogin}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Log In
//         </button>
//       </div>
//     </main>
//   );
// }

// Login/page.js
import { useContext, useState } from "react";
import FirebaseContext from "../hooks/context";

export default function Login() {
  const { firebase } = useContext(FirebaseContext) || {};
  const { auth } = firebase || {};

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (auth && auth.login) {
        await auth.login();
      } else {
        console.error("Authentification non disponible");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex items-center justify-center flex-col h-screen">
        <h1 className="italic text-blue-600 font-black text-2xl font-['Comic_Sans_Ms']">Touiteur</h1>
        <br />
        <button
          onClick={handleLogin}
          disabled={loading} // Désactive le bouton pendant le chargement
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Chargement...' : 'Log In'}
        </button>
      </div>
    </main>
  );
}
