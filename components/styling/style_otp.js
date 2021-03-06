import {StyleSheet, Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container:{
        backgroundColor:"#ffffff",
        flex:1
    },
    otpimageView:{
        justifyContent:'center',
        alignItems:'center',
        marginVertical:height/18
    },
    otpimageBig:{
        height:width/2,
        width:width/2
    },
    midView:{
        flex:2
    },
    otpenterView:{
        alignItems:'center'
    },
    otpverification:{
        fontSize:width/16,
        fontFamily:'Montserrat-Regular'
    },
    smallenterotpheading:{
        flexDirection:'row',
        marginTop:height/48,
        marginBottom:height/32
    },
    bigenterotpheading:{
        flexDirection:'row',
        marginVertical:height/30,
    },
    otpsentto:{
        fontSize:width/26
    },
    otpinputView:{
        width: width/1.40, 
        height: width/8
    },
    codeInputFieldStyle:{
        width:width/8,
        height:width/6,
        borderWidth:0,
        borderBottomWidth:2,
        color:'#000000',
        borderColor:'#3E4DC8',
        fontSize:width/14,
        fontFamily:'Montserrat-Medium'
    },
    codeInputHighlightStyle:{
        borderColor:"#000000"
    },
    didnotrecieved:{
        fontSize:width/24,
        color:"#3E4DC8",
        fontFamily:'Montserrat-SemiBold',
    },
    touchableopacitydidnotrecieved:{
        marginVertical:height/18,
        justifyContent:'center',
        alignItems:'center'
    },
    touchableopacityViewKeyboardShow:{
        marginHorizontal:width/18,
        marginTop:height/26
    },
    touchableopacityViewKeyboardHide:{
        marginHorizontal:width/18
    },
    verifyotpGradient:{
        borderRadius:28
    },
    touchableopacity:{
        height:height/10,
        justifyContent:"center"
    },
    touchableopacityView:{
        alignItems:'center'
    },
    verifyotp:{
        color:"#ffffff",
        fontSize:width/18,
        fontFamily:'Montserrat-Regular'
    },
    lineView:{
        alignItems:'center',
        justifyContent:'flex-end',
        marginBottom:width/44
    },
    line:{
        height:4,
        width:width/3,
        backgroundColor:"#000000",
        borderRadius:100
    }
});