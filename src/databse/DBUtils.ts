import { Gacha } from './JeffreyDB';
import { rng } from "../utilities/miscUtils";

/**
 * Takes a rarity, randomly picks one gacha among that rarity, returns it
 * 
 * @param {string} rarity - Which rarity it should choose from
 * @returns {Promise<Gacha>} - random 'rarity' gacha
 */
export async function getRandomGachaOfRarity(rarity: string): Promise<Gacha> {
    const allGachaOfRarity = await Gacha.findAll({ where: { rarity: rarity } });
    const randomGacha = Math.floor(Math.random() * Math.floor(allGachaOfRarity.length));
    return allGachaOfRarity[randomGacha];
}

/**
 * Calls getRandomGachaOfRarity and specifies that it wants a 'legendary' gacha 
 * 
 * @returns {Promise<Gacha>} - 'Gacha' object containing table information about a specific Gacha
 */
export async function getRandomLegendary(): Promise<Gacha> {
    const legendaryGacha = await getRandomGachaOfRarity('legendary');
    return legendaryGacha;
}

/**
 * Randomly selects rarity, then calls getRandomGachaOfRarity to choose a random gacha of that rarity
 * 
 * @param {number} rolls - The number of gacha that should be returned
 * @returns {Promise<Gacha>} - 'Gacha' object containing table information about a random gacha of random rarity.
 */
export async function rollForGacha(rolls: number): Promise<Gacha[]> {
    const gacha: Gacha[] = [];
    for (let i = 0; i < rolls; i++) {
        const rndm = await rng(0, 100);
        let rarity: string;
        if (rndm <= 65) {
            rarity = 'common';
        } else if (rndm > 65 && rndm <= 90) {
            rarity = 'uncommon';
        } else if (rndm > 90 && rndm <= 99) {
            rarity = 'rare';
        } else if (rndm >= 100) {
            rarity = 'legendary';
        }
        const randomGacha = await getRandomGachaOfRarity(rarity!);
        gacha.push(randomGacha);
    }

    return gacha;
}