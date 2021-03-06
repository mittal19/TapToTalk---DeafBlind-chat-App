//HERE RECENT CHATS ARE SHOWN

import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,ActivityIndicator,ScrollView,Image,Dimensions,Modal,Pressable} from 'react-native';
import {AuthContext} from '../helpers/context';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const {width, height} = Dimensions.get('window');

GLOBAL = require('../global_userNumber');  //getting global var  /// this stores userNumber
GLOBAL = require('../global_nonduplicates');   //this stores non duplicates

const debug = true;

export function component_home({navigation})
{
  debug && console.log("-----");
  debug && console.log("component_home.js"); 
  
  const {logOut} = React.useContext(AuthContext);          //accessing auth context function logOut created at App.js file

  const [recentMessages,set_recentMessages] = React.useState([]);         //recent message 
  const [activityIndicator,set_activityIndicator] = React.useState(true);   // this usestate will decide whether to show activity indicator or not.
  const [modalVisible, set_modalVisible] = useState(false);    
  const [alertVisible, set_alertVisible] = useState(false);

  const function_checkcontacts = async()=>     //this function will be called when userr click on contacts
  {       
    debug && console.log("component_home.js - check contacts button clicked");
    
    set_modalVisible(true);   //showing modal  // i am showing modal because there was a delay between contacts buton click  and screen showing becaus of asyncstorage .. 

    var onTapToTalk=[];
    try
    {
      onTapToTalk= await AsyncStorage.getItem('onTapToTalk');   //get from storage
      onTapToTalk = JSON.parse(onTapToTalk);   ///string to object
    }
    catch(err)
    {
      console.log(err);
    }
   
    debug && console.log("component_home.js - got ontaptotalk from async storage");
    debug && console.log(onTapToTalk);

    if(onTapToTalk == null)
      onTapToTalk = [];
    navigation.navigate('Contacts',{onTapToTalk});  //navigating to contacts component and passing ontaptotalk to next screen
    
    setTimeout(()=>   //setting this 0 time timeout because if we dont add timeout then modal first disapper then app move to next screen ..which was not looking good.
    {
      set_modalVisible(false);
    },0);
  }
  

  useEffect(async()=>  //this will be automattically called is similar to component did mount
  { 

    debug && console.log("component_home.js - getting usernumber and nonduplicate contacts");

    GLOBAL.userNumber = await AsyncStorage.getItem('userNumber');  //get usernumber and non duplicatecontacts from storage which ere stored in app.js during login
    GLOBAL.nonduplicates = JSON.parse(await AsyncStorage.getItem('contacts'));

    debug && console.log("component_home.js - gettin recent chats");
    
    const firestoreRef = firestore()
                          .collection(GLOBAL.userNumber).orderBy('createdAt',"desc");   //referring to firestore ... sort by descending order according to usernumber
  
    firestoreRef.onSnapshot(snapshot=>(       //onsnapshot will listen to changes made in firestore .. we should listen to changes because .. if we dont listen then recent mesg screen will not update automatically when some body send message
      set_recentMessages(snapshot.docs.map(doc=>   //set_recentMessages is usestate method created above 
        ({
          id:doc.data().id,
          sender:doc.id,
          createdAt:doc.data().createdAt,
          text:doc.data().text,
          senderProfile:doc.data().receiverProfile
        })
        ))
    ))
  
    set_activityIndicator(false);
    
  },[]);

  const function_openpersonalmessage = (receiver)=>{            //this function will be called when user clicks on recents chats
   
    debug && console.log("component_home.js - user clicked on one of the recent chats");

    var sender=GLOBAL.userNumber;
      receiver={
        userNumber:receiver.sender,
        userProfile:receiver.senderProfile,
      };

    navigation.navigate('Message',{receiver,sender});       //this will navigate  to message component and passing userNumber and other details
  }

  if(activityIndicator)
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#3E4DC8'}}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return(
    <View style={{flex:1,backgroundColor:'#3E4DC8'}}>

      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => 
          {
              set_modalVisible(!modalVisible);
          }}>
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#3E4DC8'}}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      
      </Modal>

      <Modal
          animationType="fade"
          transparent={true}
          visible={alertVisible}
          onRequestClose={() => 
          {
            set_alertVisible(!alertVisible);
          }}>
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          
          <View style={{backgroundColor:'#3E4DC8',width:width/1.5,height:height/4,borderRadius:28,justifyContent:'space-evenly',alignItems:'center'}}>
            <Text style={{fontSize:width/20,fontFamily:'Montserrat-Regular',color:'#ffffff'}}>Do you want to Logout?</Text>
            <View style={{flexDirection:'row'}}>
              <Pressable
                style={{flex:1,justifyContent:'center',alignItems:'center'}}
                onPress={()=>set_alertVisible(false)}>
                <Text style={{ fontSize:width/18,fontFamily:'Montserrat-SemiBold',color:'#ffffff'}}>Cancel</Text>
              </Pressable>
              <Text style={{fontSize:width/18,color:'#ffffff'}}>|</Text>
              <Pressable
                style={{flex:1,justifyContent:'center',alignItems:'center'}}
                onPress={logOut}>
                <Text style={{ fontSize:width/18,fontFamily:'Montserrat-Regular',color:'#ffffff'}}>Logout</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </Modal>

      <View style={alertVisible?{flex:1,opacity:0.6}:{flex:1}}>
        
        <View style={{height:height/14,justifyContent:'space-between',alignItems:'center',flexDirection:'row',marginHorizontal:width/22}}>  
          <TouchableOpacity onPress={()=>set_alertVisible(true)} style={{backgroundColor:'#4f5fe3',height:width/11,width:width/11,justifyContent:'center',alignItems:'center',borderRadius:8}}>
            <Icon name="ios-log-out-outline" size={width/16} color="#ffffff"></Icon>
          </TouchableOpacity>
          
          <Text style={{color:'#ffffff',fontSize:width/18,fontFamily:'Montserrat-Regular'}}>Messages</Text>
          
          <View style={{backgroundColor:'#4f5fe3',height:width/11,width:width/11,justifyContent:'center',alignItems:'center',borderRadius:8}}>
            <Icon name="search-outline" size={width/17} color="#ffffff"></Icon>
          </View>
        </View>

        <View style={{flex:1,backgroundColor:'#ffffff',borderTopLeftRadius:48,borderTopRightRadius:48}}>
          {
            recentMessages.length==0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'#000000'}}>No recent messages.</Text>
            </View>
            :
              <ScrollView style={{marginHorizontal:width/22,marginVertical:height/24}}>
              {
                recentMessages.map((item,key)=>(
                  
                  <View key={item.id} style={{flexDirection:'row',alignItems:'center',marginVertical:8,borderWidth:2,width:width-40,borderColor:'#3E4DC8',padding:8,borderRadius:16}}>
                    {
                      item.senderProfile=="defaultProfile.png"?
                      <View style={{width:44,height:44,borderRadius:44,borderWidth:1,borderColor:'#3E4DC8',justifyContent:'center',alignItems:'center'}}><Image style={{width:44,height:44,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/></View>
                      :
                      <Image
                        source={{ uri: item.senderProfile }}
                        style={{width:48,height:48,borderRadius:44}}
                        PlaceholderContent={<View style={{backgroundColor:'#ffffff',width:44,height:44,borderRadius:44}}><Image style={{width:44,height:44,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/></View>}
                      />
                    }
                    <TouchableOpacity style={{marginHorizontal:16,flex:1}} onPress={()=>function_openpersonalmessage(item)}>
                      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        {
                          GLOBAL.nonduplicates[item.sender]!=undefined?
                          <Text numberOfLines={1} style={{marginBottom:4,fontSize:18,fontFamily:'Montserrat-Medium'}}>{GLOBAL.nonduplicates[item.sender]}</Text>
                          :
                          <Text numberOfLines={1} style={{marginBottom:4,fontSize:18,fontFamily:'Montserrat-Medium'}}>{item.sender}</Text>
                        }
                        {
                        item.createdAt.hour>12?
                        <Text style={{marginBottom:4,fontSize:12}}>{item.createdAt.hour - 12}:{item.createdAt.minute} PM</Text>
                        :
                        <Text style={{marginBottom:4,fontSize:12}}>{item.createdAt.hour}:{item.createdAt.minute} AM</Text> 
                        }
                      </View>
                      <Text numberOfLines={1} style={{fontSize:16}}>{item.text}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </ScrollView>  
          }
          
          <TouchableOpacity 
            onPress={function_checkcontacts}
            style={{position:'absolute',right:28,bottom:16,backgroundColor:'#3E4DC8',height:44,width:44,justifyContent:'center',alignItems:'center',borderRadius:24}}>
            <Icon name="add" size={34} color="#ffffff"></Icon>
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );

}