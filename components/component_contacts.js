// THIS COMPONENT WILL RETRIVE CONTACTS FROM DEVICE.
// THEN FILTER OUT THE UNNECESSARY DATA
//THEN CHECK WHICH CONTACTS HAVE ACCOUNT ON TAPTOTALK
//THEN USER CAN CLICK ON A CONTACT TO NAVIGATE TO PERSONAL MESSAGE SCREEN OF SELECTED CONTACT

import React,{useEffect,useState} from 'react';
import {View,Text,TouchableOpacity,ActivityIndicator,Modal,SafeAreaView,ToastAndroid,Dimensions,ScrollView} from 'react-native';
import {firebase} from '../helpers/firebaseConfig';
import {Image} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

GLOBAL = require('../global_userNumber');
GLOBAL = require('../global_nonduplicates');
GLOBAL = require('../global_formatedcontacts');

const {width, height} = Dimensions.get('window');

const debug =  true;

export function component_contacts({route,navigation})
{
  debug && console.log("-----");
  debug && console.log("component_contacts.js");

  const sender = GLOBAL.userNumber;
  
  const dbref = firebase.database().ref();     //setting reference to real time database
  
  const [onTapToTalk,set_onTapToTalk] = useState(route.params.onTapToTalk);   //hold contacts on taptotalk //getting data from previous screen
  const [modalVisible, set_modalVisible] = useState(false);  //use to show image in large
  const [openImg,set_openImg] = useState();   //store which img to show in large
  const [flg,set_flg] = useState(false);

  useEffect(async()=>
  {
    debug && console.log("component_contacts.js - getting users on tap to talk");

    try
    {
      var tempflg=true;
      var formated_Contacts = route.params.formated_Contacts;

      var usersOnApp = await dbref.child('users').once('value').then(snap=>{return snap.val()});  //getting users from realtimedatabase

      debug && console.log("component_home.js - got user on tap to talk");

      for(var i=0;i<formated_Contacts.length;i++)    //for each contact of phone check if it exist on taptotalk or not
      {     
        var phoneNumber = formated_Contacts[i].userNumber;
        if(usersOnApp[phoneNumber]!=undefined)    //if it exists then change properties of formated_contacts
        {
          tempflg=false;
          formated_Contacts[i].onTapToTalk = "Yes";
          formated_Contacts[i].userProfile = usersOnApp[phoneNumber].userProfile;
        }
      }

      set_onTapToTalk(formated_Contacts);  //display the updated formated_contacts
      GLOBAL.formated_Contacts = formated_Contacts;    //change global value of formated_contact

      debug && console.log("component_home.js - updated users on taptotalk changes formated_Contacts");
 
      await AsyncStorage.setItem('onTapToTalk',JSON.stringify(formated_Contacts));   //stored updated formated_contacts in  local so that when next time user open contacts screen we have something to display instaed of just diplaying loader

      if(tempflg==true)
        set_flg(tempflg);
      debug && console.log("component_home.js - stored updated formated_contacts in  local so that when next time user open contacts screen we have something to display instaed of just diplaying loader");
    }
    catch(err)
    {
      debug && console.log("component_home.js- error occured while getting users on taptotalk");
      debug && console.log(err);

      navigation.pop();
      ToastAndroid.show("Some error occurred try again.",ToastAndroid.SHORT);
    }      
  },[]);
  
  const function_openpersonalmessage = (receiver)=>{            //this function will be called when user clicks on specific contact to begin chatting
    
    debug && console.log("component_home.js- open chat to begin chatting");
    
    navigation.pop();  //this will poput current contacts component screen 
    navigation.navigate('Message',{receiver,sender});       //this will navigate  to message component and passing userNumber and other details
  }

  const function_openImg = (userProfile)=>
  {
    debug && console.log("component_home.js- open image");

    if(userProfile!='defaultProfile.png')
    {
      set_openImg(userProfile);
      set_modalVisible(!modalVisible);
    }
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

          <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center',height:height,width:width,backgroundColor:'#000000'}}>
              <Image
                  source={{uri:openImg}}
                  style={{width:width,height:width}}
                  PlaceholderContent={<Image style={{width:44,height:44,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/>}
                />
          </SafeAreaView>
      </Modal>

    
    <View style={{marginHorizontal:width/22,flex:1}}>
      
      <Text style={{color:'#DCDCDC',fontSize:width/24,fontFamily:'Montserrat-Regular',marginTop:height/48}}>Contacts</Text>
      {
        flg==true?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'#FFFFFF',fontSize:width/20}}>No contacts on app.</Text>
        </View>
        :
        <ScrollView style={{ marginVertical:height/44}}>
        {
          onTapToTalk.map((item,key)=>(
            <View key={item.userNumber} >
              {
                item.onTapToTalk=="Yes"?
                <View style={{flexDirection:'row',marginVertical:height/112,flex:1,alignItems:'center'}}>
                  <TouchableOpacity onPress={()=>function_openImg(item.userProfile)} style={{backgroundColor:'#ffffff',width:width/10,height:width/10,borderRadius:44}}>
                    <Image
                      source={{ uri: item.userProfile}}
                      style={{width:width/10,height:width/10,borderRadius:44}}
                      PlaceholderContent={<View style={{backgroundColor:'#ffffff',width:width/10,height:width/10,borderRadius:44}}><Image style={{width:width/10,height:width/10,borderRadius:44}} source={require('../res/img/defaultProfile.png')}/></View>}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={()=>function_openpersonalmessage(item)} style={{flex:1,justifyContent:'center',marginLeft:width/36,backgroundColor:'#ffffff',height:height/14,flex:1,borderRadius:8}}>
                    <Text numberOfLines={1} style={{marginLeft:width/36,fontSize:width/24,color:'#3E4DC8',fontFamily:'Montserrat-Medium'}}>{item.userName}</Text>
                  </TouchableOpacity>
                </View>
                :
                <View></View>
              }
            </View>
          ))
        }
      </ScrollView>
      }
    </View>
    </View>
  );
}


// DEVELOPED BY - PRIYANSHU MITTAL  (REACT NATIVE DEVELOPER , JAVA DEVELOPER , COMPETITIVE PROGRAMMER )