// THIS COMPONENT WILL RETRIVE CONTACTS FROM DEVICE.
// THEN FILTER OUT THE UNNECESSARY DATA
//THEN CHECK WHICH CONTACTS HAVE ACCOUNT ON TAPTOTALK
//THEN USER CAN CLICK ON A CONTACT TO NAVIGATE TO PERSONAL MESSAGE SCREEN OF SELECTED CONTACT

import React,{useEffect,useState} from 'react';
import {View,Text,TouchableOpacity,FlatList,Platform,PermissionsAndroid,ActivityIndicator, ToastAndroid,SafeAreaView} from 'react-native';
import Contacts from 'react-native-contacts';
import {firebase} from '../helpers/firebaseConfig';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';  
import {Image} from 'react-native-elements';

export function component_contacts({route,navigation})
{

  const sender = route.params;   //getting userNumber from previous screen
  const dbref = firebase.database().ref();     //setting reference to real time database
  const [isLoading,set_isLoading] = useState(true);
  const [onTapToTalk,set_onTapToTalk] = useState([]);   //hold contacts on taptotalk
  const [notTapToTalk,set_notTapToTalk] = useState([]);   //hold contacts not on taptotalk

  useEffect(()=>
  {
      
      async function functionname()   //creating a function with name of 'functionname' 
      {
        var contacts=[];     //hold all phone contacts

        if(Platform.OS == 'android')
        {
          try
          {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

            if(granted === PermissionsAndroid.RESULTS.GRANTED)
            {
              await Contacts.getAll().then(cont =>   //getting all phone contacts
                {  
                  contacts=cont;    
                });

              const query = await dbref.child('users');   //refering to users in realtime database
              const users = await query.once('value')    //users variable will have details of all users on taptotalk
                                    .then(
                                      function(snap)
                                      {
                                        return snap.val();
                                      }
                                    );
              
              //console.log(users);
              //console.log(contacts);

              var on=[];    //temporary variable will hold users on taptotalk
              var not=[];   ////temporary variable will hold users not on taptotalk
              var x=0;    //index for on variable
              var y=0;   //index for not variable
              for(var i=0;i<contacts.length;i++)
              {
                if(contacts[i].phoneNumbers.length!=0)    //if phone contact have no number
                {

                  var tempphonenumber = contacts[i].phoneNumbers[0].number;
                  tempphonenumber = tempphonenumber.replace(/\D/g,'').slice(-10);

                  if(users[tempphonenumber]!=undefined)    //if phone contact is present on tap to talk
                  {
                    var profilename = users[tempphonenumber].userProfile;
                    var profileLink = await storage().ref(profilename).getDownloadURL();
                    var enrty =    //creating a entry for 'on' array
                    {
                      id:x,   //index
                      userName:contacts[i].displayName,
                      userNumber:tempphonenumber,
                      userProfile:profileLink,
                    };
                    x++;
                    on.push(enrty);
                  }
                  else
                  {    ///contacs of phone not on taptotalk
                    var profileLink = 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png';
                    var enrty =    //creating entty for 'not' array
                    {
                      id:y,    //index
                      userName:contacts[i].displayName,
                      userNumber:tempphonenumber,
                      userProfile:profileLink,
                    };
                    y++;
                    not.push(enrty);
                  } 
                }
              }

              on.sort(function(a,b)   //sorting 'on' according to their first name
              {
                return a.userName.toLowerCase()>b.userName.toLowerCase();
              });
              not.sort(function(a,b)   //sorting 'not' acc. to first name
              {
                return a.userName.toLowerCase()>b.userName.toLowerCase();
              });

              console.log(on);
              //console.log(not);
              set_onTapToTalk(on);   //setting usestate
              set_notTapToTalk(not);  //setting usestate
              set_isLoading(false);  
            }
            else
            {
              console.log("permission denied"); 
              navigation.goBack();   //permission denied to access contacts // going one screen back
              ToastAndroid.show("Permission to access contacts denied",ToastAndroid.LONG);  
            }
          }
          catch(err)
          {
            console.log(err);
            navigation.goBack();    //some error occurred going one screen back
            ToastAndroid.show("Permission to access contacts denied",ToastAndroid.LONG);
          }
        }
      }
      functionname();    //calling above function
    },[]);
  
  const openpersonalmessage = (receiver)=>{            //this function will be called when user clicks on specific contact to begin chatting
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

  const invitethem = (receiver)=>
  {
    //showing toast when clicked on user who is not on taptotalk
    console.log(receiver);
    ToastAndroid.show(receiver.userName +" is not on TapToTalk! Invite them here.",ToastAndroid.SHORT);
  }

  if(isLoading==true)
  {  //showin loader  till contacts is not fetched
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color="#000000"/>
      </View>
    );
  }
 
  return( 
    <View style={{ flex:1,margin:10 }}>
      <View>
        <Text style={{margin:5}}>On TAP TO TALK</Text>
        <FlatList    //this list will show users who are on taptotalk
          style={{ margin:10 }}
          data={onTapToTalk}
          keyExtractor={({ id }, index) => id.toString()}
          renderItem={({ item }) => (
            <View style={{flexDirection:'row'}}>
              <Image
                source={{ uri: item.userProfile }}
                style={{ width: 30, height: 30 }}
                PlaceholderContent={<Text>Image</Text>}
              />
              <TouchableOpacity onPress={()=>openpersonalmessage(item)}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',padding:6}}>
                  <Text>{item.userName}</Text>
                </View>
              </TouchableOpacity>
            </View>    
          )} 
        />
      </View>
      <View style={{marginBottom:30}}>
        <Text style={{margin:5}}>Not on TAP TO TALK</Text>
        <FlatList    //this list will show users who are not on taptotalk
          style={{ margin:10 }}
          data={notTapToTalk}
          keyExtractor={({ id }, index) => id.toString()}
          renderItem={({ item }) => (
            <View style={{flexDirection:'row'}}>
              <Icon.Button  name="user" 
                            backgroundColor="#000000" 
                            size={20} 
                            onPress={()=>console.log("pressed")} 
              /> 
              <TouchableOpacity onPress={()=>invitethem(item)}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',padding:6}}>
                  <Text>{item.userName}</Text>
                </View>
              </TouchableOpacity>
            </View>    
          )} 
        />
      </View>
    </View>
  );
}


// DEVELOPED BY - PRIYANSHU MITTAL  (REACT NATIVE DEVELOPER , JAVA DEVELOPER , COMPETITIVE PROGRAMMER )