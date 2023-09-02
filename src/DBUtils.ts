import { User, Wallet, GachaInv, DailyWheel } from "./JeffreyDB"

//check if 'userid' is in the Users table
export async function checkUsers(userID: string): Promise<boolean | null> {

    try {
        const user = await User.findOne({ where: { id: userID } });

        if (user) {
            console.log(`user ${user.id} found in Users`);
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
};

// adds 'userid' and 'username' to the Users table
export async function addUsers(userID: string, username: string): Promise<void> {

    try {
        const user = await User.create({ id: userID, name: username });
        console.log(`added ${userID} to Users`);
    } catch {
        console.log(`ERROR: could not add ${userID} to Users`);
    }
};

//checks balance for 'userid' in UserWallets 
export async function checkBalance(userID: string): Promise<number | null> {

    try {
        const userBalance = await Wallet.findOne({ where: { userid: userID } });
        if (userBalance) {
            console.log(`Balance for ${userID} is ${userBalance.balance}`);
            return userBalance.balance;
        }
        return null;
    } catch(err) {
        console.error(err);
        return null;
    }
};

/**
 * change 'userid' balance by 'add' (can be positive or negative)
 * @param userID
 * @param add 
 */
export async function changeBalance(userID: string, add: number): Promise<void> {

    try {
        const addBalance = await Wallet.increment({ balance: add }, { where: { userid: userID } });
        console.log(`${userID}'s wallet has been changed by: ${add}`);
    } catch {
        console.log(`ERROR: could not increment ${userID}`);
    }
};

//checks if 'userid' is in UserWallets
export async function checkUserWalletsUser(userID: string): Promise<boolean | null> {

    try {
        const user = await Wallet.findOne({ where: { userid: userID } });
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
};

//Adds 'userid' to UserWallets (balance defaults to 0)
export async function addUserWalletsUser(userID: string): Promise<void> {
    try {
        const user = await Wallet.create({ userid: userID, balance: 0 });
        console.log(`${userID} added to UserWallets`);
    } catch (err) {
        console.error(err);
    }
};


//checks if 'userid' has the given 'gachas' (gachaURL) yet. 
export async function checkGachaInv(userID: string, gachaURL: string): Promise<boolean | null> {

    try {
        const user = await GachaInv.findOne({ where: { userid: userID, gachas: gachaURL } });
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
};

//adds 'userid' and 'gachas'(gachaURL) to the GachaInvs table.
export async function addGacha(userID: string, gachaURL: string): Promise<void> {

    try {
        console.log(`${userID} and ${gachaURL}`);
        const user = await GachaInv.create({ userid: userID, gachas: gachaURL, amt: 1 });
        console.log(`${userID} added to GachaInvs`);
    } catch (err) {
        console.error(`ERROR: Could not add ${userID} to GachaInvs`);
        throw err;
    }
};

/**
 * 
 * @param userID - userid
 * @param gachaURL - gachas
 * increases 'amt' by 1 (level it up).
 */
export async function gachaLvlUp(userID: string, gachaURL: string): Promise<void> {

    try {
        const gacha = await GachaInv.increment({ amt: 1 }, { where: { userid: userID, gachas: gachaURL } });
        console.log(`increased ${gachaURL}'s level by 1 for ${userID}!`);
    } catch {
        console.log(`ERROR: could not increase ${gachaURL}'s level by 1 for ${userID}.`);
    }
};

/**
 * 
 * @param userID - userid
 * @param gachaURL - gachas
 * @returns - 'amt' (lvl), at  'userid', 'gachas'.
 */
export async function checkGachaLevel(userID: string, gachaURL: string): Promise<number | null> {

    try {
        const level = await GachaInv.findOne({ where: { userid: userID, gachas: gachaURL } });
        if (level) {
            return level.amt;
        } else {
            return null;
        }
    } catch {
        console.log(`ERROR: could not check ${userID}'s GachaInv for ${gachaURL}'s level.`);
    }
    return null;
};

export async function findOrCreateDailyWheel(userID: string): Promise<Date | void> {

    try {
        const user = await DailyWheel.findOrCreate({ where: { userid: userID } });
        console.log(`${userID} found or created in DailyWheel`);
    } catch (err) {
        console.error(err);
    }
};

export async function checkSpins(userID: string): Promise<[number, Date] | null> {

    try {
        const wheel = await DailyWheel.findOne({ where: { userid: userID } });

        if (!wheel) return null;

        const endTime = new Date(wheel.createdAt);
        endTime.setHours(endTime.getHours() + 24);
        console.log(`${userID} has to wait until ${endTime} before they can spin again!`);

        return [wheel.spins, endTime];
    } catch (err) {
        console.error(err);
    }
    return null;
};