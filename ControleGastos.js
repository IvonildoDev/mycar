import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import MaintenanceService from './services/MaintenanceService';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const colors = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'];

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
    const [chartData, setChartData] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const carregarGastos = async () => {
                const lista = await MaintenanceService.getAll();
                setGastos(lista);
                const soma = lista.reduce((acc, item) => acc + Number(item.custo || 0), 0);
                setTotal(soma);

                // Prepara dados para o gráfico
                const gastosPorTipo = {};
                lista.forEach(item => {
                    const tipo = item.tipo || 'Outros';
                    const valor = Number(item.custo || 0);
                    if (gastosPorTipo[tipo]) {
                        gastosPorTipo[tipo] += valor;
                    } else {
                        gastosPorTipo[tipo] = valor;
                    }
                });

                const data = Object.keys(gastosPorTipo).map((tipo, index) => ({
                    name: tipo,
                    population: gastosPorTipo[tipo],
                    color: colors[index % colors.length],
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 12
                }));
                setChartData(data);
            };
            carregarGastos();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.tipo}>{item.tipo}</Text>
            <Text style={styles.custo}>Valor total: R$ {item.custo}</Text>
            {!!item.parcelado && !!item.qtdParcelas && !!item.valorParcela ? (
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

            {chartData.length > 0 && (
                <PieChart
                    data={chartData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[0, 0]}
                    absolute
                />
            )}

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
        marginTop: 10,
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
