import db from './Database';

class VehicleService {
    async getAll() {
        try {
            const result = await db.getAllAsync('SELECT * FROM veiculos');
            return result;
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            return [];
        }
    }

    async save(veiculo) {
        try {
            await db.runAsync(
                'INSERT INTO veiculos (placa, ano, marca, modelo) VALUES (?, ?, ?, ?)',
                [veiculo.placa, veiculo.ano, veiculo.marca, veiculo.modelo]
            );
            return true;
        } catch (error) {
            console.error('Erro ao salvar veículo:', error);
            return false;
        }
    }
}

export default new VehicleService();
