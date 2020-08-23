const { DataTypes, Model } = require('sequelize');

module.exports = class Usuarios extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            email: { 
                type: DataTypes.STRING
            },
            senha: { 
                type: DataTypes.STRING
            },
            gasto: {
                type: DataTypes.STRING
            },
            plugins: {
                type: DataTypes.STRING
            },
            admin: {
                type: DataTypes.BOOLEAN
            }
        }, {
            tableName: 'Usuarios',
            timestamps: true,
            sequelize
        });
    }
}