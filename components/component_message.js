/*
we will use gifted chat here to display messages.
useeffect in background will use sender and reciever numbers to form chatId .
There will be a collection called Messages in firestore,
smaller phone number will be a document inside collection,
greater phone number will be a collection inside the smaller phone number document,
then inside this collection there will be auto id generated docs where each docs will have 
3 fields - createdAt,text and user.

*/
import React,{useState,useEffect} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

export function component_message({route,navigation})
{
  const details = route.params;           //get usernumber and clicked number form previous screen
  
  const [messages,setMessages] = useState([]);    //messages will be stored in this
  const [aa,seta] = useState();         //smaller number will be stored here
  const [bb,setb] = useState();      //greater number will be stored here
  var a,b;   //temporary variables 
  
  useEffect(()=>          //will do some tast after rendering screen 
  {
    if(details['sender']<details['receiver'].userNumber)
    {           //checking which number is smaller
      a=details['sender'];
      b=details['receiver'].userNumber;          //setting them in variable acccordingly
      seta(a);            //setting them in usestate
      setb(b);
    }
    else
    {                                  
      b=details['sender'];
      a=details['receiver'].userNumber;
      seta(a);  //setting them accordinglt smaller and larger number
      setb(b);
    }
    console.log('a '+a);
    console.log('b '+b);
    async function setchatid()  //after screen renders this function will be called once to get all previous messages if any from firestore
    {
      var snapshot = await firestore()
                            .collection('Messages')
                            .doc(a)
                            .collection(b)
                            .orderBy('createdAt','desc')
                            .limit(20)
                            .get();               //snapshot will have previous messages of 'a' and 'b' sorted by createdAt and limited to 20
      
      var prevmessg=[];   //temp variable holding previous messages
      snapshot.forEach(    //looop for each index in snapshot
        doc =>
        {
          prevmessg.push(
            {    //forming object as required by giftchat for diplaying messages
              _id:doc.data().createdAt,           
              text:doc.data().text,
              createdAt:doc.data().createdAt,
              user:{
                _id:doc.data().user,
                name:'Pri',  //hardcoded will change later by details['receiver'].userName
                avatar: 'https://placeimg.com/140/140/any',   //hardcoded will change later
              }
            }
          );
        }
      );
      
      console.log(prevmessg);
      setMessages(prevmessg);   //setting previous messages in usestate
    }

    setchatid();   //calling above function
    
    const firestoreRef = firestore()
                          .collection('Messages')
                          .doc(a)
                          .collection(b)
                          .orderBy('createdAt','desc');      //setting reference to the position where we want to store messages if send
    
    const unsubscribe = firestoreRef.onSnapshot(querySnapshot => {    //this onsnapshot will listen to changes made in the refered doc above .. this will help us to update screen if second person send some message
      var prevmessg=[];   //temp variable
      querySnapshot.docs.map(documentSnapshot => {
        prevmessg.push(                      //making object according to giftedchat
          {
            _id:documentSnapshot.data().createdAt,
            text:documentSnapshot.data().text,
            createdAt:documentSnapshot.data().createdAt,
            user:{
              _id:documentSnapshot.data().user,
              name: 'fds',
              avatar:'https://placeimg.com/140/140/any',
            }
          }
        );
      });
      console.log("updated");
      setMessages(prevmessg);
    });
    return ()=>unsubscribe();   //unsubscribing the onsnapshot function 
                
  },[]);

  const sendtofirebase=async(message)=>          //when user type and click send button this function is called
  {
    console.log(message);
    console.log(typeof message);
    console.log(message[0]);
    console.log(typeof message[0]);
    var timestamp = new Date().getTime();   ///get current time 
    
    await firestore()
            .collection('Messages')
            .doc(aa)
            .collection(bb)
            .add(
              {
                text:message[0].text,
                user:message[0].user._id,
                createdAt:timestamp            //adding message to the location with the text,sender number and createdAt fields
              }
            ).then(()=>
              {
                console.log("Done");     //after sending print 'then' in console
              });
    
    await firestore()
            .collection(details['sender'])
            .doc(details['receiver'].userNumber)
            .set(message[0]).then(()=>
            {
              console.log("Done");     //after sending print 'then' in console
            });
    await firestore()
            .collection(details['receiver'].userNumber)
            .doc(details['sender'])
            .set(message[0]).then(()=>
            {
              console.log("Done");     //after sending print 'then' in console
            });
  }

  return (
    <GiftedChat             
      messages={messages}    //messages usestate declared above
      onSend={message => sendtofirebase(message)}         //when clicked send button
      user={{
        _id:details['sender'],    //my usernumber will be here...usernumber whose number is loggen in now...
      }}
    />
  )
}