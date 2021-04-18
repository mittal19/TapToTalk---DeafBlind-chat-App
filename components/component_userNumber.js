//here we are taking phone number input from user
//then sending otp using fetch .. api is created...see expressbackend for api details.
//if otp is sent then navigate to otp screen

import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,ActivityIndicator,Image,Dimensions,KeyboardAvoidingView,Keyboard} from 'react-native';
import {styles} from './styling/style_userNumber';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('window');

export function component_userNumber({navigation})
{
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
  const _keyboardDidShow = () => setKeyboardStatus(true);
  const _keyboardDidHide = () => setKeyboardStatus(false);
  
  console.log(width+" "+height);

  const [userNumber,set_userNumber] = React.useState('');    // state for holding phone number
  const [sendingOtp,set_sendingOtp] = React.useState(false);    // state for showing activity indicator

  const function_sendOtp = async()=>        //function which will be called when user clicks on send otp
  {

    if( !(/^\d+$/.test(userNumber)) || userNumber.length<10 )       //checking validity of phone number
    {  
      ToastAndroid.show("Enter a number with 10 digits only!", ToastAndroid.LONG);    //showing toast if entered number is not properly formatted
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
        set_sendingOtp(false);     //now setting activityindicator to false n thus hiding it.
        navigation.navigate('OTP',{userNumber:userNumber,requestId:requestId["requestId"]});      //navigating to OTP screen. passing some information like phonenumber and requestID to next screen
      }
      catch(err)     //error catched if some
      { 
        console.log(err);            
        set_sendingOtp(false);        //hiding activity indicator
        ToastAndroid.show("Some error occurred. Try again.",ToastAndroid.LONG);  //toasting error
      }
    }
  }

  if(sendingOtp==true)           //if otp is not sent then show activity indicator 
  {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color="#000000"/>
      </View>
    );
  }

  
//in image 376 and 275 is width and height of logo   left:width/6,top:height/12,left:width/8,top:height/16+0.25*275*width/376+height/20,
  return(
    <View style={{flex:1,backgroundColor:"#ffffff"}}>

       {
          keyboardStatus==false?
            <View style={{height:height/2}}>
              <View style={{height:height/2,width:height/2}}>
                <LinearGradient colors={["#3E4DC8FF","#3E4DC8FF","#00FFFFFF","#00FFFFFF"]} style={{height:height/2,width:height/2,left:-width/40,top:-height/6,position:'absolute',borderRadius:500}} />
              </View>

              <View style={{height:height/2,width:height/2,position:'absolute'}}>
                <LinearGradient colors={["#3E4DC8FF","#971ABFBF","#971ABFBF"]} style={{height:height/2,width:height/2,left:-width/10,top:-height/14,position:'absolute',borderRadius:500}} />
              </View>

              <View style={{height:height/2,width:height/2,position:"absolute"}}>
                <LinearGradient colors={["#3E4DC8FF","#3E4DC8FF","#4AECEC80"]} style={{height:height/2,width:height/2,left:-width/6,top:-height/8,position:"absolute",borderRadius:500}} />
              </View>
              
              <View style={{left:width/6,top:height/12,position:'absolute',justifyContent:'center',alignItems:'center'}}>
                <Image style={{height:0.20*275*width/376,width:0.20*width}} source={require('./res/TapToTalk_5.png')}/>    
                <Text style={{color:"#ffffff",fontSize:0.07*width,marginVertical:height/16}}>Welcome</Text>
              </View>
            </View>
          :
          <View style={{height:height/8}} />
       }

        <View style={{marginHorizontal:width/16}}>

          <Text style={{fontSize:width/14,color:"#3A3A3A",fontWeight:'normal'}}>Sign up</Text>

          <View style={{marginVertical:height/18}}>
            
            <Text style={{fontStyle:'normal',fontWeight:'bold',fontSize:width/24,color:"#b9b9b9"}}>Phone Number</Text>
            
            <View style={{flexDirection:'row',justifyContent:"space-between"}}>
              <TextInput
                style={{fontSize:width/18,color:"#3A3A3A",borderBottomWidth:2,borderColor:"#3E4DC8FF",width:width/1.40,letterSpacing:8}}
                keyboardType='phone-pad'
                value={userNumber}
                onChangeText={set_userNumber}
                maxLength={10}
                />
                {
                  (userNumber.length==10)?
                  <View style={{justifyContent:'center',alignItems:"center",marginRight:width/32}}>
                    <Icon name="checkcircle" size={width/18} color="#3E4DC8FF" style={{}} />
                  </View>
                  :
                  <View></View>
                }            
            </View>

          </View>

          <View style={{}}>
            
            <LinearGradient colors={["#3E4DC8FF", "#971ABFBF", "#00FFFFFF"]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{borderRadius:28}} >
              <TouchableOpacity style={{height:height/10,justifyContent:"center"}} onPress={function_sendOtp} >
                <View style={{flexDirection:"row",marginHorizontal:width/12,alignItems:'center',justifyContent:"space-between"}}>
                  <Text style={{color:"#ffffff",fontSize:width/18}}>Get OTP</Text>
                  <Icon name="arrowright" size={width/18} color="#ffffff" style={{}}/>
                </View>
              </TouchableOpacity>
            </LinearGradient>   
          
          </View>
        </View>

      <View style={{alignItems:'center',justifyContent:'flex-end',flex:1,marginBottom:width/44}}>
        <View style={{height:4,width:width/3,backgroundColor:"#000000",borderRadius:100}}></View>
      </View>

    </View>
  );
}