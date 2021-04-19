import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
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