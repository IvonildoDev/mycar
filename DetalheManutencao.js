import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetalheManutencao = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Detalhe da Manutenção</Text>
            {/* Aqui será exibido o detalhe da manutenção selecionada */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default DetalheManutencao;
