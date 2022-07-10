import styled from "styled-components";
import { Avatar } from '@mui/material';
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from 'next/router';

export default function Chat({ id, users, }) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)));
	
	const enterChat = () => {
		router.push(`/chat/${id}`)
	}
	
	
	const recipientEmail = getRecipientEmail(users, user)
	const recipient = recipientSnapshot?.docs[0]?.data();
	return (
		<Container onClick={enterChat}>
			{recipient ? (
				<UserAvatar src={recipient?.photoUrl} />
			) : (
				<UserAvatar>{recipientEmail[0]} </UserAvatar>
					
			)}
		  <p>{recipientEmail} </p>
	 </Container>
  )
}

const Container = styled.div`
display: flex;
align-items: center;
cursor: pointer;
padding: 15px;
word-break: break-aword;
transition: background-color 0.2s ease-in-out;

:hover {
	background-color: #e9eaeb;
}
`;

const UserAvatar = styled(Avatar)`
	margin: 5px;
	margin-right: 15px;
`;