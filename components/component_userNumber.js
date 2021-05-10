//here we are taking phone number input from user
//then sending otp using fetch .. api is created...see express-server for api details.
//if otp is sent then navigate to otp screen

/*
import React, { useState, useEffect, useRef } from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,ActivityIndicator,Image,Keyboard,Animated} from 'react-native';
import styles,{width,height} from './styling/style_userNumber';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

const debug = false;
const API = 'http://192.168.43.13:3000/request'; //go in dev settings of phone by open developer mode by typing d in nodejs server then go to debug server host and enter ip adreess like 192.168.43.13:8081 . here 8081 is mobile port number. keep local host port number 3000
const timeout = 8000; //to set timeout .. how much time we will wait for api to send response of fetch request

export function component_userNumber({navigation})
{
  debug && console.log("-----");
  debug && console.log("component_userNumber.js - LOGS");

  const Anim_changePosition = useRef(new Animated.Value(height/2)).current;  //animation is created which change height of shapes,initial height of shapes is half of mobile screen height

  const [keyboardStatus, setKeyboardStatus] = useState(false); //this variable will decide whether to hide or display the shapes and icon
  const [userNumber,set_userNumber] = React.useState('');    // state for holding phone number
  const [activityIndicator,set_activityIndicator] = React.useState(false);    // state for showing activity indicator while sending otp

  useEffect(() => 
  {
    debug && console.log("component_userNumber.js - adding keyboard listeners");

    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);  //adding listener for keyboars show/hide
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => 
    {
      debug && console.log("component_userNumber.js - removing keyboard listeners");

      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () =>  //this function will be called when keyboard show
  {
    debug && console.log("component_userNumber.js - showing keyboard");

    Animated.timing(Anim_changePosition,{ // this will start to change height of shapes to 0 in 200ms
      toValue:0,
      duration:200,
      useNativeDriver:false,
    }).start();

    setKeyboardStatus(true); //now hide the shapes
  }

  const _keyboardDidHide = () => //this function will be called when keyboard hide
  {
    debug && console.log("component_userNumber.js - hiding keyboard");

    setKeyboardStatus(false);  //now show shapes

    Animated.timing(Anim_changePosition,{  //this will start changing height of shapes to original
      toValue:height/2,
      duration:0,
      useNativeDriver:false
    }).start();
  }

  const function_fetchwithtimeout = async(option={})=>  //this function will be called when we use fetch to get otp
  {
    debug && console.log("components_userNumber.js - called fetch time out function");

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

  const function_sendOtp = async()=> //function which will be called when user clicks on send otp
  {
    debug && console.log('component_userNumber.js - send otp button clicked');

    if(!(/^\d+$/.test(userNumber)))       //checking validity of phone number
    {  
      debug && console.log('component_userNumber.js - invalid digits in phone number entered');
      
      ToastAndroid.show("Phone number not formatted properly!", ToastAndroid.SHORT);    //showing toast if entered number is not properly formatted
    }
    else if(userNumber.length<10)
    {
      debug && console.log('component_userNumber.js - invalid length of phone number entered');
      
      ToastAndroid.show("Enter a number with 10 digits only!", ToastAndroid.SHORT);    //showing toast if entered number is not properly formatted
    }
    else   //if number is formatted right
    {
      try
      {
        debug && console.log('component_userNumber.js - sending otp ');
      
        set_activityIndicator(true);     //setting activityindicator to true . now indicator will show on.

        const resp = await function_fetchwithtimeout({  //calling function 
                                                  method:'POST',
                                                  headers: 
                                                  {
                                                    'Accept': 'application/json',
                                                    'Content-type': 'application/json'
                                                  },
                                                  body: JSON.stringify(
                                                  {
                                                    "number":"+91"+userNumber
                                                  })
                                                }
                                            );

        const requestId= await resp.json();

        debug && console.log('component_userNumber.js - otp sent ');
        debug && console.log(requestId);

        ToastAndroid.show("OTP sent",ToastAndroid.SHORT);  //otp sent success

        Keyboard.dismiss(); //dismissing keyboard before moving to next otp screen ...without this there is a lag .. keyboard will show for some miliseconds in otp screen
        set_activityIndicator(false);     //now setting activityindicator to false n thus hiding it.
        navigation.navigate('OTP',{userNumber:userNumber,requestId:requestId["requestId"]});      //navigating to OTP screen. passing some information like phonenumber and requestID to next screen
      }
      catch(err)     //error catched if some
      { 
        debug && console.log('component_userNumber.js - error while sending otp');
        debug && console.log(err);

        set_activityIndicator(false);        //hiding activity indicator
        ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);  //toasting error
      }
    }
  }

  if(activityIndicator==true)  //show activity indicator while sending otp 
  {
    debug && console.log("component_userNumber.js - showing activity indicator");

    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
        <ActivityIndicator size="large" color="#3E4DC8"/>
      </View>
    );
  }

  return(
    <View style={styles.container}>
        <View>
          <Animated.View style={[styles.upperCircle,{height:Anim_changePosition}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#C72FF8FF","#5264F9FF"]} style={styles.upperCircleGradient} />  
            }
          </Animated.View>

          <Animated.View style={[styles.midCircle,{height:Anim_changePosition}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#5264F9BF","#3E4DC8E6"]} style={styles.midCircleGradient} />  
            }
          </Animated.View>

          <Animated.View style={[styles.lowerCircle,{height:Anim_changePosition}]}>
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
              <Image style={styles.logo} source={require('../res/img/TapToTalk_5.png')}/>    
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
*/







import React, { useState, useEffect, useRef } from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,ActivityIndicator,Image,Keyboard,Animated} from 'react-native';
import styles,{width,height} from './styling/style_userNumber';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

const debug = false;
const API = 'http://192.168.43.13:3000/request'; //go in dev settings of phone by open developer mode by typing d in nodejs server then go to debug server host and enter ip adreess like 192.168.43.13:8081 . here 8081 is mobile port number. keep local host port number 3000
const timeout = 8000; //to set timeout .. how much time we will wait for api to send response of fetch request

export function component_userNumber({navigation})
{
  debug && console.log("-----");
  debug && console.log("component_userNumber.js - LOGS");

  const Anim_changePosition = useRef(new Animated.Value(height/2)).current;  //animation is created which change height of shapes,initial height of shapes is half of mobile screen height

  const [keyboardStatus, setKeyboardStatus] = useState(false); //this variable will decide whether to hide or display the shapes and icon
  const [userNumber,set_userNumber] = React.useState('');    // state for holding phone number
  const [activityIndicator,set_activityIndicator] = React.useState(false);    // state for showing activity indicator while sending otp

  useEffect(() => 
  {
    debug && console.log("component_userNumber.js - adding keyboard listeners");

    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);  //adding listener for keyboars show/hide
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => 
    {
      debug && console.log("component_userNumber.js - removing keyboard listeners");

      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () =>  //this function will be called when keyboard show
  {
    debug && console.log("component_userNumber.js - showing keyboard");

    Animated.timing(Anim_changePosition,{ // this will start to change height of shapes to 0 in 200ms
      toValue:0,
      duration:200,
      useNativeDriver:false,
    }).start();

    setKeyboardStatus(true); //now hide the shapes
  }

  const _keyboardDidHide = () => //this function will be called when keyboard hide
  {
    debug && console.log("component_userNumber.js - hiding keyboard");

    setKeyboardStatus(false);  //now show shapes

    Animated.timing(Anim_changePosition,{  //this will start changing height of shapes to original
      toValue:height/2,
      duration:0,
      useNativeDriver:false
    }).start();
  }

  const function_fetchwithtimeout = async(option={})=>  //this function will be called when we use fetch to get otp
  {
    debug && console.log("components_userNumber.js - called fetch time out function");

    let timeout = option.timeout || 20000;   //if timeout is passed with option ehtn set timeout to that else set timeout to 20000
    let timeout_err =  
    {
      requestId:'',
      response:'Timeout',
      status:408
    };//setting error object to display if time out occurs

    return new Promise(function(resolve,reject) //The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
    {
      fetch(API,option).then(resolve,reject);    //do fetch operation on given api with the passed options
      setTimeout(reject.bind(null,timeout_err),timeout); //settimeout will run reject.bind after timeout seconds
    });
  }

  const function_sendOtp = async()=> //function which will be called when user clicks on send otp
  {
    debug && console.log('component_userNumber.js - send otp button clicked');

    if(!(/^\d+$/.test(userNumber)))       //checking validity of phone number
    {  
      debug && console.log('component_userNumber.js - invalid digits in phone number entered');
      
      ToastAndroid.show("Phone number not formatted properly!", ToastAndroid.SHORT);    //showing toast if entered number is not properly formatted
    }
    else if(userNumber.length<10)
    {
      debug && console.log('component_userNumber.js - invalid length of phone number entered');
      
      ToastAndroid.show("Enter a number with 10 digits only!", ToastAndroid.SHORT);    //showing toast if entered number is not properly formatted
    }
    else   //if number is formatted right
    {
      try
      {
        debug && console.log('component_userNumber.js - sending otp ');
      
        set_activityIndicator(true);     //setting activityindicator to true . now indicator will show on.

        var requestId=4141;
        debug && console.log('component_userNumber.js - otp sent ');
        debug && console.log(requestId);

        ToastAndroid.show("OTP sent",ToastAndroid.SHORT);  //otp sent success

        Keyboard.dismiss(); //dismissing keyboard before moving to next otp screen ...without this there is a lag .. keyboard will show for some miliseconds in otp screen
        set_activityIndicator(false);     //now setting activityindicator to false n thus hiding it.
        navigation.navigate('OTP',{userNumber:userNumber,requestId:requestId["requestId"]});      //navigating to OTP screen. passing some information like phonenumber and requestID to next screen
      }
      catch(err)     //error catched if some
      { 
        debug && console.log('component_userNumber.js - error while sending otp');
        debug && console.log(err);

        set_activityIndicator(false);        //hiding activity indicator
        ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);  //toasting error
      }
    }
  }

  if(activityIndicator==true)  //show activity indicator while sending otp 
  {
    debug && console.log("component_userNumber.js - showing activity indicator");

    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
        <ActivityIndicator size="large" color="#3E4DC8"/>
      </View>
    );
  }

  return(
    <View style={styles.container}>
        <View>
          <Animated.View style={[styles.upperCircle,{height:Anim_changePosition}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#C72FF8FF","#5264F9FF"]} style={styles.upperCircleGradient} />  
            }
          </Animated.View>

          <Animated.View style={[styles.midCircle,{height:Anim_changePosition}]}>
            {
              keyboardStatus?
              <View></View>  
              :
              <LinearGradient colors={["#5264F9BF","#3E4DC8E6"]} style={styles.midCircleGradient} />  
            }
          </Animated.View>

          <Animated.View style={[styles.lowerCircle,{height:Anim_changePosition}]}>
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
              <Image style={styles.logo} source={require('../res/img/TapToTalk_5.png')}/>    
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