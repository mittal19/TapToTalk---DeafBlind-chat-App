//This App.js file will have stack navigator for navigating between screens
// First of all when user open app - isLoading var is true so splash screen will show up
// BY that time useeffect function have settime out function whichh will load data from local storage
// and set it using dispatcher actions after 1000ms.
// if userNumber retrieved from local storage is null then enter phone number component will open 
//else if usernumber is not null then home component will open.

 
import React,{useEffect} from 'react';
import {View,ToastAndroid,Text} from 'react-native';
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
import {component_selectProfile} from './components/component_selectProfile';
import {component_saveProfile} from './components/component_saveProfile';

const Stack = createStackNavigator();    //for creating navigation between screens possible using stack navigator

function App()
{
  
    const [loginState,dispatch] = React.useReducer(Reduceractions,initialLogin);   //intializing reducer , Reduceractions imported, initialLogin imported

    const authContext = React.useMemo(()=>      //creating authcontext .. the functions created here will be accessible all in the app
    ({        
	
        logIn: async(userNumber,userName,userState)=> // this function will be called by userDetails component 
        {      
            dispatch({type:'LOGIN',userNumber:userNumber,userName:userName,userState:userState,userProfile:userProfile});  // calling dispatcher action for login ... this action is in ./helpers/Reduceractions
        
            var database = firebase.database();
            var userdetailed={};
            userdetailed['/users/'+userNumber+'/userName']=userName;
            userdetailed['/users/'+userNumber+'/userState']=userState;
            userdetailed['/users/'+userNumber+'/userProfile']=userProfile;

            try
            {
                await database.ref().update(userdetailed);  
                
                await AsyncStorage.setItem('userNumber',userNumber);            //set all details in local storage of phone
                await AsyncStorage.setItem('userName',userName);
                await AsyncStorage.setItem('userState',userState);
                await AsyncStorage.setItem('userProfile',userProfile);
            }
            catch(err)
            {
                ToastAndroid.show("Some error occurred! Try again",ToastAndroid.SHORT);
            }
        },

        logOut: async()=>		//for signing user out 
        {   
            try				//removing usernumber,status.. from local storage
            { 
                await  AsyncStorage.removeItem('userNumber');
                await  AsyncStorage.removeItem('userState');
                await  AsyncStorage.removeItem('userName');
                await  AsyncStorage.removeItem('userProfile');

                dispatch({type:'LOGOUT'});           //calling dispatcher action for logging out ... this action is in ./helpers/Reduceractions 
            } 
            catch(e)
            {
                ToastAndroid.show("Some error occurred! Try again",ToastAndroid.SHORT);
            }
        },

    }),[]);

    useEffect(()=>  //this will be automattically called is similar to component did mount
    {            
      setTimeout(async()=>
      {
        let userNumber = null;      //these variales will store data from local storage  
        let userName = null;
        let userState = null;
        let userProfile = null;
        try
        {
          userNumber = await AsyncStorage.getItem('userNumber');      //getting phonenumber,name,profile,status from storage
          userName = await AsyncStorage.getItem('userName');
          userState = await AsyncStorage.getItem('userState');
          userProfile = await AsyncStorage.getItem('userProfile');
        }
        catch(e)
        {
          console.log(e);       //showing error
        }
        
        dispatch({type:'RETRIEVE_STORED_DATA',userNumber:userNumber,userName:userName,userState:userState,userProfile:userProfile});        //calling dispatcher action for setting the data retrived ... this action is in ./helpers/Reduceractions 
        setTimeout(()=>{
          SplashScreen.hide()
        },1000);
      },0);    //settime out of 1000ms is just for showing splash screen
  
    },[]);

  //if userNumber is null then show login process else show loggedin screens 

  return(
    <AuthContext.Provider value={authContext}> 
      <NavigationContainer>
      {loginState.userNumber == null ?  
        <Stack.Navigator>
          <Stack.Screen name="Phone Number" component={component_userNumber} options={{headerShown: false}} />
          <Stack.Screen name="OTP" component={component_otp} options={{headerShown: false}}/>
          <Stack.Screen name="EnterDetails" component={component_userDetails} options={{headerShown: false}}/>
          <Stack.Screen name="Select image" component={component_selectProfile} options={{headerShown: false}}/>
          <Stack.Screen name="Save Profile" component={component_saveProfile} options={{headerShown: false}}/>
        </Stack.Navigator>
        :
        <Stack.Navigator> 
              
          <Stack.Screen name="Home" component={component_home} options={{headerShown: false}}/>
          <Stack.Screen name="Contacts" component={component_contacts} options={{headerShown: false}}/>
          <Stack.Screen name="Message" component={component_message} options={{headerShown: false}}/>
        </Stack.Navigator>
      }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App; 