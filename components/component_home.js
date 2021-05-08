//here for now user can logout or see contacts 

import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,ActivityIndicator,ScrollView,Image,Dimensions} from 'react-native';
import {AuthContext} from '../helpers/context';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');

GLOBAL = require('../global');
export function component_home({navigation})
{
  const {logOut} = React.useContext(AuthContext);          //accessing auth context function logOut created at App.js file

  const [recentMessages,set_recentMessages] = React.useState([]);
  const [activityIndicator,set_activityIndicator] = React.useState(true);   // this usestate will decide whether to show activity indicator or not.

  const function_checkcontacts = async()=>     //this function will be called when userr click on contacts
  {       
    navigation.navigate('Contacts');  //navigating to contacts component and passing userNumber to next screen
  }

  useEffect(async()=>  //this will be automattically called is similar to component did mount
  { 
    const firestoreRef = firestore()
                            .collection(GLOBAL.userNumber).orderBy('createdAt',"desc");
    
    firestoreRef.onSnapshot(snapshot=>(
      set_recentMessages(snapshot.docs.map(doc=>
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

      <View style={{height:56,justifyContent:'space-between',alignItems:'center',flexDirection:'row',marginHorizontal:20}}>
        
        <View style={{backgroundColor:'#4f5fe3',height:40,width:40,justifyContent:'center',alignItems:'center',borderRadius:8}}>
          <Icon name="reorder-three-outline" size={32} color="#ffffff"></Icon>
        </View>
        
        <Text style={{color:'#ffffff',fontSize:24,fontFamily:'Montserrat-Regular'}}>Messages</Text>
        
        <View style={{backgroundColor:'#4f5fe3',height:40,width:40,justifyContent:'center',alignItems:'center',borderRadius:8}}>
          <Icon name="search-outline" size={24} color="#ffffff"></Icon>
        </View>

      </View>

      <View style={{flex:1,backgroundColor:'#ffffff',borderTopLeftRadius:48,borderTopRightRadius:48}}>
        
        <ScrollView style={{marginHorizontal:20,marginVertical:16}}>
          {
            recentMessages.map((item,key)=>(
              
              <View key={item.id} style={{flexDirection:'row',alignItems:'center',marginVertical:8,borderWidth:2,width:width-40,borderColor:'#3E4DC8',padding:8,borderRadius:16}}>
                <Image
                  source={{ uri: item.senderProfile }}
                  style={{width:48,height:48,borderRadius:44}}
                  PlaceholderContent={<Text style={{fontSize:8}}>Image</Text>}
                />
                <View style={{marginHorizontal:16,flex:1}}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text numberOfLines={1} style={{marginBottom:4,fontSize:18,fontFamily:'Montserrat-Medium'}}>{item.sender}</Text>
                    <Text style={{marginBottom:4,fontSize:12}}>{item.createdAt.hour}:{item.createdAt.minute}</Text>
                  </View>
                  <Text numberOfLines={1} style={{fontSize:16}}>{item.text}</Text>
                </View>
              </View>
            ))
          }
        </ScrollView>

        <TouchableOpacity 
          onPress={function_checkcontacts}
          style={{position:'absolute',right:28,bottom:16,backgroundColor:'#3E4DC8',height:44,width:44,justifyContent:'center',alignItems:'center',borderRadius:24}}>
          <Icon name="add" size={34} color="#ffffff"></Icon>
        </TouchableOpacity>

      </View>

    </View>
  );

}