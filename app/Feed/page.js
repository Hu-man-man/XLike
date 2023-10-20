import { useContext, useState, useEffect } from "react";
import FirebaseContext from "../hooks/context";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp} from "firebase/firestore";

export default function Feed() {
  const {
    user,
    firebase: { auth },
  } = useContext(FirebaseContext);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "touits");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(10)); // Récupérez les 10 derniers messages triés par date
    //TODO AFFICHE LES 10 DERNIERS MESSAGES PAS LES 10 PREMIERS

    const unsubscribe = onSnapshot(q, (querySnapshot) => { //écouter les modifications dans la collection "users" et mettre à jour le state "messages" en temps réel.
      const messagesData = [];
      querySnapshot.forEach((doc) => {  // Parcours de chaque document dans le querySnapshot
        messagesData.push({ id: doc.id, ...doc.data() }); // Pour chaque document, crée un objet contenant l'ID et les données du document
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  const sendMessage = async () => {
    try {
      const docRef = await addDoc(collection(db, "touits"), {
        text: formValue,
        createdAt: serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photo: user.photoURL,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setFormValue("");
  };

  return (
    <main>
      <div className="h-screen">
        <h1>FEEEEEEEEEEEEEEED</h1>
        <img src={user.photoURL} alt={user.displayName} />
        <h2>{user.displayName}</h2>
        <h3>{user.email}</h3>
        <button
          onClick={auth.logout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
        <form>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Texte du touite ici"
          />
          <button type="button"  onClick={sendMessage}>🐦</button>
        </form>
      <section>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <img
                src={message.photo} 
                alt={message.displayName}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              {message.displayName}
              <br/>
              {message.text}
            </li>
          ))}
        </ul>
      </section>
      </div>
      <section>
        <>site de qualité</>
      </section>
    </main>
  );
}
