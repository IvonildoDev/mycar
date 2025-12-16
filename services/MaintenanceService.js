import db from './Database';

class MaintenanceService {
    async getAll() {
        try {
            const result = await db.getAllAsync('SELECT * FROM manutencoes');
            // Mapeia id para key para compatibilidade com FlatList
            return result.map(item => ({ ...item, key: item.id.toString() }));
        } catch (error) {
            console.error('Erro ao buscar manutenções:', error);
            return [];
        }
    }

    async save(data) {
        try {
            await db.runAsync(
                `INSERT INTO manutencoes (
                    data, tipo, oficina, custo, materiais, km, veiculo_id, 
                    avista, parcelado, valorParcela, qtdParcelas
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.data, data.tipo, data.oficina, data.custo, data.materiais, data.km, data.veiculo ? data.veiculo.id : null,
                    data.avista ? 1 : 0, data.parcelado ? 1 : 0, data.valorParcela, data.qtdParcelas
                ]
            );
            return true;
        } catch (error) {
            console.error('Erro ao salvar manutenção:', error);
            return false;
        }
    }

    async delete(key) {
        try {
            await db.runAsync('DELETE FROM manutencoes WHERE id = ?', [key]);
            return await this.getAll();
        } catch (error) {
            console.error('Erro ao excluir manutenção:', error);
            return null;
        }
    }
}

export default new MaintenanceService();
