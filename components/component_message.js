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
import {View,Text ,Image,Dimensions, TouchableOpacity,Modal} from 'react-native';
import { GiftedChat, InputToolbar, Bubble, Time} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

GLOBAL = require('../global_userProfile');
GLOBAL = require('../global_nonduplicates');

export function component_message({route,navigation})
{
  const details = route.params;           //get usernumber and clicked number form previous screen
  
  const [messages,setMessages] = useState([]);    //messages will be stored in this
  const [aa,seta] = useState();         //smaller number will be stored here
  const [bb,setb] = useState();      //greater number will be stored here
  const [modalVisible, set_modalVisible] = useState(false);  //use to show image in large
  const [openImg,set_openImg] = useState();   //store which img to show in large
  
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
    var date = new Date(timestamp);
    
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
    
    var recentMessages_sender ={
      id:message[0]._id,
      text:message[0].text,
      createdAt:
        {
          second:date.getSeconds(),
          minute:date.getMinutes(),
          hour:date.getHours(),
          date:date.getDate(),
          month:date.getMonth()+1,
          year:date.getFullYear()
        },
      sender:message[0].user._id,
      receiverProfile:details['receiver'].userProfile
    };

    var recentMessages_receiver ={
      id:message[0]._id,
      text:message[0].text,
      createdAt:
        {
          second:date.getSeconds(),
          minute:date.getMinutes(),
          hour:date.getHours(),
          date:date.getDate(),
          month:date.getMonth()+1,
          year:date.getFullYear()
        },
      sender:message[0].user._id,
      receiverProfile:GLOBAL.userProfile
    };

    await firestore()
            .collection(details['sender'])
            .doc(details['receiver'].userNumber)
            .set(recentMessages_sender).then(()=>
            {
              console.log("Done");     //after sending print 'then' in console
            });
    await firestore()
            .collection(details['receiver'].userNumber)
            .doc(details['sender'])
            .set(recentMessages_receiver).then(()=>
            {
              console.log("Done");     //after sending print 'then' in console
            });
  }

  const function_openImg = (userProfile)=>
  {
    
    if(userProfile!='defaultProfile.png')
    {
      set_openImg(userProfile);
      set_modalVisible(!modalVisible);
    }
  }

  const function_customtInputToolbar = props => 
  {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopColor: "#3E4DC8",
          borderTopWidth: 2,
          padding:4,
          height:48,
        }}
        textInputStyle={{ color: 'black' }}
      />
    );
  }

  const function_renderBubble = (props) =>
  {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor:'#3E4DC8',
            color:'#000000'
          },
          right: {
            backgroundColor:'#ffffff',
            borderWidth:2,
            borderColor:'#3E4DC8',
            color:'#000000'
          }
        }}
        textStyle={{
          right:{
            color:'black',
            fontSize:16,
            fontFamily:'Montserrat-Medium'
          },
          left:{
            color:'white',
            fontSize:16,
            fontFamily:'Montserrat-Medium'
          }
        }}
      />
    )
  }

  const function_renderTime = (props) =>
  {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: "#A9A9A9"
          },
          left: {
            color: "#A9A9A9"
          }
        }}
      />
    );
  }

  return (
    <View style={{flex:1,backgroundColor:'#ffffff'}}>
    
    <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => 
          {
              set_modalVisible(!modalVisible);
          }}>

          <View style={{flex:1,justifyContent:'center',alignItems:'center',height:height,width:width,backgroundColor:'#000000'}}>
              <Image
                  source={{uri:openImg}}
                  style={{width:width,height:width}}
                  PlaceholderContent={<Image style={{width:44,height:44,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/>}
                />
          </View>
      </Modal>

    <View style={{height:56,justifyContent:'space-between',alignItems:'center',flexDirection:'row',paddingHorizontal:20,backgroundColor:'#3E4DC8'}}>
        
        <TouchableOpacity onPress={()=>function_openImg(details['receiver'].userProfile)} style={{}}>
          {
            details['receiver'].userProfile=="defaultProfile.png"?
            <View style={{width:40,height:40,borderRadius:44,justifyContent:'center',alignItems:'center'}}>
              <Image style={{width:40,height:40,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/>
            </View>
            :
            <Image
              source={{ uri: details['receiver'].userProfile }}
              style={{width:40,height:40,borderRadius:44}}
              PlaceholderContent={
                <View style={{backgroundColor:'#ffffff',width:40,height:40,borderRadius:44}}>
                  <Image style={{width:40,height:40,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/>
                </View>}
            />
          }
        </TouchableOpacity>
        
        <Text style={{color:'#ffffff',fontSize:22,fontFamily:'Montserrat-Regular'}}>{GLOBAL.nonduplicates[details['receiver'].userNumber]}</Text>
        
        <View style={{height:40,width:40}} />

    </View>
    
    <GiftedChat             
      messages={messages}    //messages usestate declared above
      onSend={message => sendtofirebase(message)}         //when clicked send button
      renderInputToolbar={props => function_customtInputToolbar(props)}
      renderBubble={props => function_renderBubble(props)}
      showAvatarForEveryMessage={true}
      renderAvatar={()=>null}
      renderTime={props=>function_renderTime(props)}
      user={{
        _id:details['sender'],    //my usernumber will be here...usernumber whose number is loggen in now...
      }}
    />
    </View>
  )
}