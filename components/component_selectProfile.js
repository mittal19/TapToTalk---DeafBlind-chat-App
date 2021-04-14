import React from 'react'
import {TouchableOpacity, View, Text} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../helpers/context';

export function component_selectProfile({route,navigation}) 
{
    const {logIn} = React.useContext(AuthContext);      //login function created at App.js
    
    const {userNumber,userName,userStatus,userProfile} = route.params;

    const function_openCamera=async()=>
    {
        await ImagePicker.openCamera({
            widht:500,
            height:500,
            cropping:true
        }).then(image =>
            {
                var uri = image["path"];
                var nameoffile = uri.substring(uri.lastIndexOf('/')+1);
                console.log(uri);
                console.log(nameoffile);
                navigation.navigate('Save Profile',{userNumber,userName,userStatus,userProfile,uri,nameoffile});
            });
    }

    const function_openGallery=async()=>
    {
        await ImagePicker.openPicker({
            width:500,
            height:300,
            cropping:true
        }).then(image =>
            {
                var uri = image["path"];
                var nameoffile = uri.substring(uri.lastIndexOf('/')+1);
                console.log(uri);
                console.log(nameoffile);
                navigation.navigate('Save Profile',{userNumber,userName,userStatus,userProfile,uri,nameoffile});
            });
    }

    const function_skipprofileimage=async()=>
    {
        logIn(userNumber,userName,userStatus,userProfile);
    }

    return (
        <View>
            <Text>Set profile picture</Text>
            <TouchableOpacity onPress={function_openCamera}>
                <Text>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={function_openGallery}>
                <Text>Select Picture from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={function_skipprofileimage}>
                <Text>Skip</Text>
            </TouchableOpacity>
        </View>
    )
}
