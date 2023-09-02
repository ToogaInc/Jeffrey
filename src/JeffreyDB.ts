import { Sequelize, DataTypes, Model, IntegerDataType } from 'sequelize';

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'JeffreyDB',
    logging: false,
});

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
}, { sequelize }
);
User.hasOne(Wallet, { foreignKey: 'userid', sourceKey: 'id' });

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
}, { sequelize }
);
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

            await DailyWheel.sync();
            console.log(`DailyWheel synced`);
        } catch {
            console.log('Failed to sync table(s)');
        }
    }
};