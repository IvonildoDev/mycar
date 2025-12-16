import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import VehicleService from './services/VehicleService';

const marcas = [
    'Chevrolet', 'Fiat', 'Ford', 'Volkswagen', 'Renault', 'Toyota', 'Honda', 'Hyundai', 'Nissan', 'Jeep',
    'Peugeot', 'Citroën', 'Mitsubishi', 'Kia', 'Chery', 'Saveiro', 'Gol', 'Uno', 'Palio', 'Onix', 'Corsa'
];

export default function CadastroVeiculo() {
    const [placa, setPlaca] = useState('');
    const [ano, setAno] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');

    const salvarVeiculo = async () => {
        if (!placa || !ano || !marca || !modelo) {
            Alert.alert('Preencha todos os campos!');
            return;
        }
        const novoVeiculo = { placa, ano, marca, modelo };
        const sucesso = await VehicleService.save(novoVeiculo);

        if (sucesso) {
            Alert.alert('Veículo cadastrado com sucesso!');
            setPlaca('');
            setAno('');
            setMarca('');
            setModelo('');
        } else {
            Alert.alert('Erro ao salvar veículo!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastro de Veículo</Text>
            <Text style={styles.label}>Placa</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a placa"
                value={placa}
                onChangeText={setPlaca}
                autoCapitalize="characters"
                maxLength={7}
            />
            <Text style={styles.label}>Ano</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o ano"
                value={ano}
                onChangeText={setAno}
                keyboardType="numeric"
                maxLength={4}
            />
            <Text style={styles.label}>Marca</Text>
            <View style={styles.pickerContainer}>
                <RNPickerSelect
                    onValueChange={setMarca}
                    value={marca}
                    placeholder={{ label: 'Escolha a marca', value: '' }}
                    items={marcas.map(m => ({ label: m, value: m }))}
                    style={{
                        inputIOS: styles.input,
                        inputAndroid: styles.input,
                        placeholder: { color: '#888' },
                    }}
                />
            </View>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Gol, Saveiro, Uno..."
                value={modelo}
                onChangeText={setModelo}
            />
            <TouchableOpacity style={styles.botao} onPress={salvarVeiculo}>
                <Text style={styles.botaoTexto}>Salvar Veículo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 20,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    pickerContainer: {
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
});