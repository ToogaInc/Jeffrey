import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkSpins, findOrCreateDailyWheel, changeBalance } from '../DBUtils';
import { spinWheel, JeffreyGachaURLs, displayLegendary } from '../JeffreyGacha';
import { replyWithEmbed, rng } from '../utils';

export const Spin = {
    info: new SlashCommandBuilder()
        .setName('spin')
        .setDescription('Spin the daily wheel! (up to 5 times per day)'),

    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild) return;
        const userID = interaction.user.id;

        await findOrCreateDailyWheel(userID);

        //check how many spins user has left today and when the spins reset
        let spinInfo = await checkSpins(userID);

        if(!spinInfo) {
            console.log(`ERROR: check spins is NULL for ${userID}`)
            return;
        }
        if(spinInfo[0]< 1){
            await interaction.reply(`You've exhausted your 5 spins today! Your spins refresh at ${spinInfo[1]}`);
            return;
        }
        //if NULL spins then add user to DailyWheel
        const result = await spinWheel(userID);
        if (!result) return;

        const [reward, coins] = result;

        if (coins !== -1) {
            await changeBalance(userID, coins);
            await interaction.reply(`** **\nYou got ${reward[0]}\n\n${reward[1]}`);
        } else if (coins === -1) {

            const legendary = JeffreyGachaURLs['Legendary'];
            const chooseGacha = await rng(0, legendary.length - 1);
            const gachaArray = legendary[chooseGacha];
            const gacha = (typeof gachaArray === 'string' ? gachaArray : gachaArray.link);

            const legendaryInfo = await displayLegendary(gacha);

            if (!legendaryInfo) return;

            const embed = new EmbedBuilder()
                .setTitle(`You got a ${reward[0]}`)
                .setDescription(reward[1])
                .setAuthor({ name: `${interaction.user.displayName}` })
                .setImage(gacha)
                .addFields({ name: `${legendaryInfo[0]}`, value: `${legendaryInfo[1]}` });

            await replyWithEmbed(embed, interaction);
        }
    }
};
