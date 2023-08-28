import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'JeffreyDB',
});
export class UserWallets extends Model {
    declare userid: string;
    declare balance: number;
}
UserWallets.init({
    userid: {
        type: DataTypes.STRING,
        unique: true
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, { sequelize });

export const DB = {
    test: async (): Promise<void> => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    },
    sync: async (): Promise<void> => {
        try {
            await UserWallets.sync();
            console.log('UserWallets synced');
        } catch {
            console.log('UserWallets not synced');
        }
    }
}