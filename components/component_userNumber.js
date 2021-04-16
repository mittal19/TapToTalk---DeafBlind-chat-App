//here we are taking phone number input from user
//then sending otp using fetch .. api is created...see expressbackend for api details.
//if otp is sent then navigate to otp screen

import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ToastAndroid,ActivityIndicator,Image,Dimensions} from 'react-native';
import {styles} from './styling/style_userNumber';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('window');

export function component_userNumber({navigation})
{
  
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
//in image 376 and 275 is width and height of logo
  return(
    <View style={{flex:1,backgroundColor:"#ffffff"}}>
        
        <View style={{}}>
          <LinearGradient colors={['#5264F9', '#5264df', '#C72FF899']} style={{height:height/2,width:width/1.1,left:-width/32,top:-height/8,position:'absolute',borderRadius:200}} />
          <View style={{height:height/2,width:width/1.1,left:-width/32,top:-height/8,borderRadius:200}}></View>
          <LinearGradient colors={['#5264F9', '#5264e0', '#d33af9a9']} style={{height:height/2,width:width/1.1,left:-width/8,top:-height/12,position:'absolute',borderRadius:200}} />
          <View style={{height:height/2,width:width/1.1,left:-width/8,top:-height/12,borderRadius:200,position:'absolute'}}></View>
          <LinearGradient colors={['#5264F9', '#5264ff', '#3af9ef99']} style={{height:height/2,width:width/1.1,left:-width/4,top:-height/8,position:'absolute',borderRadius:200}} />
          <View style={{height:height/2,width:width/1.1,left:-width/4,top:-height/8,borderRadius:200,position:"absolute"}}></View>  
          
          <Image style={{height:0.25*275*width/376,width:0.25*width,left:width/8,top:height/16,position:'absolute'}} source={require('./res/TapToTalk_5.png')}/>    
          <Text style={{left:width/8,top:height/16+0.25*275*width/376+height/20,position:'absolute',color:"#ffffff",fontSize:0.07*width,fontFamily:"Montserrat-Thin"}}>Welcome</Text>      
        </View>
        

        <View style={{marginHorizontal:30}}>
          <Text style={{fontSize:32,color:"#3a3a3a"}}>Sign up</Text>
          <View style={{marginVertical:24}}>
            <Text style={{fontStyle:'normal',fontWeight:"normal",fontSize:16,color:"#b9b9b9"}}>Phone Number</Text>
            <View style={{flexDirection:'row',justifyContent:"space-between"}}>
              <TextInput
                style={{fontSize:20,color:"#000000",borderBottomWidth:2,borderColor:"#5264F9",width:300,letterSpacing:2}}
                keyboardType='phone-pad'
                value={userNumber}
                onChangeText={set_userNumber}
                maxLength={10}
                />
                {
                  (userNumber.length==10)?
                  <View style={{justifyContent:'center',alignItems:"center",marginRight:10}}>
                    <Icon name="checkcircle" size={20} color="#5264F9" style={{}} />
                  </View>
                  :
                  <View></View>
                }            
            </View>
          </View>
          <View style={{marginTop:30}}>
            <LinearGradient colors={['#5264F9', '#5264ff', '#3af9ef99']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{borderRadius:28}} >
              <TouchableOpacity style={{height:72,justifyContent:"center"}} onPress={function_sendOtp} >
                <View style={{flexDirection:"row",marginHorizontal:40,justifyContent:"space-between"}}>
                  <Text style={{color:"#ffffff",fontSize:24}}>Get OTP</Text>
                  <Icon name="arrowright" size={28} color="#ffffff" style={{}}/>
                </View>
              </TouchableOpacity>
            </LinearGradient>   
          </View>
        </View>
        <View style={{alignItems:'center',justifyContent:'flex-end',flex:1,marginVertical:10}}>
          <View style={{height:2,width:140,backgroundColor:"#000000",borderRadius:100}}></View>
        </View>
    </View>
  );

}

/*

<View style={{}}>
          <Text style={{width:101,height:34,fontSize:28,color:"#3a3a3a",lineHeight:34,fontWeight:"700"}}>Sign in</Text>
          
          <View style={{width:314,height:58}}>
            <Text style={{width:101,height:17,fontStyle:'normal',fontWeight:"normal",fontSize:14,lineHeight:17,color:"#b9b9b9"}}>Phone Number</Text>
            <TextInput
              style={{fontWeight:"900",color:"#000000",borderBottomWidth:1,borderColor:"#2743fd"}}
              placeholderTextColor="white"
              keyboardType='phone-pad'
              value={userNumber}
              onChangeText={set_userNumber}
              maxLength={10}
            />
          </View>
          
          <View>
            <TouchableOpacity onPress={function_sendOtp}>
              <Text>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </View>




<View>
        <View style={{height:352,width:352,left:-12,top:-106,borderRadius:500,backgroundColor:"#5263f9",position:"absolute"}}>
        </View>
        <View style={{height:352,width:352,left:-43,top:-56,borderRadius:500,backgroundColor:"#5264f9",position:"absolute"}}>
        </View>
        <View style={{height:352,width:352,left:-74,top:-84,borderRadius:500,backgroundColor:"#3af9ef",position:"absolute"}}>
        </View>
      </View>
      <View style={{}}>
        <Text>fad</Text>
      </View>

<Image style={{height:59,width:60,top:64,left:52}} source={require('./res/logo.png')} />
        <Text  style={{height:61,width:136,top:100,left:52,fontSize:30,color:"#ffffff",fontStyle:"normal"}}>Welcome</Text>

<TextInput
        style={styles.phonenumber}
        placeholder="Enter 10 digit Phone number"
        placeholderTextColor="white"
        keyboardType='phone-pad'
        value={userNumber}
        onChangeText={set_userNumber}
        maxLength={10}
      />
      <TouchableOpacity style={styles.button} onPress={function_sendOtp}>
        <Text style={styles.buttontext} >Send OTP</Text>
      </TouchableOpacity>
      */