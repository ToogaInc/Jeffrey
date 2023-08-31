import { Model } from "sequelize";
import { Users, UserWallets, GachaInvs } from "./JeffreyDB"

export async function checkUsers(userID: string): Promise<boolean | null> {

    try {
        const user = await Users.findOne({ where: { userid: userID } });

        if (user) {
            console.log(`user ${user.userid} found in Users`);
            return true;
        }
        else {
            console.log(`user ${userID} NOT found in Users`);
            return false;
        }
    } catch {
        console.log(`ERROR: could not check for ${userID} in Users table `);
    }
    return null;
}

export async function addUsers(userID: string, username: string): Promise<void> {
    try {
        const user = await Users.create({ userid: userID, username: username });
        console.log(`added ${userID} to Users`);
    } catch {
        console.log(`ERROR: could not add ${userID} to Users`);
    }
}

export async function checkBalance(userID: string): Promise<number | null> {
    try {
        const userBalance = await UserWallets.findOne({ where: { userid: userID } });
        if (userBalance) {
            console.log(`Balance for ${userID} is ${userBalance.balance}`);
            return userBalance.balance;
        }
    } catch {
        console.log(`ERROR: Could not check balance for ${userID}`);
    }
    return null;
}

export async function changeBalance(userID: string, add: number): Promise<void> {
    try {
        const addBalance = await UserWallets.increment({ balance: add }, { where: { userid: userID } });
        console.log(`${userID}'s wallet has been changed by: ${add}`);
    } catch {
        console.log(`ERROR: could not increment ${userID}`);
    }
}

export async function checkUserWalletsUser(userID: string): Promise<boolean | null> {
    try {
        const user = await UserWallets.findOne({ where: { userid: userID } });
        if (user) {
            console.log(`${userID} found in UserWallets`);
            return true;
        } else {
            console.log(`${userID} NOT found in UserWallets`);
            return false;
        }
    } catch {
        console.log(`ERROR: Could not search for ${userID} in UserWallets`);
    }
    return null;
}

export async function addUserWalletsUser(userID: string): Promise<void> {
    try {
        const user = await UserWallets.create({ where: { userid: userID } });
        console.log(`${userID} added to UserWallets`);
    } catch {
        console.log(`ERROR: Could not add ${userID} to UserWallets`);
    }
}

export async function checkGachaInv(userID: string, gachaURL: string): Promise<boolean | null> {
    try {
        const user = await GachaInvs.findOne({ where: { userid: userID, gachas: gachaURL } });
        if (user) {
            console.log(`found ${userID} in GachaInvs`);
            return true;
        } else {
            console.log(`did NOT find ${userID} in GachaInvs`);
            return false;
        }
    } catch (error) {
        console.log(`ERROR: Could not check for ${userID} in GachaInvs`, error);
        return null;
    }
}

export async function addGacha(userID: string, gachaURL: string): Promise<void> {
    try {
        console.log(`${userID} and ${gachaURL}`);
        const user = await GachaInvs.create({ userid: userID, gachas: gachaURL, amt: 1 });
        console.log(`${userID} added to GachaInvs`);
    } catch (err){
        console.error(`ERROR: Could not add ${userID} to GachaInvs`);
        throw err;
    }
}

export async function gachaLvlUp(userID: string, gachaURL: string): Promise<void> {
    try {
        const gacha = await GachaInvs.increment({ amt: 1 }, { where: { userid: userID, gachas: gachaURL } });
        console.log(`increased ${gachaURL}'s level by 1 for ${userID}!`);
    } catch {
        console.log(`ERROR: could not increase ${gachaURL}'s level by 1 for ${userID}.`);
    }
}

export async function checkGachaLevel(userID: string, gachaURL: string): Promise<number | null>{
    try{ 
        const level = await GachaInvs.findOne({where: {userid: userID, gachas: gachaURL}});
        if(level){
        return level.amt;
        }else{
            return null;
        }
    }catch{
        console.log(`ERROR: could not check ${userID}'s GachaInv for ${gachaURL}'s level.`);
    }
    return null;
}