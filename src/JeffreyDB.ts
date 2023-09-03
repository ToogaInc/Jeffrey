import { Sequelize, DataTypes, Model, IntegerDataType } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './JeffreyDB.db',
    logging: false,
});


// Creates the "User" table with:
// @example (id is Discord user ID, username is Discord Username)
// | id:'667951424704872450' | username: 'jeffreyhassalide' | 
export class User extends Model {
    declare id: string;
    declare name: string;
}
User.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize });

// Creates the "Wallet" table with
// @example(id is a unique ID for each row, userid is users Discord ID) 
// | id: 5 | userid: 667951424704872450 | balance: 10 |
export class Wallet extends Model {
    declare id: string;
    declare userid: string;
    declare balance: number;
}
Wallet.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, { sequelize });
User.hasOne(Wallet, { foreignKey: 'userid', sourceKey: 'id' });

// Creates the "GachaInv" table with
// @example 
// | userid: 667951424704872450 | gachas: https:/gachaexample.png | amt: 2 | 
export class GachaInv extends Model {
    declare id: string;
    declare userid: string;
    declare gachas: string;
    declare amt: number;
}

GachaInv.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
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
}, { sequelize });
User.hasMany(GachaInv, { foreignKey: 'userid', sourceKey: 'id' });

export class DailyWheel extends Model {
    declare id: string;
    declare userid: string;
    declare spins: number;
    declare createdAt: string;
}

DailyWheel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        defaultValue: 1,
    },
    userid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    spins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { sequelize }
);

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

            await DailyWheel.sync();
            console.log(`DailyWheel synced`);
        } catch {
            console.log('Failed to sync table(s)');
        }
    }
};