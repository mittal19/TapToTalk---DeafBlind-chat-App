import React from 'react';
import {View,Text, TouchableOpacity, ToastAndroid} from 'react-native';
import {Image} from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../helpers/context';

export function component_saveProfile({route,navigation})
{
    const {userNumber,userName,userStatus,userProfile,uri,nameoffile} = route.params;
    console.log(userNumber+" "+userName+" "+userStatus+" "+userProfile+" "+uri+" "+nameoffile);

    const {logIn} = React.useContext(AuthContext);      //login function created at App.js

    const function_saveProfile=async()=>
    {
        console.log("in1");
        try
        {
            console.log("in2");
            const resp = await storage().ref(nameoffile).putFile(uri);
            console.log(resp);
            if(resp["state"]=="success")
            { 
                console.log("in3");  
                logIn(userNumber,userName,userStatus,nameoffile);
            }
            else
            {   
                console.log("in4");
                console.log(resp); 
                ToastAndroid.show("Some error occured.Try again!",ToastAndroid.SHORT);
                navigation.pop();
            }
        }
        catch(err)
        {
            console.log("in5");
            console.log(err);
            ToastAndroid.show("Some error occured.Try again!",ToastAndroid.SHORT);
            navigation.pop();
        }
    }
    return(
        <View>
            <Image
                source={{ uri: uri }}
                style={{ width: 200, height: 200 }}
                PlaceholderContent={<Text>Image</Text>}
            />
            <TouchableOpacity onPress={function_saveProfile}>
                <Text>Save it</Text>
            </TouchableOpacity>
        </View>
    );
}