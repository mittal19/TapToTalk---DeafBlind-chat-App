//https://github.com/tttstudios/react-native-otp-input
//here user enter otp 
//usernumber & requestId is got from previous phone number screen
//otp entered is checked by the api created ..check express backend for details
//if otp is correct navigate to user details screen else show error and re try.

import React from 'react';
import {View,Text,TouchableOpacity,ToastAndroid} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

export function component_otp({route,navigation}) 
{
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
    <View>
       <Text>Enter OTP</Text>
        <OTPInputView
          style={{width: '80%', height: 200}} 
          pinCount={4}
          autoFocusOnLoad
          keyboardType="phone-pad"
          codeInputFieldStyle={{width:30,height: 45,borderWidth: 0,borderBottomWidth: 1,color:'#000000'}}
          codeInputHighlightStyle={{borderColor: "#000000"}}
          onCodeFilled = {(code) => {
            set_otp(code);
          }}
          />

        <TouchableOpacity onPress={function_checkOtp}><Text>Next</Text></TouchableOpacity>
        <Text>OR</Text>
        <TouchableOpacity onPress={function_otpNotRecieved}><Text>Didn't recieved OTP on {userNumber} ?</Text></TouchableOpacity>
 
    </View>
  );

}