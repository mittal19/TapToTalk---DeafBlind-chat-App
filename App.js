import React, { useState, useEffect } from 'react';
import {View,Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

function App() 
{
    useEffect(() => 
    {    
        SplashScreen.hide();
    });

    return(<View><Text>fs</Text></View>)
}
export default App;