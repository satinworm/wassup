import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { useRef, useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { storage, app } from "../firebase";

export default function ChatScreen({ chat, messages }) {
   const [user] = useAuthState(auth);
   const [input, setInput] = useState("");
   const [imageToMessage, setImageToMessage] = useState(null);
   const router = useRouter();
   const endOfMessagesRef = useRef(null);
   const filepickerRef = useRef(null);
   const [messagesSnapshot] = useCollection(
      db
         .collection("chats")
         .doc(router.query.id)
         .collection("messages")
         .orderBy("timestamp", "asc")
   );

   const [recipientSnapshot] = useCollection(
      db
         .collection("users")
         .where("email", "==", getRecipientEmail(chat.users, user))
   );

   const showMessages = () => {
      if (messagesSnapshot) {
         return messagesSnapshot.docs.map((message) => (
            <Message
               key={message.id}
               user={message.data().user}
               message={{
                  ...message.data(),
                  timestamp: message.data().timestamp?.toDate().getTime(),
               }}
            />
         ));
      } else {
         return JSON.parse(messages).map((message) => (
            <Message key={message.id} user={message.user} message={message} />
         ));
      }
   };
   const scrollToBottom = () => {
      endOfMessagesRef.current.scrollIntoView({
         behavior: "smooth",
         block: "start",
      });
   };

   const sendMessage = (e) => {
      e.preventDefault();

      db.collection("users").doc(user.uid).set(
         {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
         },
         { merge: true }
      );
      db.collection("chats")
         .doc(router.query.id)
         .collection("messages")
         .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoUrl: user.photoURL,
         })
         .then((doc) => {
            if (imageToMessage) {
               // 1st attempt to upload image
               // db.collection("chats").doc(router.query.id).collection("messages").doc(doc.id).update({
               //    image: imageToMessage,
               // });
               // removeImage();
               const uploadTask = storage
                  .ref(`chats/${router.query.id}/${doc.id}`)
                  .putString(imageToMessage, "data_url");
               removeImage();

               uploadTask.on(
                  "state_change",
                  null,
                  error => console.log(error),
                  () => {
                     storage
                        .ref(`chats/${router.query.id}/${doc.id}`)
                        .getDownloadURL()
                        .then(url => {
                           db.collection("chats")
                              .doc(router.query.id)
                              .collection("messages")
                              .doc(doc.id)
                              .update({
                                 image: url,
                              });
                        }).catch(error => console.log(error));
                  }
                  //  () => {
                     // storage
                     //    .ref('chats')
                     //    .child(router.query.id)
                     //    .getDownloadURL()
                     //    .then((url) => {
                     //       db.collection("chats").doc(router.query.id).set(
                     //          {
                     //             image: url,
                     //          },
                     //          { merge: true }
                     //       );
                     //    })
                  //
               )
            }
         });

      setInput("");
      scrollToBottom();
   };

   const recipient = recipientSnapshot?.docs?.[0]?.data();
   const recipientEmail = getRecipientEmail(chat.users, user);

   const addImageToMessage = (e) => {
      const reader = new FileReader();
      if (e.target.files[0]) {
         reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent) => {
         setImageToMessage(readerEvent.target.result);
      };
   };

   const removeImage = () => {
      setImageToMessage(null);
   };

   return (
      <Container>
         <Header>
            {recipient ? (
               <Avatar src={recipient?.photoUrl} />
            ) : (
               <Avatar>{recipientEmail[0]} </Avatar>
            )}
            <HeaderInformation>
               <h3>{recipientEmail}</h3>
               {recipientSnapshot ? (
                  <p>
                     Last active:{" "}
                     {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                     ) : (
                        
                        "Unvailable"
                     )}
                  </p>
               ) : (
                  <p>Loading Last active</p>
               )}
            </HeaderInformation>
            <HeaderIcons>
               <IconButton>
                  <MoreVertIcon />
               </IconButton>
            </HeaderIcons>
         </Header>

         <MessageContainer>
            {showMessages()}
            <EndOfMessage ref={endOfMessagesRef} />
         </MessageContainer>

         <InputContainer>
            <InsertEmoticonIcon />
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            {imageToMessage && (
               <ImageToMessage onClick={removeImage}>
                  <img src={imageToMessage} />
               </ImageToMessage>
            )}
            <button
               hidden
               disabled={!input}
               type="submit"
               onClick={sendMessage}
            >
               Send Message
            </button>
            <IconButton onClick={() => filepickerRef.current.click()}>
               <AttachFileIcon />
               <input
                  ref={filepickerRef}
                  type="file"
                  hidden
                  onChange={addImageToMessage}
               />
            </IconButton>
            <IconButton>
               <MicIcon />
            </IconButton>
            <IconButton>
               {input  !== "" ? (
                  <SendIcon
                     disabled={!input}
                     hidden
                     type="submit"
                     onClick={sendMessage}
                  />
               ) : null}
            </IconButton>
         </InputContainer>
      </Container>
   );
}

const Container = styled.div``;
const Input = styled.input`
   flex: 1;
   outline: 0;
   border: none;
   border-radius: 10px;
   background-color: whitesmoke;
   padding: 20px;
   margin-left: 15px;
   margin-right: 15px;
`;
const ImageToMessage = styled.div`
   height: 2.5rem;
   width: 2.5rem;
   > img {
      cursor: pointer;
      border-radius: 50px;
      width: 100%;
      height: 100%;
      :hover {
         opacity: 0.7;
      }
   }
`;
const InputContainer = styled.form`
   display: flex;
   align-items: center;
   padding: 10px;
   position: sticky;
   bottom: 0;
   background-color: white;
   z-index: 100;
`;
const MessageContainer = styled.div`
   padding: 30px;
   background-color: #e5ded8;
   min-height: 90vh;
`;

const EndOfMessage = styled.div`
   margin-bottom: 50px;
`;

const Header = styled.div`
   position: sticky;
   background-color: white;
   z-index: 100;
   top: 0;
   display: flex;
   padding: 11px;
   height: 80px;
   align-items: center;
   border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
   margin-left: 15px;
   flex: 1;

   > h3 {
      margin-bottom: 3px;
   }

   > p {
      font-size: 14px;
      color: gray;
   }
`;

const HeaderIcons = styled.div``;
