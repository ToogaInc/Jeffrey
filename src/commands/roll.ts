import { JeffreyGachaURLs, displayLegendary } from "../JeffreyGacha";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { replyWithEmbed, rng } from '../utils';
import {
    addNewGacha,
    findOrAddUserWallet,
    AddOrSubtractBalance,
    checkBalance,
    gachaLvlUp,
    checkGachaLevel,
    checkIfUserHasGachaInv
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
        let embed: EmbedBuilder;
        let currentBalance: number;

        const price: number = 5;
        const userID = interaction.user.id;

        await findOrAddUserWallet(userID);

        currentBalance = await checkBalance(userID);

        if (!currentBalance && currentBalance !== 0) {
            console.log(`${userID}'s currentBalance is NULL or undefined`);
            interaction.reply('Failed to check balance, please contact a developer');
            return;
        }

        if (currentBalance < price) {
            await interaction.reply('not enough JeffreyCoins!');
            return;
        } else {
            await AddOrSubtractBalance(userID, -price);
            currentBalance -= price;
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
        const gacha = gachaObj.link;

        const displayRarity = raritySelect.toUpperCase();

        const gachaInv = await checkIfUserHasGachaInv(userID, gacha);
        if (!gachaInv) {
            console.log(gacha);
            await addNewGacha(userID, gacha);
        } else {
            await gachaLvlUp(userID, gacha);
        }
        if (raritySelect !== 'Legendary') {
            embed = new EmbedBuilder()
                .setTitle(`You pulled a **${displayRarity}** Jeffrey!`)
                .setAuthor({ name: `${interaction.user.displayName}` })
                .setImage(gacha);

        } else {
            const legendaryInfo = await displayLegendary(gacha);

            if (!legendaryInfo || !legendaryInfo[0] || !legendaryInfo[1]) {
                console.log(`ERROR: could not find legendaryInfo`);
                await interaction.reply('Sorry the command could not be completed, please contact a developer.');
            } else {
                embed = new EmbedBuilder()
                    .setTitle('YOU PULLED A LEGENDARY JEFFREY!!!')
                    .setAuthor({ name: `${interaction.user.displayName}` })
                    .setImage(gacha)
                    .addFields({ name: `${legendaryInfo[0]}`, value: `${legendaryInfo[1]}` });
            }
        }
        if (!embed!) {
            console.log(`ERROR: Embed is undefined!`);
            await interaction.reply('Sorry the command could not be completed, please contact a developer.')
        }
        const gachaLevel = await checkGachaLevel(userID, gacha);
        let starArray = '';
        if (!gachaLevel) {
            console.log(`gachaLevel is ${gachaLevel} (NULL)`);
            await interaction.reply('Sorry the command could not be completed, please contact a developer.')
        }
        for (let i = 0; i < gachaLevel; i++) {
            starArray += '⭐';
        }
        embed!.setDescription(starArray);
        try {
            await replyWithEmbed(embed!, interaction);
        } catch {
            console.log(`ERROR: could not reply with embed in ${interaction.channelId}`);
            return;
        }
    }
};