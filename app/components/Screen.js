import React, { Component } from 'react'
import { Text, StyleSheet, View, StatusBar } from 'react-native'
import { color } from 'react-native-reanimated'

const Screen =({children})=>{
    return(
        <View style={styles.container}>{children}</View>

    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#0C0120',
        paddingTop:StatusBar.currentHeight,
    }
})

export default Screen;





