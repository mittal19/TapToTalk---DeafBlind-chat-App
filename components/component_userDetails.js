//Here usesr details are taken and then stored in local storage
//Then logIn Memo function created in App.js is called with the details passed.

import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,Modal,Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../helpers/context';
import styles,{width,height} from './styling/style_userDetails';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

export function component_userDetails({route,navigation})
{
    const {logIn} = React.useContext(AuthContext);      //login function created at App.js 

    const {userNumber} = route.params;        //getting info from previous screen
     
    const [userName,set_userName] = React.useState('');         //will hold name
    const [userState,set_userState] = React.useState('');    //will hold status
    const [userProfile,set_userProfile] = React.useState('');
    const [userProfileName,set_userProfileName] = React.useState('');
    const [selectedOption, set_selectedOption] =   React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);

    const function_submitDetails =async()=>             //this function will be called when user clicks submit details button
    { 
        try
        {
            if(userName.length<1||userState.length<1)        //checking if all details are entered
            {
                ToastAndroid.show("Enter all details",ToastAndroid.SHORT);               //if not show error
            }
            else if(userProfileName.length<1||userProfile.length<1)
            {
                ToastAndroid.show("Some error while selecting Profile! Try again.",ToastAndroid.SHORT);
            }
            else     //if all details are entered
            {  
                try
                {
                    const resp = await storage().ref(userProfileName).putFile(userProfile);
                    console.log(resp);
                    if(resp["state"]=="success")
                    { 
                        await AsyncStorage.setItem('userNumber',userNumber);            //set all details in local storage of phone
                        await AsyncStorage.setItem('userName',userName);
                        await AsyncStorage.setItem('userState',userState);
                        await AsyncStorage.setItem('userProfile',userProfile);
                        logIn(userNumber,userName,userState,userProfile);           //call function created in App.js using memo
                    }
                    else
                    {   
                        ToastAndroid.show("Some error occured.Try again!",ToastAndroid.SHORT);
                    }
                }
                catch(err)
                {
                    ToastAndroid.show("Some error occured.Try again!",ToastAndroid.SHORT);
                }
            }
        }
        catch(e)
        {
            ToastAndroid.show("Some error occurred! Try again",ToastAndroid.SHORT);
            navigation.pop();
        }
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
                set_userProfile(uri);
                set_userProfileName(nameoffile);
                //navigation.navigate('Save Profile',{userNumber,userName,userStatus,userProfile,uri,nameoffile});
            });
        setModalVisible(!modalVisible)
    }

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
                set_userProfile(uri);
                set_userProfileName(nameoffile);
            });
        setModalVisible(!modalVisible)
    }

    return(
        <View style={{flex:1,backgroundColor:'#3E4DC8'}}>
        
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => 
                {
                    setModalVisible(!modalVisible);
                }}>

                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <View style={{backgroundColor:'#ffffff',height:200,width:300,borderRadius:25,justifyContent:'center',alignItems:'center'}}>
                        <Pressable
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            onPress={() => function_openGallery()}>
                            <Text style={{fontSize:22,fontFamily:'Montserrat-Regular'}}>Choose from gallery</Text>
                        </Pressable>
                        <Pressable
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            onPress={() => function_openCamera()}>
                            <Text style={{fontSize:22,fontFamily:'Montserrat-Regular'}}>Take from camera</Text>
                        </Pressable>
                        <Pressable
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={{fontSize:22,fontFamily:'Montserrat-SemiBold'}}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={{justifyContent:'center',alignItems:'center',height:250}}>
                <View style={{height:160,width:160,backgroundColor:'#3AF9EFFF',justifyContent:'center',alignItems:'center',borderRadius:50,transform:[{rotate:'-57deg'}]}}>
                    <View style={{height:160,width:160,backgroundColor:'#C72FF8FF',borderRadius:50,justifyContent:'center',alignItems:'center',transform:[{rotate:'27deg'}]}}>
                        <Pressable onPress={()=>setModalVisible(true)} style={{height:150,width:150,backgroundColor:'#ffffff',borderRadius:50,justifyContent:'center',alignItems:'center',transform:[{rotate:'30deg'}]}}>
                            <Icon name="camera-outline" size={width/10} color='#3E4DC8'/>
                        </Pressable>
                    </View>
                </View>
            </View>
            
            <View style={{flex:1,marginHorizontal:24,marginVertical:8}}>

                <View style={{marginVertical:18}}>
                    <Text style={{color:'#ffffff',fontSize:width/26,fontFamily:'Montserrat-Regular'}}>User Name</Text>
                    <TextInput
                        style={{color:'#ffffff',marginVertical:4,fontSize:width/22,borderBottomWidth:1,borderColor:"#ffffff",letterSpacing:3,fontFamily:'Montserrat-Medium'}}
                        placeholderTextColor="#b9b9b9"
                        placeholder="Your username"
                        value={userName}
                        onChangeText={set_userName}
                    />
                </View>

                <View style={{marginVertical:18}}>
                    <Text style={{color:'#ffffff',fontSize:width/26,fontFamily:'Montserrat-Regular'}}>User Impaired</Text>
                    <View>
                        <Picker 
                            selectedValue={selectedOption}
                            mode='dropdown'
                            style={{color:'#ffffff',marginVertical:4}}
                            onValueChange={(itemValue, itemIndex) =>
                                console.log(itemValue)
                            }>
                            <Picker.Item label="No" value="notImpaired" style={{fontSize:width/24}} />
                            <Picker.Item label="Yes" value="Impaired" style={{fontSize:width/24}} />
                        </Picker>
                        <View style={{backgroundColor:'#ffffff',height:1}}></View>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.touchableopacity} onPress={function_submitDetails}>
                    <View style={styles.touchableopacityView}>
                        <Text style={styles.submitDetails}>Complete</Text>
                        <Icon name="checkmark" size={width/18} color='#3E4DC8'/>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.lineView}>
                <View style={styles.line}></View>
            </View>

        </View>
    )
}