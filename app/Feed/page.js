"use client";
import { useContext, useState, useEffect } from "react";
import FirebaseContext from "../hooks/context";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Feed() {
  const { user, firebase } = useContext(FirebaseContext) || {};

  const { auth, db } = firebase || {};

  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [messageLimit, setMessageLimit] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesRef = collection(db, "touits");
    let messageQuery;
    if (activeTab === "mesTouites") {
      messageQuery = query(
        messagesRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(messageLimit)
      );
    } else {
      messageQuery = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(messageLimit)
      );
    }

    const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
      //écouter les modifications dans la collection "users" et mettre à jour le state "messages" en temps réel.
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        // Parcours de chaque document dans le querySnapshot
        messagesData.push({ id: doc.id, ...doc.data() }); // Pour chaque document, crée un objet contenant l'ID et les données du document
      });
      setMessages(messagesData);
    });

    setLoading(false);

    return () => {
      unsubscribe();
    };
  }, [activeTab, messageLimit]);

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

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      setMessageLimit((prevLimit) => prevLimit + 10);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col h-screen items-center">
      <header className="text-center p-1 md:p-4 md:h-30 bg-white w-full md:text-2xl">
        <h1 className="italic text-blue-600 font-black position: absolute font-['Comic_Sans_Ms']">
          Touiteur
        </h1>
        <h2>{activeTab}</h2>
      </header>
      <div className="flex-grow flex flex-col md:flex-row">
        <aside className="pt-2 md:p-5 text-center flex flex-row md:flex-col">
          <div className="flex md:flex-col w-full md:h-full justify-center items-center gap-2">
            <div className='flex flex-col'>
              <img src={user?.photoURL ?? ""} alt={user?.displayName ?? ""} className='h-14 md:h-24 object-contain' />
              <h2 className="max-w-[110px] break-words">
              {user?.displayName ? user.displayName.split('(')[0].trim() : ""}
              </h2>
            </div>
            <button
              onClick={auth.logout}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 md:px-4 rounded h-min"
            >
              Log out
            </button>
          </div>
          <div className="flex md:flex-col w-full md:h-full justify-center items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("feed");
                setMessageLimit(10);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 md:px-4 rounded"
            >
              Feed
            </button>
            <button
              onClick={() => {
                setActiveTab("mesTouites");
                setMessageLimit(10);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 md:px-4 rounded"
            >
              Mes touites
            </button>
          </div>
        </aside>
        <section>
          <div id="touiteur" className="p-2 md:p-6">
            <form className='flex items-end'>
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
                placeholder="Texte du touite ici (Max 280 caractères)"
                className="w-full md:w-[400px] resize-y p-2"
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
            <ul
              className="overflow-y-auto max-h-[calc(100vh-230px)] md:w-[530px]"
              onScroll={handleScroll}
            >
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
                      {" - "}
                      {message.createdAt
                        ? message.createdAt.toDate().toString().substring(0, 15)
                        : ""}
                    </div>
                    {message.userId === user.uid && (
                      <button onClick={() => handleSuppr(message.id)}>
                        ❌
                      </button>
                    )}
                  </div>

                  <div className="max-w-full break-words">{message.text}</div>

                  <button
                    onClick={() => handleLike(message.id)}
                    className="p-1"
                  >
                    {message.likes.includes(user.uid) ? "❤️" : "🤍"}
                  </button>
                  {message.likes.length !== 0 && message.likes.length}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <footer className="bg-gray-800 text-white p-2 h-30 w-full text-center md:text-left">
        <>Esthétique de qualité relative</>
      </footer>
    </main>
  );
}
