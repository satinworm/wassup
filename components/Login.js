import styled from "styled-components";
import Head from "next/head";
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";

export default function Login() {
   const signIn = () => {
      auth.signInWithPopup(provider).catch(alert)
   }
   
   return (
      <Container>
         <Head>
            <title>Login</title>
         </Head>

         <LoginContainer>
            <Logo src="https://freesvg.org/img/1534129544.png" />
            <Button style={{border: "none", borderBottom: "1px solid black", borderColor: "black", color: "black"}} onClick={signIn} variant="outlined">Sign in with Google</Button>
         </LoginContainer>
      </Container>
   );
}
const Container = styled.div`
   display: grid;
   place-items: center;
   height: 100vh;
   background-color: whitesmoke;
`;

const LoginContainer = styled.div`
   display: flex;
   padding: 100px;
   flex-direction: column;
   align-items: center;
   background-color: white;
   border-radius: 5px;
   box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
   transition: .2s all ease;
   :hover {
      border: 1.5px solid black;
   }
`;

const Logo = styled.img`
   height: 200px;
   width: 200px;
   margin-bottom: 50px;
`;
