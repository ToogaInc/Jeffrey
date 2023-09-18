import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './JeffreyDB.db',
    logging: false,
});

/** Creates the "User" table with:
* @example (id is Discord user ID, name is Discord Username, display_name is their nickname in that server)
* | id:'667951424704872450' | name: 'jeffreyhassalide' | display_name: Jeffrey |
*/
export class User extends Model {
    declare id: string;
    declare name: string;
    declare display_name: string;
}
User.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
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

/** Creates the "Wallet" table with
* @example(id is a unique ID for each row, user_id is users Discord ID, balance is how much money they have) 
* | id: 5 | user_id: 667951424704872450 | balance: 10 |
*/
export class Wallet extends Model {
    declare id: number;
    declare user_id: string;
    declare balance: number;
}
Wallet.init({
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
User.hasOne(Wallet, { foreignKey: 'user_id', sourceKey: 'id' });

/** Creates the "Gacha" table which contains a link, name, description and rarity for each gacha, aswell as a unique number ID for each of them.
* @example 
* | id: 8 | link: https://fakelink.png | name: JeffreyDaKilla | description: He gonna scratch you up! | rarity: legendary | 
*/
export class Gacha extends Model {
    declare id: number;
    declare link: string;
    declare name: string;
    declare description: string;
    declare rarity: string;
}

Gacha.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rarity: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
}, { sequelize });

/**
 * Creats 'Collection' table which creates rows with user_id and gacha_id, to show which gachas each user owns,
 * as well as what level each specific gacha is for that user(level = how many copies they have, caps at 5)
 * Has a unique number ID for each row.
 * @example
 * | id: 25 | user_id: 667951424704872450 | gacha_id: 48 | level: 3 |
 */
export class Collection extends Model {
    declare id: number;
    declare user_id: string;
    declare gacha_id: number;
    declare level: number;
}
Collection.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    gacha_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: Gacha,
            key: 'id',
        },
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        defaultValue: 1,
    },
}, { sequelize });
User.hasMany(Collection, { foreignKey: 'user_id', sourceKey: 'id' });
Gacha.hasMany(Collection, { foreignKey: 'gacha_id', sourceKey: 'id' });

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

            await Wallet.sync();
            console.log('UserWallets synced');

            await Gacha.sync();
            console.log('GachaInvs synced');

            await Collection.sync()
            console.log('Collection sunced');

        } catch (err) {
            console.log();
            console.error('Failed to sync table(s)', err);
        }
    }
};