import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './JeffreyDB.db',
    logging: false,
});


// Creates the "User" table with:
// @example (id is Discord user ID, username is Discord Username, display_name is their nickname in that server)
//
// | id:'667951424704872450' | username: 'jeffreyhassalide' | display_name: Jeffrey |
export class User extends Model {
    declare id: number;
    declare discord_id: string;
    declare name: string;
    declare display_name: string;  
}
User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize });

// Creates the "Balance" table with
// @example(id is a unique ID for each row, userid is users Discord ID, balance is how much money they have) 
// 
// | id: 5 | userid: 667951424704872450 | balance: 10 |
export class Balance extends Model {
    declare id: number;
    declare user_id: string;
    declare balance: number;
}
Balance.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user_id: {
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
        unique: false,
        defaultValue: 0,
    }
}, { sequelize });
User.hasOne(Balance, { foreignKey: 'user_id', sourceKey: 'id' });

// Creates the "Gacha" table with
// @example 
// | id: 8 | link: https://fakelink.png | name: JeffreyDaKilla | description: He gonna scratch you up! |
export class Gacha extends Model {
    declare id: number;
    declare link: string;
    declare name: string;
    declare description: string;
}

Gacha.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    link: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, { sequelize });

export class Inventory extends Model {
    declare id: number;
    declare user_id: number;
    declare gacha_id: number;
    declare balance_id: number;
}
Inventory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
    gacha_id: {
        type: DataTypes.INTEGER,
        unique: false,
    },
    balance_id: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },
}, { sequelize });
User.hasOne(Inventory, {foreignKey: 'user_id', sourceKey: 'id'});
Balance.hasOne(Inventory, {foreignKey: 'balance_id', sourceKey: 'id'});
Gacha.hasMany(Inventory, {foreignKey: 'gacha_id', sourceKey: 'id'})
export class DailyWheel extends Model {
    declare id: number;
    declare userid: number;
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
}, { sequelize });

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
            console.log('UsersDB synced');

            await Balance.sync();
            console.log('UserBalances synced');

            await Gacha.sync();
            console.log('GachaInvs synced');

            await Inventory.sync();
            console.log('Inventory synced');
            await DailyWheel.sync();
            console.log('DailyWheel synced');
        } catch {
            console.log('Failed to sync table(s)');
        }
    }
};