import { User, Wallet, Gacha, Collection } from "./JeffreyDB";

/**
 * Checks if the given userID is in the "User" table, if not add it.
 * 
 * @param {string} userID - Discord ID
 * @param {string} username - Discord Username
 * @param {string} displayName - Discord users Display Name in that server
 * @returns {Promise<User>} - Returns 'User' object which contains all information from the found/created row in table.
 */
export async function findOrAddToUser(userID: string, username: string, displayName: string): Promise<User> {

    const [user, created] = await User.findOrCreate({ where: { id: userID, name: username, display_name: displayName } });
    if (created) {
        console.log(`Created new "User" row for - User: ${userID}`);
    } else {
        console.log(`User already in database "User" - User: ${userID}`);
    }
    return user;
}

/**
 * Searches for the 'balance' associated the given user ID.
 * If none was found, creates one.
 * The user ID is the same for that user in every database table that contains a user_id.
 * 
 * @param {string} userID - user ID that is consistent across all database tables
 * @returns {Promise<number>} -  Returns the users current balance in "Wallet" table.
 */
export async function checkOrStartWallet(userID: string): Promise<number> {
    const [userWallet, created] = await Wallet.findOrCreate({ where: { user_id: userID } });

    if (created) {
        console.log(`Created new "Wallet" row for - User: ${userID}`);
        return 0;
    } else {
        console.log(`User already in database "Wallet" - User: ${userID}`);
    }

    console.log(`User: ${userID} has a balance of ${userWallet.balance}`);
    return userWallet.balance;
}

/**
 * Add or Subtract the 'balance' associated with the user ID in the "Wallet" table by 'amount'.
 * Function should only be used if you know that the row with 'user_id' exists (ie: call the checkOrStartWallet)
 * 
 * @param {string} userID - Users Discord ID
 * @param {number} amount - Positive or Negative integer to Add or Subtract 'balance' by
 */
export async function addOrSubtractWallet(userID: string, amount: number): Promise<void> {

    await Wallet.increment({ balance: amount }, { where: { user_id: userID } });

    console.log(`${userID}'s wallet has been changed by: ${amount}`);
}

/**
 * Checks for a row in GachaInv that contains both 'userID' and 'gachaID'.
 * Looking for if the user has previously aquired this gacha.(ie: if its a duplicate)
 * If its a duplicate, increase its level by 1 (up to 5);
 * 
 * @param {string} userID - Users Discord ID
 * @param {number} gachaID - ID for the gacha they have aquired
 * @returns {Promise<Collection>} - 'Collection' object contains all information in affected row.
 */
export async function levelUpOrAddGachaToCollection(userID: string, gachaID: number): Promise<Collection> {
    const [gacha, created] = await Collection.findOrCreate({ where: { user_id: userID, gacha_id: gachaID } });
    if (!created) {
        if (gacha.level < 5) {
            const [leveledGacha] = await Collection.increment({ level: 1 }, { where: { user_id: userID, gacha_id: gachaID } });
            gacha.level += 1;
            return gacha;
        } else {
            return gacha;
        }
    } else {
        console.log(`${gachaID} added to Collection for - User: ${userID}`);
        return gacha;
    }
}

/**
 * Checks the 'level' column that is in the same row as userID and gachaID
 * Should only be used when you know that gachaID exists in the same row as userID
 * 
 * @param {string} userID - Users Discord ID
 * @param {number} gachaID - ID associated with specific gacha
 * @returns {Promise<number>} - The 'amt' column in the row containing 'userID' and 'gachaID'
 */
export async function checkGachaLevel(userID: string, gachaID: number): Promise<number> {
    const lvl = await Collection.findOne({ where: { user_id: userID, gacha_id: gachaID } });
    if (lvl) {
        return lvl.level;
    } else {
        return 0;
    }
};
/**
 * Get the link, name, description and rarity from a specific Gacha.
 * 
 * @param {number} gachaID - Gacha ID associated with a specifc Gacha.
 * @returns {Promise<Gacha | null>} - returns the 'Gacha' object which contains information about a specifc gacha
 */
export async function gachaInfo(gachaID: number): Promise<Gacha | null> {
    try{
    const gachaInfo = await Gacha.findOne({ where: { id: gachaID } });
    return gachaInfo;
    }catch(e){
        console.error(e);
        return null;
    }

}
/**
 * 
 * 
 * @param {string} userID - Users Discord ID 
 * @param gachaID - ID associated with a specific Gacha
 * @returns {Promise<Collection | [Collection, boolean]>} - 'Collection' object containing information on specified row in table.
 *                                                        -  Also returns true if Gacha is max level.
 */
export async function addToCollection(userID: string, gachaID: number): Promise<Collection | [Collection, boolean]> {
    const gacha = await Gacha.findOne({ where: { id: gachaID } })
    const [userGacha, created] = await Collection.findOrCreate({ where: { user_id: userID, gacha_id: gacha!.id } });

    if (!created) {
        if (userGacha.level < 5) {
            await userGacha.increment({ level: 1 });
            await userGacha.reload();
            console.log(`Increased level of - GachaID: ${gachaID} for - User: ${userID} `);
            return userGacha;
        } else {
            return [userGacha, true];
        }
    } else {
        console.log(`GachaID: ${gachaID} - has been added to the Collection of - User: ${userID}`);
        return userGacha
    }
}
