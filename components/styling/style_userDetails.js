import {StyleSheet, Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#3E4DC8'
    },
    modalandpressable:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalinside:{
        backgroundColor:'#ffffff',
        height:height/3,
        width:width/1.5,
        borderRadius:28,
        justifyContent:'center',
        alignItems:'center'
    },
    modaltext:{
        fontSize:width/18,
        fontFamily:'Montserrat-Regular'
    },
    upperView:{
        justifyContent:'center',
        alignItems:'center',
        height:height/3
    },
    shapesWithOut:{
        height:height/4,
        width:height/4,
        backgroundColor:'#3AF9EFFF',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:height/16,
        transform:[{rotate:'-57deg'}]
    },
    shapesWithIn:{
        height:height/4,
        width:height/4,
        backgroundColor:'#C72FF8FF',
        borderRadius:height/16,
        justifyContent:'center',
        alignItems:'center',
        transform:[{rotate:'27deg'}]
    },
    profilePressable:{
        height:height/4.5,
        width:height/4.5,
        backgroundColor:'#ffffff',
        borderRadius:height/16,
        justifyContent:'center',
        alignItems:'center'
    },
    shapesWithoutOut:{
        height:height/1.75,
        width:height/1.75,
        left:width/3,
        top:-height/3.5,
        backgroundColor:'#C72FF8FF',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:height/7,
        position:'absolute',
        transform:[{rotate:'-45deg'}]
    },
    shapesWithoutIn:{
        height:height/1.75,
        width:height/1.75,
        left:width/5,
        backgroundColor:'#3AF9EFFF',
        borderRadius:height/7,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        transform:[{rotate:'10deg'}]
    },
    midView:{
        flex:1,
        marginHorizontal:width/18,
        marginVertical:height/120
    },
    textView:{
        marginVertical:height/40
    },
    userheading:{
        color:'#ffffff',
        fontSize:width/26,
        fontFamily:'Montserrat-Regular'
    },
    textInput:{
        color:'#ffffff',
        marginVertical:height/150,
        fontSize:width/22,
        borderBottomWidth:1,
        borderColor:"#ffffff",
        letterSpacing:3,
        fontFamily:'Montserrat-Medium'
    },
    impairedView:{
        marginVertical:height/40
    },
    imapairedHead:{
        color:'#ffffff',
        fontSize:width/26,
        fontFamily:'Montserrat-Regular'
    },
    pickerView:{
        color:'#ffffff',
        marginVertical:height/150
    },
    pickerItem:{
        fontSize:width/24,
        
    },
    pickerLine:{
        backgroundColor:'#ffffff',
        height:1
    },
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