//https://github.com/tttstudios/react-native-otp-input
//here user enter otp 
//usernumber & requestId is got from previous phone number screen
//otp entered is checked by the api created ..check express backend for details
//if otp is correct navigate to user details screen else show error and re try.

import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableOpacity, ToastAndroid, Keyboard, Animated, ActivityIndicator} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import styles,{width,height} from './styling/style_otp';
import LinearGradient from 'react-native-linear-gradient';

export function component_otp({route,navigation}) 
{
  useEffect(()=>
  {
    Keyboard.addListener("keyboardDidShow",_keyboardDidShow);
    Keyboard.addListener("keyboardDidHide",_keyboardDidHide);

    return()=>
    {
      Keyboard.removeListener("keyboardDidShow",_keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide",_keyboardDidHide);
    };
  },[]);

  const [keyboardStatus,setKeyboardStatus] = useState(false);

  const sizeAnimation = useRef(new Animated.Value(width/2)).current;

  const _keyboardDidShow = () => 
  {
    setKeyboardStatus(true);
    Animated.timing(sizeAnimation,{
      toValue:width/5,
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const _keyboardDidHide = () => 
  {
    setKeyboardStatus(false);
    Animated.timing(sizeAnimation,{
      toValue:width/2,
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const {userNumber,requestId} = route.params;       // getting info from previous screen
  const [otp,set_otp] = React.useState('');         //this will store the user entered otp 
  const [verifying,set_verifying] = React.useState(false);

  const function_otpNotRecieved=()=>        //this function gets executed when user press otp not recieved 
  {         
    ToastAndroid.show('Enter phone number and Try Again',ToastAndroid.SHORT);       //showing toast
    navigation.goBack();      // going back to previous screen which is phonenumber component
  }

  const function_checkOtp=async()=>            //this function will be called when user clicks Next button
  {       
    if(otp.length==4)                //checking if otp enterd is 4 digit or not
    {
      try
      {
        set_verifying(true);

        /*const returnedData = await fetch('http://192.168.43.13:3000/verify',{   //this whole fetch will verfiy otp and other data recieved from otp component
                                method:'POST',
                                headers:{
                                  'Accept': 'application/json',
                                  'Content-type': 'application/json'
                                },
                                setTimeout:500,
                                body:JSON.stringify(
                                {
                                  "requestId":requestId,
                                  "code":otp
                                })
                              });

        const res = await returnedData.json();        //the res will be a object containg status and event_id
        */
        const res = {status:0,event_id:4252};        //this is temporary line as we have commented out above otp checking code
        if(res.status==0&&res.event_id!=null)     //if these conditions are true we have successfully checked otp and its correct
        {
          navigation.pop();          //poping current screen from stack
          navigation.navigate('EnterDetails',{userNumber});     //navigating to enter user details screen
        }
        else if(res.status==16&&res.error_text=="The code provided does not match the expected value")
        {
          ToastAndroid.show("Wrong OTP entered! Try again.",ToastAndroid.SHORT);     //wrong OTP  //re enter
        }
        else
        {
          ToastAndroid.show("Some error occured! Try again,",ToastAndroid.SHORT);   //error occurred while checking otp
          navigation.goBack();     //go back n try again
        }

      }
      catch(error)
      {
        ToastAndroid.show("Some error occurred! Try again,",ToastAndroid.SHORT);
        navigation.goBack();  //error occurred . go back n try again
      }

      set_verifying(false);
    }
    else
    {
      ToastAndroid.show('Enter all 4 digits',ToastAndroid.SHORT); //showing toast to enter proper otp.
    }
  }

  if(verifying==true)
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
        <ActivityIndicator size="large" color="#3E4DC8"/>
      </View>
    );
  }

  return(
    <View style={styles.container}>
      
      <View style={styles.otpimageView}>
        <Animated.Image source={require('../res/img/otp.png')} style={[styles.otpimageBig,{height:sizeAnimation,width:sizeAnimation}]}/>
      </View>

      <View style={styles.midView}>
        
        <View style={styles.otpenterView}>

          <Text style={styles.otpverification}>OTP Verification</Text>
          
          <View style={keyboardStatus?styles.smallenterotpheading:styles.bigenterotpheading}>
            <Text style={styles.otpsentto}>Enter OTP sent to </Text>
            <Text style={[styles.otpsentto,{fontWeight:'bold'}]}>+91 {userNumber}</Text>
          </View>
          
          <OTPInputView
            style={styles.otpinputView} 
            pinCount={4}
            keyboardType="phone-pad"
            codeInputFieldStyle={styles.codeInputFieldStyle}
            codeInputHighlightStyle={styles.codeInputHighlightStyle}
            onCodeFilled = {(code) => {
              set_otp(code);
            }}
          />
          
          {
            keyboardStatus?
            <View></View>
            :
            <TouchableOpacity onPress={function_otpNotRecieved} style={styles.touchableopacitydidnotrecieved}>
              <Text style={styles.didnotrecieved}>Did not recieved the OTP?</Text>
            </TouchableOpacity>
          }
          
        </View>

        <View style={keyboardStatus?styles.touchableopacityViewKeyboardShow:styles.touchableopacityViewKeyboardHide}>
          <LinearGradient colors={["#3E4DC880", "#3E4DC8FF", "#3E4DC8FF", "#3E4DC8FF"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.verifyotpGradient} >
            <TouchableOpacity style={styles.touchableopacity} onPress={function_checkOtp} >
              <View style={styles.touchableopacityView}>
                <Text style={styles.verifyotp}>Verify OTP</Text>
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