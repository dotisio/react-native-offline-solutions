import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Switch} from 'react-native-paper';

export const MockNetworkState = ({setNetworkState}: {setNetworkState: (state: boolean) => void }) => {
    const [isOnline, setIsOnline] = useState(true);

    const toggleState = () => {
        setIsOnline(prev => !prev);
    }

    useEffect(() => {
        setNetworkState(isOnline);
    }, [isOnline]);

  return (
    <View style={styles.container}>
        <Text>Mock Online state</Text>
        <Switch value={isOnline} onValueChange={toggleState}/>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        padding: 24,
        flexDirection: "row",
        alignItems: "center"
    }
})