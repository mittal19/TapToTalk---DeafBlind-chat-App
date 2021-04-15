import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#020228",
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'space-between'
    },
    phonenumber:{
        backgroundColor:"#020f2f",
        width:300,
        color:'#ffffff',
        borderRadius:30,
        marginBottom:50
    },
    button:{
        backgroundColor:"#020f2f",
        height:40,
        width:200,
    },
    buttontext:{
        fontSize:16
    }
});

exports.styles = styles;