import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, Switch, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import VehicleService from './services/VehicleService';
import MaintenanceService from './services/MaintenanceService';

export default function CadastroManutencao({ navigation, route }) {
    const [data, setData] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [tipo, setTipo] = useState('');
    const [oficina, setOficina] = useState('');
    const [custo, setCusto] = useState('');
    const [materiais, setMateriais] = useState('');
    const [isParcelado, setIsParcelado] = useState(false);
    const [modalParcelas, setModalParcelas] = useState(false);
    const [valorParcela, setValorParcela] = useState('');
    const [qtdParcelas, setQtdParcelas] = useState('');
    const [km, setKm] = useState('');

    // Novos estados para busca e associação de veículo
    const [placaBusca, setPlacaBusca] = useState('');
    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
    const [veiculosFiltrados, setVeiculosFiltrados] = useState([]);
    const [showListaVeiculos, setShowListaVeiculos] = useState(false);

    useEffect(() => {
        const carregarVeiculos = async () => {
            const lista = await VehicleService.getAll();
            setVeiculos(lista);
        };
        carregarVeiculos();
    }, []);

    useEffect(() => {
        if (placaBusca.length >= 3) {
            const filtrados = veiculos.filter(v =>
                v.placa.toLowerCase().includes(placaBusca.toLowerCase())
            );
            setVeiculosFiltrados(filtrados);
            setShowListaVeiculos(true);
        } else {
            setShowListaVeiculos(false);
        }
    }, [placaBusca, veiculos]);

    const selecionarVeiculo = (veiculo) => {
        setVeiculoSelecionado(veiculo);
        setPlacaBusca(veiculo.placa);
        setShowListaVeiculos(false);
    };

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        setData(date);
        hideDatePicker();
    };

    const handleTipoPagamento = (value) => {
        setIsParcelado(value);
        if (value) setModalParcelas(true);
    };

    const salvarManutencao = async () => {
        if (!tipo || !oficina || !custo || !materiais || !veiculoSelecionado || !km) {
            Alert.alert('Preencha todos os campos e associe um veículo!');
            return;
        }
        let infoPagamento = {
            avista: !isParcelado,
            parcelado: isParcelado,
            valorParcela: isParcelado ? valorParcela : null,
            qtdParcelas: isParcelado ? qtdParcelas : null,
        };
        const novaManutencao = {
            data: data.toLocaleDateString('pt-BR'),
            tipo,
            oficina,
            custo,
            materiais,
            km,
            ...infoPagamento,
            veiculo: veiculoSelecionado,
        };

        const sucesso = await MaintenanceService.save(novaManutencao);

        if (sucesso) {
            Alert.alert('Manutenção cadastrada!');
            setData(new Date());
            setTipo('');
            setOficina('');
            setCusto('');
            setMateriais('');
            setKm('');
            setIsParcelado(false);
            setValorParcela('');
            setQtdParcelas('');
            setPlacaBusca('');
            setVeiculoSelecionado(null);
        } else {
            Alert.alert('Erro ao salvar manutenção!');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.titulo}>Nova Manutenção</Text>
                    {/* Busca e associação de veículo */}
                    <Text style={styles.label}>Placa do Veículo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a placa para buscar"
                        value={placaBusca}
                        onChangeText={setPlacaBusca}
                        autoCapitalize="characters"
                        maxLength={7}
                    />
                    {showListaVeiculos && (
                        <View style={styles.listaVeiculos}>
                            {veiculosFiltrados.map(item => (
                                <TouchableOpacity
                                    key={item.placa}
                                    style={styles.itemVeiculo}
                                    onPress={() => selecionarVeiculo(item)}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>{item.placa}</Text>
                                    <Text>{item.marca} {item.modelo} - {item.ano}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {veiculoSelecionado && (
                        <View style={styles.dadosVeiculo}>
                            <Text style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Veículo selecionado:
                            </Text>
                            <Text>Placa: {veiculoSelecionado.placa}</Text>
                            <Text>Marca: {veiculoSelecionado.marca}</Text>
                            <Text>Modelo: {veiculoSelecionado.modelo}</Text>
                            <Text>Ano: {veiculoSelecionado.ano}</Text>
                        </View>
                    )}
                    {/* ...restante do formulário... */}
                    <Text style={styles.label}>Data da Manutenção:</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                        <Text style={styles.dateText}>
                            {data.toLocaleDateString('pt-BR')}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        locale="pt-BR"
                    />
                    <Text style={styles.label}>Tipo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Troca de óleo, pneus..."
                        value={tipo}
                        onChangeText={setTipo}
                    />
                    <Text style={styles.label}>Oficina</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da oficina"
                        value={oficina}
                        onChangeText={setOficina}
                    />
                    <Text style={styles.label}>Custo total (R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Valor total"
                        value={custo}
                        onChangeText={setCusto}
                        keyboardType="numeric"
                    />
                    <View style={styles.pagamentoContainer}>
                        <Text style={styles.label}>Pagamento parcelado?</Text>
                        <Switch
                            value={isParcelado}
                            onValueChange={handleTipoPagamento}
                            thumbColor={isParcelado ? "#1976d2" : "#ccc"}
                            trackColor={{ false: "#ccc", true: "#90caf9" }}
                        />
                        <Text style={styles.label}>{isParcelado ? 'Parcelado' : 'À vista'}</Text>
                    </View>
                    <Modal
                        visible={modalParcelas}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setModalParcelas(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.label}>Valor da Parcela (R$)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Valor de cada parcela"
                                    value={valorParcela}
                                    onChangeText={setValorParcela}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.label}>Quantidade de Parcelas</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: 3"
                                    value={qtdParcelas}
                                    onChangeText={setQtdParcelas}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    style={styles.botao}
                                    onPress={() => setModalParcelas(false)}
                                >
                                    <Text style={styles.botaoTexto}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Text style={styles.label}>KM da Manutenção</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Informe o KM atual do veículo"
                        value={km}
                        onChangeText={setKm}
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Materiais usados</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Pneu, vela, óleo..."
                        value={materiais}
                        onChangeText={setMateriais}
                    />
                    <TouchableOpacity style={styles.botao} onPress={salvarManutencao}>
                        <Text style={styles.botaoTexto}>Salvar Manutenção</Text>
                    </TouchableOpacity>
                    {/* Espaço extra para não ficar atrás da Tab Bar */}
                    <View style={{ height: 90 }} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1976d2',
        alignSelf: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: 'bold',
        color: '#1976d2',
    },
    dateButton: {
        backgroundColor: '#f5f6fa',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1976d2',
    },
    dateText: {
        fontSize: 16,
        color: '#1976d2',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    pagamentoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    botao: {
        backgroundColor: '#1976d2',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '85%',
        elevation: 5,
    },
    listaVeiculos: {
        maxHeight: 120,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#1976d2',
    },
    itemVeiculo: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dadosVeiculo: {
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
});
