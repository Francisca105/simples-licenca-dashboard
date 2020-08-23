const { DataTypes, Model } = require('sequelize');

module.exports = class Licencas extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: { 
                type: DataTypes.STRING
            },
            plugin: { 
                type: DataTypes.STRING
            },
            licenca: { 
                type: DataTypes.STRING
            },
            ip: { 
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Licencas',
            timestamps: true,
            sequelize
        });
    }
}