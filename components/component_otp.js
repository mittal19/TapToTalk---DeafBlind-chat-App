//https://github.com/tttstudios/react-native-otp-input
//here user enter otp 
//usernumber & requestId is got from previous phone number screen
//otp entered is checked by the api created ..check express backend for details
//if otp is correct navigate to user details screen else show error and re try.


/*
import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableOpacity, ToastAndroid, Keyboard, Animated, ActivityIndicator} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import styles,{width} from './styling/style_otp';
import LinearGradient from 'react-native-linear-gradient';

const debug = false;
const API = 'http://192.168.43.13:3000/verify';  //go in dev settings of phone by open developer mode by typing d in nodejs server then go to debug server host and enter ip adreess like 192.168.43.13:8081 . here 8081 is mobile port number. keep local host port number 3000
const timeout = 8000; //to set timeout .. how much time we will wait for api to send response of fetch request

export function component_otp({route,navigation}) 
{
  debug && console.log('-----');
  debug && console.log('component_otp.js - LOGS');
  
  const sizeAnimation = useRef(new Animated.Value(width/2)).current; //this animation will change width of image .. inital size of img is width/2
  const {userNumber,requestId} = route.params;       // getting info from previous screen
  
  const [keyboardStatus,setKeyboardStatus] = useState(false); //this variable will decide whether to hide or display the didnt receive otp button
  const [otp,set_otp] = React.useState('');         //this will store the user entered otp 
  const [activityIndicator,set_activityIndicator] = React.useState(false);
  const [retryWithin,set_retryWithin] = React.useState(60);    //this will store seconds remaining to retry to send otp

  useEffect(()=>
  {
    debug && console.log("component_otp.js - adding keyboard listeners");

    Keyboard.addListener("keyboardDidShow",_keyboardDidShow);  //adding listener for keyboars show/hide
    Keyboard.addListener("keyboardDidHide",_keyboardDidHide);

    let interval = setInterval(() => //set interval will perform the code within after 1 second
    {
      set_retryWithin(lastTimerCount =>  //set_rertywithin is the usestate declared above
        {
          lastTimerCount <= 1 && clearInterval(interval);   //  if timervalue is less than equal t0 1 then clear interval
          return lastTimerCount - 1;  //set the variable value to -1 of current value
        }
      );
    }, 1000);

    // cleanup function
    return()=>
    {
      debug && console.log("component_otp.js - removing keyboard listeners and retry interval");

      Keyboard.removeListener("keyboardDidShow",_keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide",_keyboardDidHide);
      clearInterval(interval);
    };
  },[]);

  const _keyboardDidShow = () =>  //this function will be called when keyboard show
  {
    debug && console.log("component_otp.js - showing keyboard");

    setKeyboardStatus(true);//now hide the didn't recieved otp button
    Animated.timing(sizeAnimation,{
      toValue:width/5,  //change size of img
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const _keyboardDidHide = () =>  //this function will be called when keyboard hide
  {
    debug && console.log("component_otp.js - hiding keyboard");

    setKeyboardStatus(false); //now show the didn't recieved otp button
    Animated.timing(sizeAnimation,{ //this will start changing width of img to original
      toValue:width/2,
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const function_otpNotRecieved=()=>        //this function gets executed when user press otp not recieved 
  {         
    debug && console.log("component_otp.js - otp not received button pressed");

    ToastAndroid.show('Enter phone number and Try Again',ToastAndroid.SHORT);       //showing toast
    navigation.goBack();      // going back to previous screen which is phonenumber component
  }

  const function_fetchwithtimeout = async(option={})=>  //this function will be called when we use fetch to verify otp
  {
    debug && console.log("components_otp.js - called fetch time out function");

    let final_timeout = timeout || 20000;   //if timeout is passed with option then set timeout to that else set timeout to 20000
    let timeout_err =  
    {
      requestId:'',
      response:'Timeout',
      status:408
    };//setting error object to display if time out occurs

    return new Promise(function(resolve,reject) //The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
    {
      fetch(API,option).then(resolve,reject);    //do fetch operation on given api with the passed options
      setTimeout(reject.bind(null,timeout_err),final_timeout); //settimeout will run reject.bind after timeout seconds
    });
  }


  const function_checkOtp=async()=>            //this function will be called when user clicks verify otp button
  {       
    debug && console.log("component_otp.js - otp check button pressed");
    
    if(otp.length==4)                //checking if otp enterd is 4 digit or not
    {
      try
      {
        debug && console.log("component_otp.js - checking otp");

        set_activityIndicator(true); //setting activityindicator to true . now indicator will show on.

        const resp = await function_fetchwithtimeout({   //this whole fetch will verfiy otp and other data recieved from otp component
                                method:'POST',
                                headers:{
                                  'Accept': 'application/json',
                                  'Content-type': 'application/json'
                                },
                                body:JSON.stringify(
                                {
                                  "requestId":requestId,
                                  "code":otp
                                })
                              });

        const res = await resp.json();        //the res will be a object containg status and event_id
        
        debug && console.log("component_otp.js - response recieved");
        debug && console.log(res);

        if(res.status==0&&res.event_id!=null)     //if these conditions are true we have successfully checked otp and its correct
        {
          debug && console.log("component_otp.js - correct otp");

          set_activityIndicator(false); //setting activityindicator to true . now indicator will show off.
          navigation.pop();          //poping current screen from stack
          navigation.navigate('EnterDetails',{userNumber});     //navigating to enter user details screen
        }
        else if(res.status==16&&res.error_text=="The code provided does not match the expected value")
        {
          debug && console.log("component_otp.js - wrong otp");

          set_activityIndicator(false); //setting activityindicator to true . now indicator will hide.
          ToastAndroid.show("Wrong OTP entered! Try again.",ToastAndroid.SHORT);     //wrong OTP  //re enter
        }
        else
        {
          debug && console.log("component_otp.js - some error occured while checking otp");

          set_activityIndicator(false); //setting activityindicator to true . now indicator will hide.
          ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);   //error occurred while checking otp
          navigation.goBack();     //go back n try again
        }
      }
      catch(error)
      {
        debug && console.log("component_otp.js - some error occured while checking otp");

        set_activityIndicator(false); //setting activityindicator to true . now indicator will hide.
        ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);
        navigation.goBack();  //error occurred . go back n try again
      }

      set_activityIndicator(false);
    }
    else
    {
      debug && console.log("component_otp.js - otp less than 4 digits");

      ToastAndroid.show('Enter all 4 digits',ToastAndroid.SHORT); //showing toast to enter proper otp.
    }
  }

  if(activityIndicator==true)  //show activity indicator while checking otp 
  {
    debug && console.log("component_otp.js - showing activity indicator");

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
            <View>
              {
                retryWithin>0?
                <View style={[styles.touchableopacitydidnotrecieved,{opacity:0.5}]}>
                  <Text style={styles.didnotrecieved}>Did not recieved the OTP?</Text>
                  <Text style={styles.didnotrecieved}>Retry after {retryWithin}.</Text>
                </View>
                :
                <TouchableOpacity onPress={function_otpNotRecieved} style={styles.touchableopacitydidnotrecieved}>
                  <Text style={styles.didnotrecieved}>Did not recieved the OTP?</Text>
                  <Text style={styles.didnotrecieved}>Retry now.</Text>
                </TouchableOpacity>
              }  
            </View>
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

*/


import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableOpacity, ToastAndroid, Keyboard, Animated, ActivityIndicator} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import styles,{width} from './styling/style_otp';
import LinearGradient from 'react-native-linear-gradient';

const debug = true;
const API = 'http://192.168.43.13:3000/verify';  //go in dev settings of phone by open developer mode by typing d in nodejs server then go to debug server host and enter ip adreess like 192.168.43.13:8081 . here 8081 is mobile port number. keep local host port number 3000
const timeout = 8000; //to set timeout .. how much time we will wait for api to send response of fetch request

export function component_otp({route,navigation}) 
{
  debug && console.log('-----');
  debug && console.log('component_otp.js - LOGS');
  
  const sizeAnimation = useRef(new Animated.Value(width/2)).current; //this animation will change width of image .. inital size of img is width/2
  const {userNumber,requestId} = route.params;       // getting info from previous screen
  
  const [keyboardStatus,setKeyboardStatus] = useState(false); //this variable will decide whether to hide or display the didnt receive otp button
  const [otp,set_otp] = React.useState('');         //this will store the user entered otp 
  const [activityIndicator,set_activityIndicator] = React.useState(false);
  const [retryWithin,set_retryWithin] = React.useState(60);    //this will store seconds remaining to retry to send otp

  useEffect(()=>
  {
    debug && console.log("component_otp.js - adding keyboard listeners");

    Keyboard.addListener("keyboardDidShow",_keyboardDidShow);  //adding listener for keyboars show/hide
    Keyboard.addListener("keyboardDidHide",_keyboardDidHide);

    let interval = setInterval(() => //set interval will perform the code within after 1 second
    {
      set_retryWithin(lastTimerCount =>  //set_rertywithin is the usestate declared above
        {
          lastTimerCount <= 1 && clearInterval(interval);   //  if timervalue is less than equal t0 1 then clear interval
          return lastTimerCount - 1;  //set the variable value to -1 of current value
        }
      );
    }, 1000);

    // cleanup function
    return()=>
    {
      debug && console.log("component_otp.js - removing keyboard listeners and retry interval");

      Keyboard.removeListener("keyboardDidShow",_keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide",_keyboardDidHide);
      clearInterval(interval);
    };
  },[]);

  const _keyboardDidShow = () =>  //this function will be called when keyboard show
  {
    debug && console.log("component_otp.js - showing keyboard");

    setKeyboardStatus(true);//now hide the didn't recieved otp button
    Animated.timing(sizeAnimation,{
      toValue:width/5,  //change size of img
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const _keyboardDidHide = () =>  //this function will be called when keyboard hide
  {
    debug && console.log("component_otp.js - hiding keyboard");

    setKeyboardStatus(false); //now show the didn't recieved otp button
    Animated.timing(sizeAnimation,{ //this will start changing width of img to original
      toValue:width/2,
      timing:0,
      useNativeDriver:false
    }).start();
  }

  const function_otpNotRecieved=()=>        //this function gets executed when user press otp not recieved 
  {         
    debug && console.log("component_otp.js - otp not received button pressed");

    ToastAndroid.show('Enter phone number and Try Again',ToastAndroid.SHORT);       //showing toast
    navigation.goBack();      // going back to previous screen which is phonenumber component
  }

  const function_fetchwithtimeout = async(option={})=>  //this function will be called when we use fetch to verify otp
  {
    debug && console.log("components_otp.js - called fetch time out function");

    let final_timeout = timeout || 20000;   //if timeout is passed with option then set timeout to that else set timeout to 20000
    let timeout_err =  
    {
      requestId:'',
      response:'Timeout',
      status:408
    };//setting error object to display if time out occurs

    return new Promise(function(resolve,reject) //The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
    {
      fetch(API,option).then(resolve,reject);    //do fetch operation on given api with the passed options
      setTimeout(reject.bind(null,timeout_err),final_timeout); //settimeout will run reject.bind after timeout seconds
    });
  }


  const function_checkOtp=async()=>            //this function will be called when user clicks verify otp button
  {       
    debug && console.log("component_otp.js - otp check button pressed");
    
    if(otp.length==4)                //checking if otp enterd is 4 digit or not
    {
      try
      {
        debug && console.log("component_otp.js - checking otp");

        set_activityIndicator(true); //setting activityindicator to true . now indicator will show on.

        const res = {status:0,event_id:4252};        //this is temporary line as we have commented out above otp checking code

        debug && console.log("component_otp.js - response recieved");
        debug && console.log(res);

        if(res.status==0&&res.event_id!=null)     //if these conditions are true we have successfully checked otp and its correct
        {
          debug && console.log("component_otp.js - correct otp");

          set_activityIndicator(false); //setting activityindicator to true . now indicator will show off.
          navigation.pop();          //poping current screen from stack
          navigation.navigate('EnterDetails',{userNumber});     //navigating to enter user details screen
        }
        else if(res.status==16&&res.error_text=="The code provided does not match the expected value")
        {
          debug && console.log("component_otp.js - wrong otp");

          set_activityIndicator(false); //setting activityindicator to true . now indicator will hide.
          ToastAndroid.show("Wrong OTP entered! Try again.",ToastAndroid.SHORT);     //wrong OTP  //re enter
        }
        else
        {
          debug && console.log("component_otp.js - some error occured while checking otp");

          set_activityIndicator(false); //setting activityindicator to true . now indicator will hide.
          ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);   //error occurred while checking otp
          navigation.goBack();     //go back n try again
        }
      }
      catch(error)
      {
        debug && console.log("component_otp.js - some error occured while checking otp");

        set_activityIndicator(false); //setting activityindicator to true . now indicator will hide.
        ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);
        navigation.goBack();  //error occurred . go back n try again
      }

      set_activityIndicator(false);
    }
    else
    {
      debug && console.log("component_otp.js - otp less than 4 digits");

      ToastAndroid.show('Enter all 4 digits',ToastAndroid.SHORT); //showing toast to enter proper otp.
    }
  }

  if(activityIndicator==true)  //show activity indicator while checking otp 
  {
    debug && console.log("component_otp.js - showing activity indicator");

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
            <View>
              {
                retryWithin>0?
                <View style={[styles.touchableopacitydidnotrecieved,{opacity:0.5}]}>
                  <Text style={styles.didnotrecieved}>Did not recieved the OTP?</Text>
                  <Text style={styles.didnotrecieved}>Retry after {retryWithin}.</Text>
                </View>
                :
                <TouchableOpacity onPress={function_otpNotRecieved} style={styles.touchableopacitydidnotrecieved}>
                  <Text style={styles.didnotrecieved}>Did not recieved the OTP?</Text>
                  <Text style={styles.didnotrecieved}>Retry now.</Text>
                </TouchableOpacity>
              }  
            </View>
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

