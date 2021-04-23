//here we are taking phone number input from user
//then sending otp using fetch .. api is created...see expressbackend for api details.
//if otp is sent then navigate to otp screen

import React, { useState, useEffect, useRef } from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,ActivityIndicator,Image,Keyboard,Animated} from 'react-native';
import styles,{width,height} from './styling/style_userNumber';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';



export function component_userNumber({navigation})
{
  const fadeAnim = useRef(new Animated.Value(height/2)).current;

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

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const _keyboardDidShow = () => 
  {
    setKeyboardStatus(true);
    Animated.timing(fadeAnim,{
      toValue:0,
      duration:150,
      useNativeDriver:false,
    }).start();
  }
  const _keyboardDidHide = () => 
  {
    setKeyboardStatus(false);
    Animated.timing(fadeAnim,{
      toValue:height/2,
      duration:0,
      useNativeDriver:false
    }).start();
  }

  const [userNumber,set_userNumber] = React.useState('');    // state for holding phone number
  const [sendingOtp,set_sendingOtp] = React.useState(false);    // state for showing activity indicator

  const function_sendOtp = async()=>        //function which will be called when user clicks on send otp
  {

    if( !(/^\d+$/.test(userNumber)) || userNumber.length<10 )       //checking validity of phone number
    {  
      ToastAndroid.show("Enter a number with 10 digits only!", ToastAndroid.SHORT);    //showing toast if entered number is not properly formatted
    }
    else   //if number is formatted right
    {
      try{
        set_sendingOtp(true);     //setting activityindicator to true . now indicator will show on.

        /*const temp = await fetch('http://192.168.43.13:3000/request',{   //go in dev settings of phone by open developer mode by typing d in nodejs server then go to debug server host and enter ip adreess like 192.168.43.13:8081 . here 8081 is mobile port number. keep local host port number 3000
                            method:'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-type': 'application/json'
                            },
                            body: JSON.stringify(
                              {
                                "number":"+91"+userNumber  // instead of hardcode 9027504141 use like this -> "+91"+userPhone
                              })
                            });
        const requestId= await temp.json();
        console.log(requestId);*/
        const requestId = 24325;   //temporary  will be removed when above code is uncommented
        ToastAndroid.show("OTP sent",ToastAndroid.SHORT);  //otp sent success
        Keyboard.dismiss();
        set_sendingOtp(false);     //now setting activityindicator to false n thus hiding it.
        navigation.navigate('OTP',{userNumber:userNumber,requestId:requestId["requestId"]});      //navigating to OTP screen. passing some information like phonenumber and requestID to next screen
      }
      catch(err)     //error catched if some
      { 
        console.log(err);            
        set_sendingOtp(false);        //hiding activity indicator
        ToastAndroid.show("Some error occurred. Try again.",ToastAndroid.SHORT);  //toasting error
      }
    }
  }

  if(sendingOtp==true)           //if otp is not sent then show activity indicator 
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
        <ActivityIndicator size="large" color="#3E4DC8"/>
      </View>
    );
  }

  
//in image 376 and 275 is width and height of logo   
  return(
    <View style={styles.container}>
        <View style={{}}>
          <Animated.View style={[styles.upperCircle,{height:fadeAnim}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#C72FF8FF","#5264F9FF"]} style={styles.upperCircleGradient} />  
            }
          </Animated.View>

          <Animated.View style={[styles.midCircle,{height:fadeAnim}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#5264F9BF","#3E4DC8E6"]} style={styles.midCircleGradient} />  
            }
          </Animated.View>

          <Animated.View style={[styles.lowerCircle,{height:fadeAnim}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#5264F9FF","#3AF9EFFF"]} style={styles.lowerCircleGradient} />  
            }
          </Animated.View>
          
          {
            keyboardStatus?
            <View></View>
            :
            <View style={styles.midView}>
              <Image style={styles.logo} source={require('./res/TapToTalk_5.png')}/>    
              <Text style={styles.welcome}>Welcome</Text>
            </View>
          }
        </View>
    
        {
          keyboardStatus?
          <View style={styles.keyboardView}></View>
          :
          <View></View>
        }
        <View style={styles.signInView}>

          <Text style={styles.signIntext}>Sign up</Text>

          <View style={styles.phonenumberView}>
            
            <Text style={styles.phonenumberheading}>Phone Number</Text>
            
            <View style={styles.phonenumberhorizontalView}>
              
              <TextInput
                style={styles.phonenumber}
                keyboardType='phone-pad'
                value={userNumber}
                onChangeText={set_userNumber}
                maxLength={10}
                />
                {
                  (userNumber.length==10)?
                  <View style={styles.iconView}>
                    <Icon name="checkcircle" size={width/18} color="#C72FF8FF" />
                  </View>
                  :
                  <View></View>
                }            
            </View>

          </View>

          <View style={{}}>
            
            <LinearGradient colors={["#3E4DC880", "#3E4DC8FF", "#3E4DC8FF", "#3E4DC8FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.getotpGradient} >
              <TouchableOpacity style={styles.touchableopacity} onPress={function_sendOtp} >
                <View style={styles.touchableopacityView}>
                  <Text style={styles.getotp}>Get OTP</Text>
                  <Icon name="arrowright" size={width/18} color="#ffffff"/>
                </View>
              </TouchableOpacity>
            </LinearGradient>   
          
          </View>
        </View>

      <View style={styles.lineView}>
        <View style={styles.line}></View>
      </View>

    </View>
  );
}