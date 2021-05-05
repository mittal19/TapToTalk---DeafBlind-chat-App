//here for now user can logout or see contacts 

import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,ActivityIndicator} from 'react-native';
import {AuthContext} from '../helpers/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
GLOBAL = require('../global');
export function component_home({navigation})
{
  const {logOut} = React.useContext(AuthContext);          //accessing auth context function logOut created at App.js file
  
  const [activityIndicator,set_activityIndicator] = React.useState(true);   // this usestate will decide whether to show activity indicator or not.

  const checkcontacts = async()=>     //this function will be called when userr click on contacts
  {       
    navigation.navigate('Contacts');  //navigating to contacts component and passing userNumber to next screen
  }

  useEffect(async()=>  //this will be automattically called is similar to component did mount
  { 
    const firestoreRef = firestore()
                            .collection(GLOBAL.userNumber);

    const subscribe = firestoreRef.onSnapshot(querySnapshot => {
      querySnapshot.docs.map(documentSnapshot=>
        {
          console.log(documentSnapshot.data())
        })
    });
    
    set_activityIndicator(false);
    
  },[]);

  if(activityIndicator)
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#3E4DC8'}}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return(
    <View style={{flex:1,justifyContent:'space-between'}}>
      <Text>HOME</Text>
      <Text>{GLOBAL.userNumber}</Text>
      <TouchableOpacity onPress={checkcontacts} ><Text>CONTACTS</Text></TouchableOpacity>
      <TouchableOpacity onPress={logOut}><Text>Logout</Text></TouchableOpacity>
    </View>
  );

}