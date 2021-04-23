//Here usesr details are taken and then stored in local storage
//Then logIn Memo function created in App.js is called with the details passed.

import React,{useEffect} from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,Modal,Pressable,Image,Keyboard} from 'react-native';
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
    const [userState,set_userState] = React.useState('notImpaired');    //will hold status
    const [userProfile,set_userProfile] = React.useState('default');
    const [userProfileName,set_userProfileName] = React.useState('defaultProfile.png');
    const [selectedOption, set_selectedOption] =   React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);

    useEffect(() => 
    {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => 
        {
        Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const [keyboardStatus, setKeyboardStatus] = React.useState(false);

    const _keyboardDidShow = () => setKeyboardStatus(true);

    const _keyboardDidHide = () => setKeyboardStatus(false);

    const function_submitDetails =async()=>             //this function will be called when user clicks submit details button
    { 
        try
        {
            if(userName.length<1||userState.length<1)        //checking if all details are entered
            {
                ToastAndroid.show("Enter all details",ToastAndroid.SHORT);               //if not show error
            }
            else     //if all details are entered
            {  
                try
                {
                    var resp=null;
                    if(userProfile!='default')
                    {
                        resp = await storage().ref(userProfileName).putFile(userProfile);
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
                    else
                    {
                        await AsyncStorage.setItem('userNumber',userNumber);            //set all details in local storage of phone
                        await AsyncStorage.setItem('userName',userName);
                        await AsyncStorage.setItem('userState',userState);
                        await AsyncStorage.setItem('userProfile',userProfile);
                        logIn(userNumber,userName,userState,userProfile);           //call function created in App.js using memo
                    }
                    
                }
                catch(err)
                {
                    console.log(err);
                    ToastAndroid.show("Some error occured.Try again!",ToastAndroid.SHORT);
                }
            }
        }
        catch(e)
        {
            console.log(e);
            ToastAndroid.show("Some error occurred! Try again",ToastAndroid.SHORT);
            navigation.pop();
        }
    }

    const function_openGallery=async()=>
    {
        try
        {
            setModalVisible(!modalVisible);
            await ImagePicker.openPicker({
                width:500,
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
                    //navigation.navigate('Save Profile',{userNumber,userName,userStatus,userProfile,uri,nameoffile});
                });
            
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const function_openCamera=async()=>
    {
        try
        {
            setModalVisible(!modalVisible);
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
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const function_removeSelected=async()=>
    {
        setModalVisible(!modalVisible);
        set_userProfile('default');
        set_userProfileName('defaultProfile.png');
    }

    return(
        <View style={styles.container}>
        
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => 
                {
                    setModalVisible(!modalVisible);
                }}>

                <View style={styles.modalandpressable}>
                   
                    <View style={styles.modalinside}>
                        
                        <View style={{flex:2}}>
                            <Pressable
                                style={styles.modalandpressable}
                                onPress={() => function_openGallery()}>
                                <Text style={[styles.modaltext,{fontFamily:'Montserrat-SemiBold'}]}>Choose from gallery</Text>
                            </Pressable>
                            <Pressable
                                style={styles.modalandpressable}
                                onPress={() => function_openCamera()}>
                                <Text style={[styles.modaltext,{fontFamily:'Montserrat-SemiBold'}]}>Take from camera</Text>
                            </Pressable>
                        </View>

                        <View style={{flex:1,flexDirection:'row'}}>
                            {
                                userProfileName=='defaultProfile.png'?
                                <View></View>
                                :
                                <Pressable
                                    style={styles.modalandpressable}
                                    onPress={() => function_removeSelected()}>
                                    <Text style={styles.modaltext}>Remove</Text>
                                </Pressable>
                            }
                            <Pressable
                                style={styles.modalandpressable}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.modaltext}>Cancel</Text>
                            </Pressable>
                        </View>
                        
                    </View>
                </View>
            </Modal>

            {
                userProfileName=='defaultProfile.png'?
                    <View style={styles.upperView}>
                        <View style={styles.shapesWithOut}>
                            <View style={styles.shapesWithIn}>
                                <Pressable onPress={()=>setModalVisible(true)} style={[styles.profilePressable,{transform:[{rotate:'30deg'}]}]}>
                                    <Icon name="camera-outline" size={width/10} color='#3E4DC8'/>    
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={styles.upperView}>
                        <View style={styles.shapesWithoutOut}>
                            <View style={styles.shapesWithoutIn}>
                            </View>
                        </View>
                        <View>
                            <Pressable onPress={()=>setModalVisible(true)} style={styles.profilePressable}>
                                <Image borderRadius={50} source={{width:height/4,height:height/4,borderRadius:height/16,uri:userProfile}}/>    
                            </Pressable>     
                        </View>
                    </View>
            }

            

            <View style={styles.midView}>

                <View style={styles.textView}>
                    <Text style={styles.userheading}>User Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholderTextColor="#b9b9b9"
                        placeholder="Your username"
                        value={userName}
                        onChangeText={set_userName}
                    />
                </View>

                {
                    !keyboardStatus?
                    <View style={styles.impairedView}>
                        <Text style={styles.imapairedHead}>User Impaired</Text>
                        <View>
                            <Picker 
                                selectedValue={selectedOption}
                                mode='dropdown'
                                style={styles.pickerView}
                                onValueChange={(itemValue, itemIndex) =>
                                    set_userState(itemValue)
                                }>
                                <Picker.Item label="No" value="notImpaired" style={styles.pickerItem} />
                                <Picker.Item label="Yes" value="Impaired" style={styles.pickerItem} />
                            </Picker>
                            <View style={styles.pickerLine}></View>
                        </View>
                    </View>
                    :
                    <View></View>
                }

                {
                    !keyboardStatus?           
                    <TouchableOpacity style={styles.touchableopacity} onPress={function_submitDetails}>
                        <View style={styles.touchableopacityView}>
                            <Text style={styles.submitDetails}>Complete</Text>
                            <Icon name="checkmark" size={width/18} color='#3E4DC8'/>
                        </View>
                    </TouchableOpacity>
                    :
                    <View></View>
                }
            </View>

            <View style={styles.lineView}>
                <View style={styles.line}></View>
            </View>

        </View>
    )
}