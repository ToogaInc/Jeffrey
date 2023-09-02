import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'JeffreyDB',
    logging: false,
});

export class User extends Model {
    declare userid: string;
    declare username: string;
}
User.init({
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

export class Wallet extends Model {
    declare userid: string;
    declare balance: number;
}
Wallet.init({
    userid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'userid',
        },
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, { sequelize });
User.hasOne(Wallet, { foreignKey: 'userid', sourceKey: 'userid' });

export class GachaInv extends Model {
    declare userid: string;
    declare gachas: string;
    declare amt: number;
}

GachaInv.init({
    userid: {
        type: DataTypes.STRING,
        references: {
            model: User,
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
        defaultValue: 1,
    },
}, { sequelize }
);
User.hasMany(GachaInv, { foreignKey: 'userid', sourceKey: 'userid' });

/**
 * test: 
 * Attempts to establish a connection to the database file which stores all the tables.
 * 
 * sync:
 * Tries to sync all database tables with the database file, 
 * which allows it to keep the information previously stored in their respective tables.
 */
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
            await User.sync();
            console.log(`UsersDB synced`);

            await Wallet.sync();
            console.log(`UserWallets synced`);

            await GachaInv.sync();
            console.log(`GachaInvs synced`);
        } catch {
            console.log('Failed to sync table(s)');
        }
    }
};