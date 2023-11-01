"use client";

import { useContext, useState, useEffect } from "react";
import FirebaseContext from "../hooks/context";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Feed() {
  const {
    user,
    firebase: { auth, db },
  } = useContext(FirebaseContext);

  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "touits");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(10)); // Récupérez les 10 derniers messages triés par date

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      //écouter les modifications dans la collection "users" et mettre à jour le state "messages" en temps réel.
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        // Parcours de chaque document dans le querySnapshot
        messagesData.push({ id: doc.id, ...doc.data() }); // Pour chaque document, crée un objet contenant l'ID et les données du document
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async () => {
    try {
      const docRef = await addDoc(collection(db, "touits"), {
        text: formValue,
        createdAt: serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photo: user.photoURL,
        likes: [],
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setFormValue("");
  };

  const handleLike = (messageId) => {
    const messageRef = doc(collection(db, "touits"), messageId);

    const updatedMessages = [...messages]; // Créez une copie du tableau des messages

    const messageIndex = updatedMessages.findIndex(
      (message) => message.id === messageId
    );

    if (messageIndex !== -1) {
      const likedMessage = updatedMessages[messageIndex];
      const userLiked = likedMessage.likes.includes(user.uid);

      if (userLiked) {
        // Si l'utilisateur a déjà aimé, retirez son ID du tableau des likes
        likedMessage.likes = likedMessage.likes.filter(
          (userId) => userId !== user.uid
        );
        updateDoc(messageRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        // Sinon, ajoutez son ID au tableau des likes
        likedMessage.likes.push(user.uid);
        updateDoc(messageRef, {
          likes: arrayUnion(user.uid),
        });
      }

      // Mettez à jour le tableau de messages avec le message modifié
      updatedMessages[messageIndex] = likedMessage;

      // Mettez à jour l'état avec le nouveau tableau de messages
      setMessages(updatedMessages);
    }

    console.log(updatedMessages[messageIndex]);
  };

  const handleSuppr = (messageId) => {
    const updatedMessages = [...messages];
    const updatedMessagesFiltered = updatedMessages.filter(
      (element) => element.id !== messageId
    );
    setMessages(updatedMessagesFiltered);
    console.log(updatedMessagesFiltered);
    deleteDoc(doc(collection(db, "touits"), messageId));
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="text-center p-5 h-30">
        <h1>FEED</h1>
      </header>
      <div className="flex-grow flex flex-row">
        <aside className="w-50 p-5">
          <img src={user.photoURL} alt={user.displayName} />
          <h2>{user.displayName}</h2>
          <button
            onClick={auth.logout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log out
          </button>
        </aside>
        <section>
          <div id="touiteur" className="p-7">
            <form>
              <textarea
                id="nom_unique"
                name="nom_unique"
                value={formValue}
                onChange={(e) => {
                  if (e.target.value.length < 280) {
                    setFormValue(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Texte du touite ici (Maximum 280 caractères)"
                className="w-[400px] resize-y"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="m-1 text-2xl"
              >
                🐦
              </button>
            </form>
          </div>
          <div>
            <ul className="overflow-y-auto max-h-[calc(100vh-209px)] w-[500px]">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="m-1 p-1 rounded"
                  style={{ border: "1px solid black" }}
                >
                  <div className="flex justify-between">
                    <div className="flex">
                      <img
                        src={message.photo}
                        alt={message.displayName}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      {message.displayName}
                    </div>
                    {message.userId === user.uid && (
                      <button onClick={() => handleSuppr(message.id)}>
                        ❌
                      </button>
                    )}
                  </div>
                  <br />
                  <div className="max-w-full break-words">{message.text}</div>
                  <br />
                  <button onClick={() => handleLike(message.id)}>
                    {message.likes.includes(user.uid) ? "❤️" : "🤍"}
                  </button>
                  {message.likes.length !== 0 && message.likes.length}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <footer className="bg-gray-800 text-white p-5 h-30 w-full">
        <>site de qualité</>
      </footer>
    </main>
  );
}
