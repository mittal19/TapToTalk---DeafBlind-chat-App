//Here usesr details are taken and then stored in local storage
//Then logIn Memo function created in App.js is called with the details passed.

import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../helpers/context';

export function component_userDetails({route,navigation})
{
    const {logIn} = React.useContext(AuthContext);      //login function created at App.js 

    const {userNumber} = route.params;        //getting info from previous screen
     
    const [userName,set_userName] = React.useState('');         //will hold name
    const [userStatus,set_userStatus] = React.useState('');    //will hold status
    const [userProfile,set_userProfile] = React.useState('');         //will hold profile

    const function_submitDetails =async()=>             //this function will be called when user clicks submit details button
    { 
        try
        {
            if(userName.length<1||userProfile.length<1||userStatus.length<1)        //checking if all details are entered
            {
                ToastAndroid.show("Enter all details",ToastAndroid.LONG);               //if not show error
            }
            else     //if all details are entered
            {  
                navigation.navigate('Select image',{userNumber,userName,userProfile,userStatus});
                //await AsyncStorage.setItem('userNumber',userNumber);            //set all details in local storage of phone
                //await AsyncStorage.setItem('userName',userName);
                //await AsyncStorage.setItem('userStatus',userStatus);
                //await AsyncStorage.setItem('userProfile',userProfile);
                //logIn(userNumber,userName,userStatus,userProfile);           //call function created in App.js using memo
            }
        }
        catch(e)
        {
            ToastAndroid.show("Some error occurred! Try again",ToastAndroid.LONG);
            navigation.pop();
        }
    }

    return(
        <View>
            <TextInput
                placeholder="Enter User Name"
                value={userName}
                onChangeText={set_userName}
            />
            <TextInput
                placeholder="Enter User status"
                value={userStatus}
                onChangeText={set_userStatus}
            />
            <TextInput
                placeholder="Enter Profile"
                value={userProfile}
                onChangeText={set_userProfile}
            />
            <TouchableOpacity onPress={function_submitDetails}>
                <Text>Confirm</Text>
            </TouchableOpacity>
        </View>
    )
}