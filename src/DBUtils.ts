import { User, Wallet, GachaInv } from "./JeffreyDB"

/**
 * Checks if the given userID is in the "User" table.
 * 
 * @param {string} userID - Users Discord ID
 * @returns {Promise<boolean>}- True or False (whether or not their userID is in "User" table)
 */
export async function checkUser(userID: string): Promise<boolean> {

    const user = await User.findOne({ where: { userid: userID } });
    if (user) {
        console.log(`user ${user.userid} found in Users`);
        return true;
    } else {
        console.log(`user ${userID} NOT found in Users`);
        return false;
    }
}

/**
 * Adds a row in the "User" table, which contains a users discord ID and discord Username.
 * 
 * @param {string} userID - Users Discord ID
 * @param {string} username - Users Discord Username(not displayname)
 */
export async function addUser(userID: string, username: string): Promise<void> {

    await User.create({ userid: userID, username: username });
    console.log(`added ${userID} to Users`);
}

/**
 * Searches for the 'balance' associated the given users Discord ID.
 * 
 * If no balance was found, it calls another function to create a new row in "Wallet"-
 * -which contains the users Discord ID, and 'balance' defaults to 0.
 * 
 * (balance is used in a monetary context $$$)
 * 
 * @param {string} userID - Users Discord ID
 * @returns {Promise<number>} -  Returns the users current balance in "Wallet" table.
 *                               Returns 0 if no number was found (default value).
 */
export async function checkBalance(userID: string): Promise<number> {
    const userBalance = await Wallet.findOne({ where: { userid: userID } });
    if (userBalance) {
        console.log(`${userID} has a balance of ${userBalance.balance}`);
        return userBalance.balance;
    } else {
        await findOrAddUserWallet(userID);
        return 0;
    }
}

/**
 * Add or Subtract the 'balance' associated with the users Discord ID-
 * -in the "Wallet" table by 'amount'.
 * 
 * @param userID - Users Discord ID
 * @param amount - Positive or Negative integer to Add or Subtract 'balance' by
 */
export async function addOrSubtractBalance(userID: string, amount: number): Promise<void> {
    await Wallet.increment({ balance: amount }, { where: { userid: userID } });
    console.log(`${userID}'s wallet has been changed by: ${amount}`);
}

/**
 * Checks if there is a row in the "Wallet" table that contains the users Discord ID-
 * -creates one if it is not found.
 * 
 * @param {string} userID - Users Discord ID
 */
export async function findOrAddUserWallet(userID: string): Promise<void> {
    await Wallet.findOrCreate({ where: { userid: userID } });
    console.log(`Found or created Wallet for ${userID}`);
}

/**
 * Checks for a row in GachaInv that contains both 'userID' and 'gachaURL'.
 * Looking for if the user has previously aquired this gacha.(ie: if its a duplicate)
 * 
 * @param {string} userID - Users Discord ID
 * @param {string} gachaURL - URL associated with a specific gacha item (picture).
 * @returns {Promise<boolean>} - True or False (whether or not userID is in the same row as gachaURL in "GachaInv" table)
 */
export async function checkIfUserHasGachaInv(userID: string, gachaURL: string): Promise<boolean> {
    const user = await GachaInv.findOne({ where: { userid: userID, gachas: gachaURL } });
    if (user) {
        console.log(`found ${userID} in GachaInvs`);
        return true;
    } else {
        console.log(`did NOT find ${userID} in GachaInvs`);
        return false;
    }
}

/**
 * Adds a row in "GachaInv" table containing the users Disord ID, their new gacha picture, and setting amt to 1.
 * This function must be called only when we know this row does not already exist (ie: call the checkGachaInv function before this).
 * 
 * @param userID - Users Discord ID
 * @param gachaURL - URL associated with a specific gacha item (picture).
 */
export async function addNewGacha(userID: string, gachaURL: string): Promise<void> {
    await GachaInv.create({ userid: userID, gachas: gachaURL, amt: 1 });
    console.log(`${userID} added to GachaInvs with their new ${gachaURL}`);
}

/**
 * Increases the amount ('amt') column in the row that contains both userID and gachaURL.
 * Function should only be called when it is confirmed that a row exists with 'userID' and 'gachaURL' (ie: the 'checkGachaInv' function).
 *  
 * @example 
 *         (Wallet table)
 *      table starts with: | userID: 8743284 | gachas: https:/sajdjioafh.png | amt: 1 |
 *          table becomes: | userID: 8743284 | gachas: https:/sajdjioafh.png | amt: 2 |
 * 
 * @param userID - Users Discord ID
 * @param gachaURL - URL associated with a specific gacha item (picture).
 */
export async function gachaLvlUp(userID: string, gachaURL: string): Promise<void> {
    await GachaInv.increment({ amt: 1 }, { where: { userid: userID, gachas: gachaURL } });
    console.log(`increased ${gachaURL}'s level by 1 for ${userID}!`);
}

/**
 * Checks the 'amt' number column that is in the row of the users Discord ID and Gacha URL/ID. 
 * 
 * @param {string} userID - Users Discord ID
 * @param {string} gachaURL - URL associated with a specific gacha item (picture).
 * @returns {Promise<number>} - The 'amt' column in the row containing 'userID' and 'gachaURL'
 *                              Returns 0 if no 'amt' was found.(default value is 1, so 0 is impossible for 'amt')
 */
export async function checkGachaLevel(userID: string, gachaURL: string): Promise<number> {
    const level = await GachaInv.findOne({ where: { userid: userID, gachas: gachaURL } });
    if (level) {
        return level.amt;
    } else {
        return 0;
    }
}