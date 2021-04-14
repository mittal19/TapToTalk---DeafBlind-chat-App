//here for now user can logout or see contacts 

import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import {AuthContext} from '../helpers/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {Image} from 'react-native-elements';

export function component_home({navigation})
{
  const {logOut} = React.useContext(AuthContext);          //accessing auth context function logOut created at App.js file

  const [userNumber,set_userNumber] = useState('');
  const [userProfile,set_userProfile] = useState('');
  const [url,set_url] = useState('https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png');
  
  const checkcontacts = async()=>     //this function will be called when userr click on contacts
  {       
    navigation.navigate('Contacts',{userNumber});  //navigating to contacts component and passing userNumber to next screen
  }

  useEffect(()=>  //this will be automattically called is similar to component did mount
  {  
    console.log("in66");
    set_userNumber(AsyncStorage.getItem('userNumber'));   //getting userNumber from local storage
    set_userProfile(AsyncStorage.getItem('userProfile'));

    async function functionname()
    {
      console.log("in55");
      var a=await AsyncStorage.getItem('userNumber');
      console.log(a);
      set_userNumber(await AsyncStorage.getItem('userNumber'));   //getting userNumber from local storage
      set_userProfile(await AsyncStorage.getItem('userProfile'));
      console.log(userNumber);
      console.log(userProfile);
    }
    functionname();
  },[]);

  const getprofile=async()=>
  {
    console.log("fsd");
    console.log(userNumber);
    console.log(userProfile);
    var userProfile1=await AsyncStorage.getItem('userProfile');
    const url = await storage().ref(userProfile1).getDownloadURL();
    console.log(url);
    set_url(url);
  }

  return(
    <View>
      <Text>HOME</Text>
      <TouchableOpacity onPress={checkcontacts} ><Text>CONTACTS</Text></TouchableOpacity>
      <TouchableOpacity onPress={logOut}><Text>Logout</Text></TouchableOpacity>
      <TouchableOpacity onPress={getprofile}><Text>get</Text></TouchableOpacity>
      <Image
        source={{ uri: url }}
        style={{ width: 200, height: 200 }}
        PlaceholderContent={<Text>Image</Text>}
      />
    </View>
  );

}