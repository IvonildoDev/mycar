import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListaManutencoes = ({ navigation }) => {
    const [manutencoes, setManutencoes] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const carregarManutencoes = async () => {
                const dados = await AsyncStorage.getItem('manutencoes');
                if (dados) {
                    const lista = JSON.parse(dados);
                    setManutencoes(lista.map((item, idx) => ({ ...item, key: idx.toString() })));
                } else {
                    setManutencoes([]);
                }
            };
            carregarManutencoes();
        }, [])
    );

    const excluirManutencao = async (key) => {
        Alert.alert(
            'Excluir',
            'Deseja realmente excluir esta manutenção?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        const dados = await AsyncStorage.getItem('manutencoes');
                        let lista = dados ? JSON.parse(dados) : [];
                        lista = lista.filter((_, idx) => idx.toString() !== key);
                        await AsyncStorage.setItem('manutencoes', JSON.stringify(lista));
                        setManutencoes(lista.map((item, idx) => ({ ...item, key: idx.toString() })));
                    }
                }
            ]
        );
    };

    const editarManutencao = (item) => {
        // Navega para a tela de cadastro passando os dados para edição
        navigation.navigate('CadastroManutencao', { manutencao: item });
    };

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.data}>{item.data}</Text>
                    <Text style={styles.tipo}>{item.tipo}</Text>
                    <Text style={styles.oficina}>Oficina: {item.oficina}</Text>
                    <Text style={styles.custo}>Custo: R$ {item.custo}</Text>
                    <Text style={styles.materiais}>Materiais: {item.materiais}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => editarManutencao(item)} style={{ marginRight: 12 }}>
                        <Icon name="edit" size={26} color="#1976d2" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => excluirManutencao(item.key)}>
                        <Icon name="delete" size={28} color="#d32f2f" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Minhas Manutenções</Text>
            <FlatList
                data={manutencoes}
                keyExtractor={item => item.key}
                renderItem={renderCard}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
                        Nenhuma manutenção cadastrada.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 16,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1976d2',
        alignSelf: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
        elevation: 3,
        shadowColor: '#1976d2',
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    data: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 4,
    },
    tipo: {
        fontSize: 16,
        marginBottom: 4,
    },
    oficina: {
        fontSize: 14,
        marginBottom: 2,
        color: '#444',
    },
    custo: {
        fontSize: 14,
        marginBottom: 2,
        color: '#444',
    },
    materiais: {
        fontSize: 14,
        color: '#444',
    },
});

export default ListaManutencoes;
