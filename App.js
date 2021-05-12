/*When user click on app MainActivity.java will open splash screen.
Then useEffect will check if phone storage has usernumber,username..like data.
Then retrived data will be stored in loginstate using reterive function.
After 800ms splashscreen hide function is called.800ms can be reduced or increased.
If usernumber retrived was not null then show home screen
Else show login screen.
Stack navigator for navigating between screens
*/
 
import React,{useEffect} from 'react';
import {View,ToastAndroid,ActivityIndicator,Platform,PermissionsAndroid} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import Contacts from 'react-native-contacts';

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

GLOBAL = require('./global_formatedcontacts');
GLOBAL = require('./global_userProfile');

const Stack = createStackNavigator();    //for creating navigation between screens possible using stack navigator

const debug = true;   //set to false if you dont want logs
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
      let formated_Contacts =null;
      let contacts = null;

      try
      {
        debug && console.log("App.js - Getting userdetails from phone storage");

        userNumber = await AsyncStorage.getItem('userNumber');      //getting phonenumber,name,profile,status from storage
        userName = await AsyncStorage.getItem('userName');
        userState = await AsyncStorage.getItem('userState');
        userProfile = await AsyncStorage.getItem('userProfile');
        formated_Contacts = await AsyncStorage.getItem('formated_Contacts');   //gettin formatted contacts. non duplicate contacts
        contacts = await AsyncStorage.getItem('contacts');
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
      debug && console.log(formated_Contacts);
      debug && console.log(contacts);

      GLOBAL.formated_Contacts = formated_Contacts;
      GLOBAL.userProfile = userProfile;

      debug && console.log("App.js - calling dispatch retieve function");

      dispatch({type:'RETRIEVE_STORED_DATA',userNumber:userNumber,userName:userName,userState:userState,userProfile:userProfile});        //calling dispatcher action for setting the data retrived ... this action is in ./helpers/Reduceractions 
      
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

            GLOBAL.userProfile = userProfile;

            if(Platform.OS == 'android')   //now access contacts
            { 
              var raw_Contacts=[];     //hold all phone contacts

              debug && console.log("App.js - getting contacts");
              try
              {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
                if(granted === PermissionsAndroid.RESULTS.GRANTED)
                {
                  await Contacts.getAll().then(contacts =>   //getting all phone contacts
                    {
                      raw_Contacts=contacts;    
                    });

                  debug && console.log("App.js - got contacts");
                  
                  var formated_Contacts=[];   //store contacts in a format
                  var nonDuplicatePhoneNumbers={};         //store non duplicate numbers with their name as  given by user
                  for(var i=0;i<raw_Contacts.length;i++)
                  {
                    if(raw_Contacts[i].phoneNumbers.length!=0)   //check if number exist or its null
                    {
                      var phoneNumber = raw_Contacts[i].phoneNumbers[0].number;
                      phoneNumber = phoneNumber.replace(/\D/g,'').slice(-10);   //formatting number -- removing spaces and +91

                      if(nonDuplicatePhoneNumbers[phoneNumber]==undefined)    //this will allow only numbers which are not seen previously
                      {
                        nonDuplicatePhoneNumbers[phoneNumber]=raw_Contacts[i].displayName;
                        formated_Contacts.push(
                          {
                            userNumber:phoneNumber,
                            userName:raw_Contacts[i].displayName,
                            onTapToTalk:"No",
                            userProfile:""
                          }
                        );
                      }
                    }
                  }

                  debug && console.log("App.js - formatting done");
                  
                  formated_Contacts.sort(function(a,b) 
                  {
                    return a.userName.toLowerCase()>b.userName.toLowerCase();
                  });

                  debug && console.log("App.js - sorting of formattd contacts done");

                  await AsyncStorage.setItem("contacts",JSON.stringify(nonDuplicatePhoneNumbers),(err)=>
                  {
                    if(err)
                      throw err;
                    debug && console.log("App.js - success");
                  }).catch((err)=> 
                  {
                     debug && console.log("App.js - error is: " + err);
                  });

                  debug && console.log("App.js - stored non duplicate contacts");
                  
                  await AsyncStorage.setItem("formated_Contacts",JSON.stringify(formated_Contacts),(err)=>
                  {
                    if(err)
                      throw err;
                    debug && console.log("App.js - success");
                  }).catch((err)=> 
                  {
                     debug && console.log("App.js - error is: " + err);
                  });

                  GLOBAL.formated_Contacts = formated_Contacts;
                  
                  debug && console.log("App.js - storing of formattd contacts done");
                  debug && console.log("App.js - calling login dispatch function");

                  dispatch({type:'LOGIN',userNumber:userNumber,userName:userName,userState:userState,userProfile:userProfile});  // calling dispatcher action for login ... this action is in ./helpers/Reduceractions  
                }
                else
                {
                  debug && console.log("App.js - permission denied"); 
                  
                  ToastAndroid.show("Could not login Permission to access contacts denied",ToastAndroid.SHORT);  
                }
              }
              catch(err)
              {
                debug && console.log("App.js - error while getting or saving contacts");
                debug && console.log(err);

                ToastAndroid.show("Check your internet connection or Try again.",ToastAndroid.SHORT);
              }
            }
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

            await AsyncStorage.removeItem('userNumber');   //removing usernumber,userprofile,etc from local storage
            await AsyncStorage.removeItem('userState');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userProfile');
            await AsyncStorage.removeItem('formated_Contacts');
            await AsyncStorage.removeItem('contacts');
            await AsyncStorage.removeItem('onTapToTalk');

            GLOBAL.formated_Contacts =[];
            GLOBAL.userProfile='';
            
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