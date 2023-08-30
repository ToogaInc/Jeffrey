import { JeffreyGotchaURLs, displayLegendary } from "../JeffreyGacha";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { replyWithEmbed, rng } from '../utils';
import { addUserWalletsUser, changeBalance, checkBalance, checkUserWalletsUser } from "../DBUtils";

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

        if (rndm <= 55) {
            raritySelect = 'Common';
        } else if (rndm > 55 && rndm <= 80) {
            raritySelect = 'Uncommon';
        } else if (rndm > 81 && rndm < 97) {
            raritySelect = 'Rare';
        } else if (rndm >= 97) {
            raritySelect = 'Legendary';
        } else {
            console.log('error choosing random rarity for Roll command');
            return;
        }
        const rarity = JeffreyGotchaURLs[raritySelect];
        const chooseGacha = await rng(0, rarity.length - 1);
        const gacha = rarity[chooseGacha];
        const displayRarity = raritySelect.toUpperCase();

        if (raritySelect !== 'Legendary') {
            const embed = new EmbedBuilder()
                .setTitle(`You pulled a **${displayRarity}** Jeffrey!`)
                .setAuthor({ name: `${interaction.user.displayName}` })
                .setImage(gacha);
                console.log(gacha);
                await replyWithEmbed(embed, interaction);

        } else if (raritySelect === 'Legendary') {
            const legendaryInfo = await displayLegendary(gacha);
            if (!legendaryInfo || !legendaryInfo[0] || !legendaryInfo[1]) {
                console.log(`ERROR: could not find legendaryInfo`);
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle('YOU PULLED A LEGENDARY JEFFREY!!!')
                .setAuthor({ name: `${interaction.user.displayName}` })
                .setImage(gacha)
                .addFields({ name: `${legendaryInfo[0]}`, value: `${legendaryInfo[1]}` });

                await replyWithEmbed(embed, interaction);
        } else {
            console.log(`ERROR: gacha for ${userID} is somehow neither legendary NOR !legendary`);
            return;
        }
    }
};