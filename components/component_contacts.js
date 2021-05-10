// THIS COMPONENT WILL RETRIVE CONTACTS FROM DEVICE.
// THEN FILTER OUT THE UNNECESSARY DATA
//THEN CHECK WHICH CONTACTS HAVE ACCOUNT ON TAPTOTALK
//THEN USER CAN CLICK ON A CONTACT TO NAVIGATE TO PERSONAL MESSAGE SCREEN OF SELECTED CONTACT

import React,{useEffect,useState} from 'react';
import {View,Text,TouchableOpacity,FlatList,Platform,PermissionsAndroid,ActivityIndicator,Modal,SafeAreaView,ToastAndroid,Dimensions,ScrollView} from 'react-native';
import Contacts from 'react-native-contacts';
import {firebase} from '../helpers/firebaseConfig';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/AntDesign';  
import {Image} from 'react-native-elements';

GLOBAL = require('../global');

const {width, height} = Dimensions.get('window');

export function component_contacts({navigation})
{
  const sender = GLOBAL.userNumber;
  
  const dbref = firebase.database().ref();     //setting reference to real time database
  
  const [activityIndicator,set_activityIndicator] = useState(true);
  const [onTapToTalk,set_onTapToTalk] = useState([]);   //hold contacts on taptotalk
  const [modalVisible, set_modalVisible] = useState(false);
  const [openImg,set_openImg] = useState();
  const [showProfile,set_showProfile] = useState(false);

  useEffect(async()=>
  {
    var raw_Contacts=[];     //hold all phone contacts

    if(Platform.OS == 'android')
    {
      try
      {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

        if(granted === PermissionsAndroid.RESULTS.GRANTED)
        {
          await Contacts.getAll().then(contacts =>   //getting all phone contacts
            {
              raw_Contacts=contacts;    
            });

          var formated_Contacts=[];

          const usersOnApp = await dbref.child('users').once('value').then(snap=>{return snap.val()});
          
          var nonDuplicatePhoneNumbers={};

          for(var i=0;i<raw_Contacts.length;i++)
          {
            if(raw_Contacts[i].phoneNumbers.length!=0) 
            {
              var phoneNumber = raw_Contacts[i].phoneNumbers[0].number;
              phoneNumber = phoneNumber.replace(/\D/g,'').slice(-10);
            
              if(nonDuplicatePhoneNumbers[phoneNumber]==undefined)
              {
                nonDuplicatePhoneNumbers[phoneNumber]=1;
              
                var onTapToTalk = "No";
                var userProfile = "";
                
                if(usersOnApp[phoneNumber]!=undefined)
                {
                  onTapToTalk = "Yes";
                  userProfile = usersOnApp[phoneNumber].userProfile;
                }
                
                formated_Contacts.push(
                  {
                    userNumber:phoneNumber,
                    userName:raw_Contacts[i].displayName,
                    onTapToTalk:onTapToTalk,
                    userProfile:userProfile
                  }
                );
              }
            }
          }
          
          formated_Contacts.sort(function(a,b)   //sorting 'on' according to their name
          {
            return a.userName.toLowerCase()>b.userName.toLowerCase();
          });

          set_onTapToTalk(formated_Contacts);
          
          set_activityIndicator(false);

          var default_ProfileURL = await storage().ref('defaultProfile.png').getDownloadURL();
          
          for(var i=0;i<formated_Contacts.length;i++)
          {
            if(formated_Contacts[i].userProfile!="")
            {
              
              if(formated_Contacts[i].userProfile!="defaultProfile.png")
              { 
                var ProfileURL = await storage().ref(formated_Contacts[i].userProfile).getDownloadURL(); 
                formated_Contacts[i].userProfile = ProfileURL;
              }
              else
              {
                formated_Contacts[i].userProfile = default_ProfileURL;
              }
            }
          }

          set_onTapToTalk(formated_Contacts);
          set_showProfile(true);
        }
        else
        {
          console.log("permission denied"); 
          
          navigation.goBack();   //permission denied to access contacts // going one screen back
          ToastAndroid.show("Permission to access contacts denied",ToastAndroid.SHORT);  
        }
      }
      catch(err)
      {
        console.log(err);

        navigation.goBack();    //some error occurred going one screen back
        ToastAndroid.show("Permission to access contacts denied",ToastAndroid.SHORT);
      }
    }
  },[]);
  
  const function_openpersonalmessage = (receiver)=>{            //this function will be called when user clicks on specific contact to begin chatting
    if(receiver.onTapToTalk=="false")       //checking if the contact user clicked on is on taptotalk or not
    {
      ToastAndroid.show("Not on TapToTalk! Invite them here.",ToastAndroid.LONG);        //if not then show this
    }
    else  //if user is on taptotalk
    {
      navigation.pop();  //this will poput current contacts component screen 
      navigation.navigate('Message',{receiver,sender});       //this will navigate  to message component and passing userNumber and other details
    }
  }

  const function_openImg = (userProfile)=>
  {
    if(userProfile!='https://firebasestorage.googleapis.com/v0/b/taptotalk-ce0f0.appspot.com/o/defaultProfile.png?alt=media&token=7c559b92-a6a2-4ba7-ace9-9cbb3a8d6d2c')
    {
      set_openImg(userProfile);
      set_modalVisible(!modalVisible);
    }
  }

  if(activityIndicator)
  {  
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#3E4DC8'}}>
        <ActivityIndicator size="large" color="#FFFFFF"/>
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

          <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center',height:height,width:width,backgroundColor:'#000000'}}>
              <Image
                  source={{uri:openImg}}
                  style={{width:width,height:width}}
                  PlaceholderContent={<Text style={{fontSize:24}}>Image</Text>}
                />
          </SafeAreaView>
      </Modal>

    
    <View style={{marginHorizontal:16}}>
      
      <Text style={{color:'#DCDCDC',fontSize:18,fontFamily:'Montserrat-Regular',marginTop:16}}>Contacts</Text>
      
      <ScrollView style={{ marginVertical:16}}>
        {
          onTapToTalk.map((item,key)=>(
            <View key={item.userNumber} >
              {
                item.onTapToTalk=="Yes"?
                <View style={{flexDirection:'row',marginVertical:6,flex:1,alignItems:'center'}}>
                  <TouchableOpacity onPress={()=>function_openImg(item.userProfile)} style={{backgroundColor:'#ffffff',width:44,height:44,borderRadius:44}}>
                    {
                      showProfile?
                      <Image
                        source={{ uri: item.userProfile}}
                        style={{width:44,height:44,borderRadius:44}}
                        PlaceholderContent={<Text style={{fontSize:8}}>Image</Text>}
                      />
                      :
                      <View style={{width:44,height:44,borderRadius:44,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator size="small" color="#3E4DC8"/>
                      </View>
                    }
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={()=>function_openpersonalmessage(item)} style={{flex:1,justifyContent:'center',marginLeft:16,backgroundColor:'#ffffff',height:48,flex:1,borderRadius:8}}>
                    <Text style={{marginLeft:12,fontSize:18,color:'#3E4DC8',fontFamily:'Montserrat-Medium'}}>{item.userName}</Text>
                  </TouchableOpacity>
                </View>
                :
                <View></View>
              }
            </View>
          ))
        }
      </ScrollView>

    </View>
       
    </View>
  );
}


// DEVELOPED BY - PRIYANSHU MITTAL  (REACT NATIVE DEVELOPER , JAVA DEVELOPER , COMPETITIVE PROGRAMMER )