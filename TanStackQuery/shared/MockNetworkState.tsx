import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Switch} from 'react-native-paper';
import {onlineManager} from "@tanstack/react-query";

type SetNetworkState = (isConnected: boolean) => void


export const MockNetworkState = () => {
    const setNetworkStateRef = useRef<SetNetworkState>(() => {})
    const [isOnline, setIsOnline] = useState(true);

    const toggleState = () => {
        setIsOnline(prev => !prev);
    }

    useEffect(() => {
        // For real world implementations, see https://tanstack.com/query/v4/docs/framework/react/react-native
        onlineManager.setEventListener((setOnline) => {
            setNetworkStateRef.current = (state: boolean) => {
                setOnline(state);
            };
            return undefined;
        })
    }, []);

    useEffect(() => {
        setNetworkStateRef.current(isOnline);
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