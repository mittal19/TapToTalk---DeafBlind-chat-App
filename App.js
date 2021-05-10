/*When user click on app MainActivity.java will open splash screen.
Then useEffect will check if phone storage has usernumber,username..like data.
Then retrived data will be stored in loginstate using reterive function.
Global username is set to whatever retreived
After 800ms splashscreen hide function is called.800ms can be reduced or increased.
If usernumber retrived was not null then show home screen
Else show login screen.
Stack navigator for navigating between screens
*/
 
import React,{useEffect} from 'react';
import {View,ToastAndroid,ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

import {AuthContext} from './helpers/context';		
import {Reduceractions} from './helpers/reducerActions';    
import {initialLogin} from './helpers/initialLogin';
import {firebase} from './helpers/firebaseConfig';

import {component_userNumber} from './components/component_userNumber';
import {component_home} from './components/component_home';
import {component_otp} from './components/component_otp';
import {component_contacts} from './components/component_contacts';
import {component_message} from './components/component_message';
import {component_userDetails} from './components/component_userDetails';

const Stack = createStackNavigator();    //for creating navigation between screens possible using stack navigator

GLOBAL = require('./global');  //make access of global usernumber here

const debug = false;   //set to false if you dont want logs
const timeout= 12000;

function App()
{
 
    debug && console.log("-----");
    debug && console.log("App.js - LOGS");

    const [loginState,dispatch] = React.useReducer(Reduceractions,initialLogin);   //intializing reducer , Reduceractions imported, initialLogin imported

    const [activityIndicator,set_activityIndicator] = React.useState(false);   // this usestate will decide whether to show activity indicator or not.

    useEffect(async()=>  //this will be automattically called is similar to component did mount
    {            
      let userNumber = null;      //these variales will store data from local storage  
      let userName = null;
      let userState = null;
      let userProfile = null;

      try
      {
        debug && console.log("App.js - Getting userdetails from phone storage");

        userNumber = await AsyncStorage.getItem('userNumber');      //getting phonenumber,name,profile,status from storage
        userName = await AsyncStorage.getItem('userName');
        userState = await AsyncStorage.getItem('userState');
        userProfile = await AsyncStorage.getItem('userProfile');
      }
      catch(e)
      {
        ToastAndroid.show("Some error occurred while getting login information.",ToastAndroid.SHORT);
        
        debug && console.log("App.js - Error occured while Getting userdetails from phone storage");
        debug && console.log(e);
      }
      
      debug && console.log("App.js - got these details from phone storage");
      debug && console.log(userNumber);
      debug && console.log(userName);
      debug && console.log(userState);
      debug && console.log(userProfile);

      debug && console.log("App.js - calling dispatch retieve function");

      dispatch({type:'RETRIEVE_STORED_DATA',userNumber:userNumber,userName:userName,userState:userState,userProfile:userProfile});        //calling dispatcher action for setting the data retrived ... this action is in ./helpers/Reduceractions 
      
      debug && console.log("App.js - setting global variable");

      GLOBAL.userNumber = userNumber;
      
      setTimeout(()=>
      {
        debug && console.log("App.js - hiding slpash screen");

        SplashScreen.hide();
      },800);

    },[]);

    const function_loginSetTimeOut = async(userdetailed)=>  //this function will be called to save usedetails in firebase real time db it has time out feature
    {
        debug && console.log("components_App.js - called login function with timeout");

        let temp_timeout = timeout || 20000;   //if timeout is passed with option then set timeout to that else set timeout to 20000
        let timeout_err =  
        {
            requestId:'',
            response:'Timeout',
            status:408
        };//setting error object to display if time out occurs

        debug && console.log("App.js - creating reference to real time storage");

        var database = firebase.database(); 

        debug && console.log("App.js - storing userdetails to storage");  

        return new Promise(function(resolve,reject) //The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
        {
            database.ref().update(userdetailed).then(resolve,reject);  
            setTimeout(reject.bind(null,timeout_err),temp_timeout); //settimeout will run reject.bind after timeout seconds
        });
    }

    const authContext = React.useMemo(()=>      //creating authcontext .. the functions created here will be accessible all in the app
    ({        
 
        logIn: async(userNumber,userName,userState,userProfile)=> // this function will be called by userDetails component 
        {      
          debug && console.log("App.js - login function called");

          set_activityIndicator(true);    //show activity indicator while saving details to firebase.

          debug && console.log("App.js - activity indicator showed");

          try
          {
            debug && console.log("App.js - creating userdetail object");

            var userdetailed={}; //empty object
            userdetailed['/users/'+userNumber+'/userName']=userName;
            userdetailed['/users/'+userNumber+'/userState']=userState;
            userdetailed['/users/'+userNumber+'/userProfile']=userProfile;   //setting userdetails to object. user details are stored in realtime database of firebase  
            
            debug && console.log(userdetailed);
            
            debug && console.log("App.js - calling login time out function");

            var resp = await function_loginSetTimeOut(userdetailed);
            
            debug && console.log(resp);

            debug && console.log("App.js - storing userdetails to local storage");

            await AsyncStorage.setItem('userNumber',userNumber);            //set all details in local storage of phone
            await AsyncStorage.setItem('userName',userName);
            await AsyncStorage.setItem('userState',userState);
            await AsyncStorage.setItem('userProfile',userProfile);

            debug && console.log("App.js - setting global variable to usernumber");

            GLOBAL.userNumber=userNumber;      //setting global variable

            debug && console.log("App.js - calling login dispatch function");

            dispatch({type:'LOGIN',userNumber:userNumber,userName:userName,userState:userState,userProfile:userProfile});  // calling dispatcher action for login ... this action is in ./helpers/Reduceractions  
          }
          catch(e)
          {
            ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);
            
            debug && console.log("App.js - some error occured while logging userin");
            debug && console.log(e);
          }

          set_activityIndicator(false);

          debug && console.log("App.js - activity indicator hide");
        },

        logOut: async()=>		//for signing user out 
        {
          debug && console.log("App.js - logout function called");   
          
          set_activityIndicator(true);

          debug && console.log("App.js - activity indicator showed");

          try				
          { 
            debug && console.log("App.js - deleting userdetails from phone storage");

            await  AsyncStorage.removeItem('userNumber');   //removing usernumber,userprofile,etc from local storage
            await  AsyncStorage.removeItem('userState');
            await  AsyncStorage.removeItem('userName');
            await  AsyncStorage.removeItem('userProfile');

            debug && console.log("App.js - setting global variable to null");

            GLOBAL.userNumber='';    //setting global variable to null

            debug && console.log("App.js - calling logout dispatch function");

            dispatch({type:'LOGOUT'});           //calling dispatcher action for logging out ... this action is in ./helpers/Reduceractions 
          } 
          catch(e)
          {
              ToastAndroid.show("Some error occurred! Try again",ToastAndroid.SHORT);

              debug && console.log("App.js - Some error ocurred while logging user out");
              debug && console.log(e);
          }

          debug && console.log("App.js - activity indicator hiding");

          set_activityIndicator(false);
        },

    }),[]);

  
  if(activityIndicator==true)
  {
    debug && console.log("App.js - showing activity indicator");
    
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#3E4DC8'}}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );

  }

  return(
    <AuthContext.Provider value={authContext}> 
      <NavigationContainer>
      
      {loginState.userNumber == null ?  
        
        <Stack.Navigator>
          <Stack.Screen name="Phone Number" component={component_userNumber} options={{headerShown: false}} />
          <Stack.Screen name="OTP" component={component_otp} options={{headerShown: false}}/>
          <Stack.Screen name="EnterDetails" component={component_userDetails} options={{headerShown: false}}/>
        </Stack.Navigator>
        :
        <Stack.Navigator>         
          <Stack.Screen name="Home" component={component_home} options={{headerShown: false}} initialParams={{'key':'value'}}/>
          <Stack.Screen name="Contacts" component={component_contacts} options={{headerShown: false}}/>
          <Stack.Screen name="Message" component={component_message} options={{headerShown: false}}/>
        </Stack.Navigator>
      
      }

      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App; 