import { JeffreyGachaURLs, displayLegendary } from "../JeffreyGacha";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, InviteTargetType } from "discord.js";
import { replyWithEmbed, rng } from '../utils';
import {
    addGacha,
    addUserWalletsUser,
    changeBalance,
    checkBalance,
    checkGachaInv,
    checkUserWalletsUser,
    gachaLvlUp,
    checkGachaLevel
} from "../DBUtils";

export const Roll = {
    info: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll for Jeffrey\'s!'),

    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('this command can only be done in a server');
            return;
        }
        let embed;
        let currentBalance;
        const userID = interaction.user.id;
        try {
            const user = await checkUserWalletsUser(userID);
            if (!user) {
                await addUserWalletsUser(userID);
            }
        } catch {
            console.log("could not findorcreate target");
        }

        try {
            currentBalance = await checkBalance(userID);
        } catch {
            console.log(`ERROR: Could not chekc balance for ${userID}`);
        }

        if (!currentBalance) {
            console.log(`${userID}'s currentBalance is NULL or undefined`);
            return;
        }

        if (currentBalance < 5) {
            await interaction.reply('not enough JeffreyCoins!');
            return;
        } else {
            await changeBalance(userID, -5);
            currentBalance -= 5;
        }

        const rndm = await rng(0, 100);
        let raritySelect: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

        if (rndm <= 65) {
            raritySelect = 'Common';
        } else if (rndm > 65 && rndm <= 90) {
            raritySelect = 'Uncommon';
        } else if (rndm > 90 && rndm < 99) {
            raritySelect = 'Rare';
        } else if (rndm >= 100) {
            raritySelect = 'Legendary';
        } else {
            console.log('error choosing random rarity for Roll command');
            return;
        }
        const rarity = JeffreyGachaURLs[raritySelect];
        const chooseGacha = await rng(0, rarity.length - 1);
        const gachaObj = rarity[chooseGacha];
        const gacha = (typeof gachaObj === 'string' ? gachaObj : gachaObj.link);

        const displayRarity = raritySelect.toUpperCase();

        const gachaInv = await checkGachaInv(userID, gacha);
        if (!gachaInv) {
            console.log(gacha);
            await addGacha(userID, gacha);
        } else {
            await gachaLvlUp(userID, gacha);
        }

        if (raritySelect !== 'Legendary') {
            embed = new EmbedBuilder()
                .setTitle(`You pulled a **${displayRarity}** Jeffrey!`)
                .setAuthor({ name: `${interaction.user.displayName}` })
                .setImage(gacha);

        } else if (raritySelect === 'Legendary') {
            const legendaryInfo = await displayLegendary(gacha);
            if (!legendaryInfo || !legendaryInfo[0] || !legendaryInfo[1]) {
                console.log(`ERROR: could not find legendaryInfo`);
                return;
            } else {
                console.log(`${gacha} rarity for ${userID} is somehow neither legendary NOR !legendary. (${rarity} ${raritySelect})`)
            }
            embed = new EmbedBuilder()
                .setTitle('YOU PULLED A LEGENDARY JEFFREY!!!')
                .setAuthor({ name: `${interaction.user.displayName}` })
                .setImage(gacha)
                .addFields({ name: `${legendaryInfo[0]}`, value: `${legendaryInfo[1]}` });
        }
        if (!embed) {
            console.log(`ERROR: Embed is undefined!`);
            return;
        }
        const gachaLevel = await checkGachaLevel(userID, gacha);
        let starArray = '';
        if (!gachaLevel) {
            console.log(`gachaLevel is ${gachaLevel} (NULL)`);
            return;
        }
        for (let i = 0; i < gachaLevel; i++) {
            starArray += '⭐';
        }
        embed.setDescription(starArray);
        try {
            await replyWithEmbed(embed, interaction);
        } catch {
            console.log(`ERROR: could not reply with embed in ${interaction.channelId}`);
        }
    }
};