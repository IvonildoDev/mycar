import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function getParcelasDatas(dataInicial, qtdParcelas) {
    const datas = [];
    let data = new Date(
        dataInicial.split('/').reverse().join('-') // pt-BR para yyyy-mm-dd
    );
    for (let i = 0; i < Number(qtdParcelas); i++) {
        const dataParcela = new Date(data);
        dataParcela.setMonth(dataParcela.getMonth() + i);
        datas.push(
            dataParcela.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        );
    }
    return datas;
}

const ControleGastos = () => {
    const [gastos, setGastos] = useState([]);
    const [total, setTotal] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            const carregarGastos = async () => {
                const dados = await AsyncStorage.getItem('manutencoes');
                if (dados) {
                    const lista = JSON.parse(dados);
                    setGastos(lista.map((item, idx) => ({ ...item, key: idx.toString() })));
                    const soma = lista.reduce((acc, item) => acc + Number(item.custo || 0), 0);
                    setTotal(soma);
                } else {
                    setGastos([]);
                    setTotal(0);
                }
            };
            carregarGastos();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.tipo}>{item.tipo}</Text>
            <Text style={styles.custo}>Valor total: R$ {item.custo}</Text>
            {item.parcelado && item.qtdParcelas && item.valorParcela ? (
                <View style={{ marginTop: 6 }}>
                    <Text style={styles.parcela}>
                        Parcelado em {item.qtdParcelas}x de R$ {item.valorParcela}
                    </Text>
                    <Text style={styles.data}>
                        {getParcelasDatas(item.data, item.qtdParcelas)
                            .map((d, i) => `Parcela ${i + 1}: ${d}`)
                            .join('\n')}
                    </Text>
                </View>
            ) : (
                <Text style={styles.data}>Dia da compra: {item.data}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Controle de Gastos</Text>
            <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
            <FlatList
                data={gastos}
                keyExtractor={item => item.key}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
                        Nenhum gasto cadastrado.
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
        marginBottom: 8,
        color: '#1976d2',
        alignSelf: 'center',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
        marginBottom: 16,
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
    tipo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 4,
    },
    data: {
        fontSize: 14,
        marginBottom: 2,
        color: '#444',
        whiteSpace: 'pre-line',
    },
    custo: {
        fontSize: 14,
        color: '#444',
    },
    parcela: {
        fontSize: 14,
        color: '#1976d2',
        fontWeight: 'bold',
    },
});

export default ControleGastos;
