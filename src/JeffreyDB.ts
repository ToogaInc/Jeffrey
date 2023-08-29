import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'JeffreyDB',
    logging: false,
});

export class Users extends Model {}
Users.init({
    userid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize });

export class UserWallets extends Model {
    declare userid: string;
    declare balance: number;
}
UserWallets.init({
    userid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Users,
            key: 'userid',
        },
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, { sequelize }
);

export class GachaInvs extends Model {}

GachaInvs.init({
    userid: {
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: 'userid',
        },
    },
    gachas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amt: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {sequelize}
);

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
};