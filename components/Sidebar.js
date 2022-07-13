import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from './Chat';

export default function Sidebar() {
   
   const [user] = useAuthState(auth);
   const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
   const [chatsSnapshot] = useCollection(userChatRef);

   const createChat = () => {
      const input = prompt("Please enter an email address for the user you wish to chat");
      console.log("loh");
      if (!input) return null;

      if (EmailValidator.validate(input) && !chatAlreadyExist(input) && input !== user.email) {
         // добавляю чат в дб
         db.collection("chats").add({
            users: [user.email, input],
         });
      }
   };

   const chatAlreadyExist = (recipientEmail) =>
      !!chatsSnapshot?.docs.find(
         (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
      );

   
   return (
      <Container>
         <Header>
            <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

            <IconsContainer>
               <IconButton>
                  <ChatIcon />
               </IconButton>
               <IconButton>
                  <MoreVertIcon />
               </IconButton>
            </IconsContainer>
         </Header>

         <Search>
            <SearchIcon />
            <SearchInput placeholder="Search in chats" />
         </Search>
         <SidebarButton style={{color: "black"}} onClick={createChat}>Start a new chat</SidebarButton>
         {/* List of chats */}
         {chatsSnapshot?.docs.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
         ))}
      </Container>
   );
}

const Container = styled.div`
   flex: 0.45;
   border-right: 1px solid whitesmoke;
   height: 100vh;
   min-width: 100px;
   max-width: 350px;
   overflow-y: scroll;
   @media (max-width: 425px) {
      min-width: 0px;
      max-width: 76px;
   }
   ::-webkit-scrollbar {
      display: none;
   }

   -ms-overflow-style: none;
   scrollbar-width: none;
`;
const Header = styled.div`
   display: flex;
   position: sticky;
   top: 0;
   border-color: white;
   z-index: 1;
   justify-content: space-between;
   align-items: center;
   padding: 15px;
   height: 80px;
   border-bottom: 1px solid whitesmoke;
`;
const Search = styled.div`
   display: flex;
   align-items: center;
   padding: 20px;
   border-radius: 2px;
`;
const SidebarButton = styled(Button)`
   width: 100%;
   color: black;
   &&& {
      border-top: 1px solid whitesmoke;
      border-bottom: 1px solid whitesmoke;
   }
`;

const SearchInput = styled.input`
   outline-width: 0;
   border: none;
   flex: 1;
`;
const UserAvatar = styled(Avatar)`
   cursor: pointer;
   :hover {
      opacity: 0.8;
   }
`;
const IconsContainer = styled.div``;
