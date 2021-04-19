import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    otpimageBig:{
        height:223,
        width:223
    },
    smallenterotpheading:{
        flexDirection:'row',
        marginTop:8,
        marginBottom:16
    },
    bigenterotpheading:{
        flexDirection:'row',
        marginVertical:24
    },
    touchableopacityViewKeyboardShow:{
        marginHorizontal:24,
        marginTop:24
    },
    touchableopacityViewvKeyboardHide:{
        marginHorizontal:24
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
        fontSize:width/18
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

exports.styles = styles;