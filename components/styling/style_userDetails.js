import {StyleSheet, Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');
console.log(height+" "+width);
export default StyleSheet.create({
    touchableopacity:{
        height:height/10,
        justifyContent:"center",
        borderRadius:28,
        backgroundColor:'#ffffff',
        marginVertical:60
    },
    touchableopacityView:{
        flexDirection:"row",
        marginHorizontal:width/12,
        alignItems:'center',
        justifyContent:"space-between"
    },
    submitDetails:{
        color:'#3E4DC8',
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
        backgroundColor:"#ffffff",
        borderRadius:100
    }
});