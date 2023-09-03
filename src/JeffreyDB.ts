import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './JeffreyDB.db',
    logging: false,
});

// Creates the "User" table with:
// @example 
// | userid:'667951424704872450' | username: 'jeffreyhassalide' | 
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

// Creates the "Wallet" table with
// @example 
// | userid: 667951424704872450 | balance: 10 |
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

// Creates the "Wallet" table with
// @example 
// | userid: 667951424704872450 | gachas: https:/gachaexample.png | amt: 2 | 
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

// Contains'test' and 'sync'
export const DB = {
    /**
     * test: 
     * Checks if it has access to the database file
     */
    test: async (): Promise<void> => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    },
/**
 * sync:
 * Tries to sync all database tables with the database file, 
 * which allows it to build upon the information previously stored in their respective tables after bot resets.
 */
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