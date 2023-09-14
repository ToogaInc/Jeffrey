
import { ChatInputCommandInteraction, CommandInteraction, Embed, EmbedBuilder } from 'discord.js';
import { Gacha } from './JeffreyDB';
import { getEmbedColor, rng } from "./utils";
import { checkGachaLevel } from './DBMain';


/**
 * Takes a rarity, randomly picks one gacha among that rarity, returns it
 * 
 * @param {string} rarity - Which rarity it should choose from
 * @returns {Promise<Gacha>} - random 'rarity' gacha
 */
export async function getRandomGacha(rarity: string): Promise<Gacha> {

    const allGachaOfRarity = await Gacha.findAll({ where: { rarity: rarity } });

    const randomGacha = Math.floor(Math.random() * Math.floor(allGachaOfRarity.length));

    const gacha = allGachaOfRarity[randomGacha];

    return gacha;
}

/**
 * Calls getRandomGacha and specifies that it wants a 'legendary' gacha 
 * 
 * @returns {Promise<Gacha>} - 'Gacha' object containing table information about a specific Gacha
 */
export async function getRandomLegendary(): Promise<Gacha> {

    const legendaryGacha = await getRandomGacha('legendary');

    return legendaryGacha;
}

/**
 * Randomly selects rarity, then calls getRandomGacha to choose a random gacha of that rarity
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
        } else if (rndm > 90 && rndm < 99) {
            rarity = 'rare';
        } else if (rndm >= 100) {
            rarity = 'legendary';
        }

        const randomGacha = await getRandomGacha(rarity!);
        gacha.push(randomGacha);
    }

    return gacha;
}

export async function createGachaEmbeds(userID: string, gacha: Gacha[], interaction: CommandInteraction): Promise<EmbedBuilder[]>{

let gachaLevel: number[] = [];
let displayLevel: string[] = [];
const embeds: EmbedBuilder[] = [];
const length = gacha.length;

for (let i = 0; i < length; i++) {
    const getLevel = await checkGachaLevel(userID, gacha[i].id);
    if (!getLevel) {
        console.log(`ERROR: Invalid level for - User: ${userID}, Gacha: ${gacha[i].id}`);
        await interaction.reply('An error has occured, please contact a developer');
    }
    gachaLevel.push(getLevel);

    let starArray = '';
    for (let j = 0; j < gachaLevel[i]; j++) {
        starArray += '⭐';
    }
    let lvlUp = 'Level: ';
    if (gachaLevel[i] > 1) {
        lvlUp = '**Rank Up!** | Level: ';
    }
    displayLevel.push(lvlUp + starArray);

    const color = await getEmbedColor(gacha[i].rarity);

    const embed = new EmbedBuilder();
    embed.setTitle(`${gacha[i].name} Jeffrey`)
        .setDescription(`${gacha[i].description}`)
        .setImage(gacha[i].link)
        .setFields({ name: ' ', value: `${displayLevel[i]}` })
        .setColor(color)
        .setFooter({ text: `${0 + i + 1}/${length}` });

    embeds.push(embed);
}
return embeds;
}