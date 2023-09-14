
import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    ButtonBuilder,
    ActionRowBuilder,
    ComponentType,
    Message
} from "discord.js";
import {
    addOrSubtractWallet,
    addToCollection,
    checkGachaLevel,
    checkOrStartWallet
} from "../DBMain";
import { rollForGacha } from "../DBUtils";
import { checkIfFirstOrLast, getEmbedColor, tryDelete } from "../utils";
import { BUTTONS as b } from "../constants/buttons";

let rollAgainInUse = false;

export const Roll = {
    info: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll for Jeffrey\'s!')
        .addIntegerOption(option =>
            option.setName('rolls')
                .setDescription('How many rolls you want to do (costs 10 coins each!)')
                .setRequired(false)),

    run: async (interaction: ChatInputCommandInteraction, rollingAgain?: number): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('this command can only be done in a server');
            return;
        }

        let rolls = 1

        if (rollingAgain && rollingAgain > 0) {
            rolls = rollingAgain;
        } else {
            const checkIfRolls = interaction.options.getInteger('rolls')
            if (checkIfRolls) {
                rolls = checkIfRolls;
            }
        }
        const userID = interaction.user.id;

        const currentWallet = await checkOrStartWallet(userID);

        if (!currentWallet && currentWallet !== 0) {
            console.log(`${userID}'s currentWallet is NULL or undefined`);
            await interaction.reply('Failed to check balance, please contact a developer');
            return;
        }

        const price = 10;
        const totalPrice = price * rolls;
        if (currentWallet < totalPrice) {
            if (rollingAgain) {
                await interaction.channel?.send('Not enough JeffreyCoins!');
                return;
            }
            await interaction.reply('Not enough JeffreyCoins!');
            return;
        } else {
            await addOrSubtractWallet(userID, -totalPrice);
        }

        const gacha = await rollForGacha(rolls);

        for (let i = 0; i < rolls; i++) {
            await addToCollection(userID, gacha[i].id);
        }

        let gachaLevel: number[] = [];
        let displayLevel: string[] = [];
        const embeds: EmbedBuilder[] = [];

        //Cycle through all rolls, creates embed for each.
        for (let i = 0; i < rolls; i++) {

            await addToCollection(userID, gacha[i].id);

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
                .setFooter({ text: `${0 + i + 1}/${rolls}` });

            embeds.push(embed);
        }

        if (rolls === 1) {
            b.next.setDisabled(true);
        }
        //previous starts disabled
        const row = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(b.previous, b.next, b.rollAgain);

        let currentGacha = 0;

        if (rollingAgain && rollingAgain > 0) {
            await interaction.channel?.send(`${interaction.user} rolled for ${rolls} Jeffrey(s)!`);
        } else {
            await interaction.reply(`${interaction.user} rolled for ${rolls} Jeffrey(s)!`);
        }
        const gachaMessage = await interaction.channel?.send({
            content: `**${gacha[currentGacha].rarity.toUpperCase()} JEFFREY**`,
            embeds: [embeds[currentGacha]],
            components: [row]
        });

        if (!gachaMessage) {
            await interaction.reply('Could not send message embed, please contact a developer');
            return;
        }

        const buttonCollector = gachaMessage.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 1_800_000 });

        buttonCollector.on('collect', async i => {

            if (i.customId === 'next') {
                currentGacha += 1;
                await checkIfFirstOrLast(currentGacha, rolls);
                await i.update({
                    content: `**${gacha[currentGacha].rarity.toUpperCase()}**`,
                    embeds: [embeds[currentGacha]],
                    components: [row]
                });
            }
            if (i.customId === 'previous') {
                currentGacha -= 1;
                await checkIfFirstOrLast(currentGacha, rolls);
                await i.update({
                    content: `**${gacha[currentGacha].rarity.toUpperCase()}**`,
                    embeds: [embeds[currentGacha]],
                    components: [row]
                });
            }

            if (i.customId === 'roll_again') {
                if (rollAgainInUse) {
                    await i.update({})
                    await interaction.channel?.send('Please complete your previous roll again before using this one!');
                } else {
                    rollAgainInUse = true;
                    row.setComponents(b.previous, b.next);

                    await i.update({ components: [row] });
                    const rollAgainMsg = await interaction.channel?.send(`How many more rolls would you like to do? (Please type a number, type '0' to cancel)`);

                    const msgFilter = (m: Message) => m.author.id === interaction.user.id;
                    const msgCollector = interaction.channel!.createMessageCollector({ filter: msgFilter, time: 60_000 });

                    msgCollector.on('collect', async m => {
                        await tryDelete(m);
                        if (m.content === '0') {
                            await tryDelete(rollAgainMsg!);
                            msgCollector.stop();
                        }
                        const content = m.content;
                        const parsedNumber = Number(content);

                        if (!isNaN(parsedNumber)) {
                            msgCollector.stop();
                            rollAgainInUse = false;
                            await Roll.run(interaction, parsedNumber);
                            return;
                        } else {
                            await interaction.channel?.send('Please type a valid number!');
                        }
                    });
                }
            }
        });
    }
};