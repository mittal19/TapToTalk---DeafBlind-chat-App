import React, { useState, useEffect } from 'react';
import {View,Text,StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

function App() 
{
    useEffect(() => 
    {    
        console.log("in1");
        setTimeout(async()=>
        {
            console.log("in2");
            SplashScreen.hide();
        },100000);
        console.log("in3");
    });

    return(
        <View>
            <StatusBar 
                backgroundColor="#292F3F"
                barStyle="light-content"
            />
            <Text>fs</Text>
        </View>
    );
}
export default App;