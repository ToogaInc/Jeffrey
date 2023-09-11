
import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ChatInputCommandInteraction, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ComponentType, 
    Message, 
    ButtonInteraction 
    } from "discord.js";
import {
    addOrSubtractWallet,
    addToCollection,
    checkGachaLevel,
    checkOrStartWallet
} from "../DBMain";
import { rollForGacha } from "../DBUtils";
import { getEmbedColor } from "../utils";

export const Roll = {
    info: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll for Jeffrey\'s!')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('How many rolls you want to do (costs 10 coins each!)')
                .setRequired(false)),

    run: async (interaction: ChatInputCommandInteraction, rollingAgain?: number): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('this command can only be done in a server');
            return;
        }

        let rolls: number | null;

        if (rollingAgain) {
            rolls = rollingAgain;
        } else {
            rolls = interaction.options.getInteger('number')

            if (!rolls) {
                rolls = 1;
            }
        }
        const userID = interaction.user.id;

        const currentWallet = await checkOrStartWallet(userID);

        if (!currentWallet && currentWallet !== 0) {
            console.log(`${userID}'s currentWallet is NULL or undefined`);
            interaction.reply('Failed to check balance, please contact a developer');
            return;
        }

        const price = 10;

        if (currentWallet < (price * rolls)) {
            await interaction.reply('not enough JeffreyCoins!');
            return;
        } else {
            await addOrSubtractWallet(userID, -price);
        }

        const gacha = await rollForGacha(rolls);

        let gachaLevel: number[] = [];
        let level: string[] = [];
        const embeds: EmbedBuilder[] = [];

        //Cycle through all rolls, creates embed for each.
        for (let i = 0; i < rolls; i++) {

            await addToCollection(userID, gacha[i].id);

            const getLevel = await checkGachaLevel(userID, gacha[i].id);
            if(!getLevel){
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
            level.push(lvlUp + starArray);

            const color = await getEmbedColor(gacha[i].rarity);

            const embed = new EmbedBuilder();
            embed.setTitle(`${gacha[i].name} Jeffrey`)
                .setDescription(`${gacha[i].description}`)
                .setImage(gacha[i].link)
                .setFields({ name: ' ', value: `${level[i]}` })
                .setColor(color)
                .setFooter({ text: `${0 + i + 1}/${rolls}` });

            embeds.push(embed);
        }

        const next = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary);

        const previous = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const rollAgain = new ButtonBuilder()
            .setCustomId('roll_again')
            .setLabel('Roll Again!')
            .setStyle(ButtonStyle.Danger);

        if (rolls === 1) {
            next.setDisabled(true);
        }
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(previous, next, rollAgain);

        let currentGacha = 0;

        if (rollingAgain) {
            await interaction.channel?.send(`${interaction.user} rolled for ${rolls} Jeffrey(s)!`);
        } else {
            await interaction.reply(`${interaction.user} rolled for ${rolls} Jeffrey(s)!`);
        }
        const gachaMessage = await interaction.channel?.send({
            content: `**${gacha[currentGacha].rarity.toUpperCase()} JEFFREY**`,
            embeds: [embeds[currentGacha]],
            components: [row],
        });

        if (!gachaMessage) {
            await interaction.reply('Could not send message embed, please contact a developer');
            return;
        }

        const collector = gachaMessage!.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 1_800_000 });

        collector.on('collect', async i => {

            let first = true;
            let last = false;
            if (i.customId === 'next') {
                currentGacha += 1;
            }
            if (i.customId === 'previous') {
                currentGacha -= 1;
            }
            if (rolls! - currentGacha <= 1) {
                last = true;
            } else {
                last = false;
            }
            if (currentGacha < 1) {
                first = true;
            } else {
                first = false;
            }
            let msg = `**${gacha[currentGacha].rarity.toUpperCase()} JEFFREY**`;
            await updateEmbed(msg, i, embeds[currentGacha], first, last);

            if (i.customId === 'roll_again') {
                if (!interaction.channel) return;
            
                const filter = (m: Message) => m.author.id === interaction.user.id;
                await interaction.channel.send(`How many more rolls would you like to do? (Please type a number)`);
                const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            
                const collectListener = async (collected: Message) => {
                    const content = collected.content;
                    const parsedNumber = Number(content);
            
                    if (!isNaN(parsedNumber)) {
                        
                        collector.off('collect', collectListener);
                        await Roll.run(interaction, parsedNumber);
                    } else {
                        await interaction.channel?.send('Please type a valid number!');
                    }
                };

                collector.on('collect', collectListener);
            }
            
        });
    }
};

async function updateEmbed(msg: string, interaction: ButtonInteraction, embed: EmbedBuilder, first: boolean, last: boolean): Promise<void> {

    const next = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary);

    const previous = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary);

    const rollAgain = new ButtonBuilder()
        .setCustomId('roll_again')
        .setLabel('Roll Again!')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>()

    if (first) {
        previous.setDisabled(true);
    }
    if (last) {
        next.setDisabled(true);
    }
    row.setComponents(previous, next, rollAgain);

    if (first) {
        row
    }
    await interaction.update({ content: msg, embeds: [embed], components: [row] });
}