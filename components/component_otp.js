//https://github.com/tttstudios/react-native-otp-input
//here user enter otp 
//usernumber & requestId is got from previous phone number screen
//otp entered is checked by the api created ..check express backend for details
//if otp is correct navigate to user details screen else show error and re try.

import React,{useEffect,useState,useRef} from 'react';
import {View,Text,TouchableOpacity,ToastAndroid,Image,Keyboard,Animated, Easing,KeyboardAvoidingView} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {styles} from './styling/style_otp';
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

  const sizeAnimation = useRef(new Animated.Value(224)).current;

  const _keyboardDidShow = () => 
  {
    setKeyboardStatus(true);
    Animated.timing(sizeAnimation,{
      toValue:80,
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const _keyboardDidHide = () => 
  {
    setKeyboardStatus(false);
    Animated.timing(sizeAnimation,{
      toValue:224,
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const {userNumber,requestId} = route.params;       // getting info from previous screen
  const [otp,set_otp] = React.useState('');         //this will store the user entered otp 

  const function_otpNotRecieved=()=>        //this function gets executed when user press otp not recieved 
  {         
    ToastAndroid.show('Enter phone number and Try Again',ToastAndroid.LONG);       //showing toast
    navigation.goBack();      // going back to previous screen which is phonenumber component
  }

  const function_checkOtp=async()=>            //this function will be called when user clicks Next button
  {       
    if(otp.length==4)                //checking if otp enterd is 4 digit or not
    {
      try
      {
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
          ToastAndroid.show("Wrong OTP entered! Try again.",ToastAndroid.LONG);     //wrong OTP  //re enter
        }
        else
        {
          ToastAndroid.show("Some error occured! Try again,",ToastAndroid.LONG);   //error occurred while checking otp
          navigation.goBack();     //go back n try again
        }

      }
      catch(error)
      {
        ToastAndroid.show("Some error occurred! Try again,",ToastAndroid.LONG);
        navigation.goBack();  //error occurred . go back n try again
      }
    }
    else
    {
      ToastAndroid.show('Enter all 4 digits',ToastAndroid.LONG); //showing toast to enter proper otp.
    }
  }

  return(
    <View style={{backgroundColor:"#ffffff",flex:1}}>
      
      <View style={{justifyContent:'center',alignItems:'center',marginVertical:40}}>
        <Animated.Image source={require('./res/otp.png')} style={[styles.otpimageBig,{height:sizeAnimation,width:sizeAnimation}]}/>
      </View>

      <View style={{flex:2}}>
        
        <View style={{alignItems:'center'}}>
          <Text style={{fontSize:28}}>OTP Verification</Text>
          <View style={keyboardStatus?styles.smallenterotpheading:styles.bigenterotpheading}>
            <Text style={{fontSize:16}}>Enter OTP sent to </Text>
            <Text style={{fontSize:16,fontWeight:'bold'}}>+91 {userNumber}</Text>
          </View>
          
          <OTPInputView
            style={{width: 300, height: 60}} 
            pinCount={4}
            keyboardType="phone-pad"
            codeInputFieldStyle={{width:48,height:48,borderWidth:0,borderBottomWidth:2,color:'#000000',borderColor:'#3E4DC8',fontSize:24}}
            codeInputHighlightStyle={{borderColor: "#000000"}}
            onCodeFilled = {(code) => {
              set_otp(code);
            }}
          />
          
          {
            keyboardStatus?
            <View></View>
            :
            <TouchableOpacity onPress={function_otpNotRecieved} style={{marginVertical:32}}>
            <Text style={{fontSize:18,color:"#3E4DC8"}}>Did not recieved the OTP?</Text>
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