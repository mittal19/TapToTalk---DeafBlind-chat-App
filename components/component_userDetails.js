/*
Here username , user profile img and usernumber(from previous screen) are sent to login dispatch function written on app.js
Modal is used to show pop up when user choose to update profile
*/
import React,{useEffect} from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,Modal,Pressable,Image,Keyboard,ActivityIndicator} from 'react-native';
import {AuthContext} from '../helpers/context';
import styles,{width,height} from './styling/style_userDetails';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

const debug = false;
const timeout = 10000; //to set timeout .. how much time we will wait for firebase to store profile in storage

export function component_userDetails({route,navigation})
{
    debug && console.log("-----");
    debug && console.log("component_userDetails.js - LOGS");
    
    const {logIn} = React.useContext(AuthContext);      //login function created at App.js 

    const {userNumber} = route.params;        //getting info from previous screen
     
    const [userName,set_userName] = React.useState('');         //will hold name
    const [userState,set_userState] = React.useState('notImpaired');    //will hold state - impaired or not
    const [userProfile,set_userProfile] = React.useState('default');          //will hold location of profile image in phone
    const [userProfileName,set_userProfileName] = React.useState('defaultProfile.png');  //hold name of profile
    const [selectedOption, set_selectedOption] =   React.useState();        
    const [modalVisible, set_modalVisible] = React.useState(false);          //will decide whether to show modal or not
    const [activityIndicator,set_activityIndicator] = React.useState(false);
    const [keyboardStatus, setKeyboardStatus] = React.useState(false); //this variable will decide whether to hide or display the user impaired and complete button

    useEffect(() => 
    {
        debug && console.log("component_userDetails.js - adding keyboard listeners");

        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);  //adding listener for keyboars show/hide
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => 
        {
        Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);


    const _keyboardDidShow = () => setKeyboardStatus(true); //this function will be called when keyboard show

    const _keyboardDidHide = () => setKeyboardStatus(false); //this function will be called when keyboard hide

    const function_saveProfile = async()=>  //this function will be called to save profile in firebase it has time out feature
    {
        debug && console.log("components_userNumber.js - called save profile function with timeout");

        let temp_timeout = timeout || 20000;   //if timeout is passed with option then set timeout to that else set timeout to 20000
        let timeout_err =  
        {
            requestId:'',
            response:'Timeout',
            status:408
        };//setting error object to display if time out occurs

        return new Promise(function(resolve,reject) //The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
        {
            storage().ref(userProfileName).putFile(userProfile).then(resolve,reject);  
            setTimeout(reject.bind(null,timeout_err),temp_timeout); //settimeout will run reject.bind after timeout seconds
        });
    }

    const function_submitDetails =async()=>             //this function will be called when user clicks submit details button
    { 
        debug && console.log("component_userDetails.js - complete button clicked");

        set_activityIndicator(true);  //show indicator while logging in

        if(userName.length<1||userState.length<1)        //checking if all details are entered
        {
            debug && console.log("component_userDetails.js - username not entered");
            
            ToastAndroid.show("Enter user Name",ToastAndroid.SHORT);               //if not show error
        }
        else     //if all details are entered
        {  
            try
            {
                if(userProfile!='default')
                {
                    debug && console.log("component_userDetails.js - as user profile is not default store it in firebase storage");
                       
                    var resp = await function_saveProfile();  //calling this function ..it will have time out feature

                    debug && console.log("component_userDetails.js - response after storing profile");
                    debug && console.log(resp);

                    if(resp["state"]=="success")
                    { 
                        debug && console.log("component_userDetails.js - storing success");
                        debug && console.log("component_userDetails.js - calling login function");
                        
                        var ProfileURL = await storage().ref(userProfileName).getDownloadURL();   ///get url of profile img stored in firebase

                        logIn(userNumber,userName,userState,ProfileURL);           //call function created in App.js using memo
                    } 
                    else
                    {
                        debug && console.log("component_userDetails.js - error occurred while storing profile");
                    
                        ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);
                        navigation.pop();
                    }
                }
                else
                {
                    debug && console.log("component_userDetails.js - as profile is default so no need to store profile in firebase storage");
                    debug && console.log("component_userDetails.js - calling login function");

                    logIn(userNumber,userName,userState,userProfileName);           //call function created in App.js using memo
                }
                
            }
            catch(err)
            {
                debug && console.log("component_userDetails.js - some error ocurred while loggin in.");
                debug && console.log(err);
                
                ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);
                navigation.pop();
            }
        }

        set_activityIndicator(false);
    }

    const function_openGallery=async()=>  //called when choose from gallery button clicked
    {
        debug && console.log("component_userDetails.js - open gallery button clicked");
        
        try
        {
            set_modalVisible(!modalVisible);  //first hide the modal
            await ImagePicker.openPicker({
                width:500,
                height:500,
                cropping:true
            }).then(image =>
                {
                    var uri = image["path"];    //uri will have path of image in phone
                    var nameoffile = uri.substring(uri.lastIndexOf('/')+1);    //getting name of file from uri
                    
                    debug && console.log("component_userDetails.js - path of selected img");
                    debug && console.log(uri);
                    debug && console.log("component_userDetails.js - name of selected image");
                    debug && console.log(nameoffile);
                    
                    set_userProfile(uri);
                    set_userProfileName(nameoffile);
                });
        }
        catch(err)
        {
            debug && console.log("component_userDetails.js - error occured while selectiong profile");
            debug && console.log(err);
        }
    }

    const function_openCamera=async()=>  //called when user selects open from camera
    {
        debug && console.log("component_userDetails.js - open camera button clicked");

        try
        {
            set_modalVisible(!modalVisible);
            await ImagePicker.openCamera({
                widht:500,
                height:500,
                cropping:true
            }).then(image =>
                {
                    var uri = image["path"];  //uri will have image path - path is where img is stored in phone
                    var nameoffile = uri.substring(uri.lastIndexOf('/')+1);    //get name of image
                    
                    debug && console.log("component_userDetails.js - path of img");
                    debug && console.log(uri);
                    debug && console.log("component_userDetails.js - name of img");
                    debug && console.log(nameoffile);

                    set_userProfile(uri);  //settig path 
                    set_userProfileName(nameoffile);   //setting name
                });
        }
        catch(err)
        {
            debug && console.log("component_userDetails.js - error occured while taking picture from camera");
            debug && console.log(err);
        }
    }

    const function_removeSelected=async()=> //called when remove profile is selected from modal view
    {
        debug && console.log("component_userDetails.js - removing selected profile image");

        set_modalVisible(!modalVisible);
        set_userProfile('default');
        set_userProfileName('defaultProfile.png');
    }

    if(activityIndicator==true)  //show activity indicator when logging userin
    {
        debug && console.log("component_userDetails.js - showing activity indicator");

        return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#3E4DC8'}}>
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        );
    }

    return(
        <View style={styles.container}>
        
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => 
                {
                    set_modalVisible(!modalVisible);
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
                                onPress={() => set_modalVisible(!modalVisible)}>
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
                                <Pressable onPress={()=>set_modalVisible(true)} style={[styles.profilePressable,{transform:[{rotate:'30deg'}]}]}>
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
                            <Pressable onPress={()=>set_modalVisible(true)} style={styles.profilePressable}>
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