import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function Home() {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Svg height="200" width="200" viewBox="0 0 100 100">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor="#4c669f" stopOpacity="1" />
                            <Stop offset="1" stopColor="#3b5998" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="45" stroke="url(#grad)" strokeWidth="2.5" fill="none" />
                    <Path
                        d="M20 50 Q 50 20 80 50 T 140 50"
                        fill="none"
                        stroke="#1976d2"
                        strokeWidth="3"
                        transform="translate(-20, 10)"
                    />
                    <SvgText
                        fill="#1976d2"
                        stroke="none"
                        fontSize="20"
                        fontWeight="bold"
                        x="50"
                        y="45"
                        textAnchor="middle"
                    >
                        MyCar
                    </SvgText>
                    <SvgText
                        fill="#555"
                        stroke="none"
                        fontSize="8"
                        x="50"
                        y="65"
                        textAnchor="middle"
                    >
                        Gestão Automotiva
                    </SvgText>
                </Svg>
            </View>
            <Text style={styles.welcomeText}>Bem-vindo ao MyCar</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
    },
    logoContainer: {
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});
