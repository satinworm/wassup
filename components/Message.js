import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment";
import Image from 'next/image';

export default function Message({ user, message }) {
   const [userLoggedIn] = useAuthState(auth);

   const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

   return (
      <Container>
         <TypeOfMessage>
            {message.message}
            {message.image && (
               <ImageContainer>

                  <img src={message.image} className="image" alt="message" />
                  {/* <Image src={message.image} height={600} width={600} layout="fill" /> */}

               </ImageContainer>
            )}
            <Timestamp>
               {message.timestamp
                  ? moment(message.timestamp).format("LT")
                  : "..."}
            </Timestamp>
         </TypeOfMessage>
      </Container>
   );
}

const Container = styled.div`
`;
const ImageContainer = styled.div`
   width: 200px;
   height: 300px;
   > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
   }
`
const MessageElement = styled.p`
   width: fit-content;
   padding: 15px;
   border-radius: 8px;
   margin: 10px;
   min-width: 60px;
   padding-bottom: 26px;
   position: relative;
   text-align: right;
`;
const Sender = styled(MessageElement)`
   margin-left: auto;
   background-color: #87cefa;
`;
const Reciever = styled(MessageElement)`
   background-color: whitesmoke;
   text-align: left;
`;
const Timestamp = styled.span`
   color: gray;
   padding: 10px;
   font-size: 9px;
   position: absolute;
   bottom: 0;
   text-align: right;
   right: 0;
`;
