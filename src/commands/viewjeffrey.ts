import { ActionRowBuilder, ButtonBuilder, CommandInteraction, ComponentType, SlashCommandBuilder } from 'discord.js';
import { findAllUserGachas } from '../DBMain';
import { createGachaEmbeds } from '../DBUtils';
import { BUTTONS as b } from '../constants/buttons';
export const ViewJeffrey = {
    info: new SlashCommandBuilder()
        .setName('viewjeffrey')
        .setDescription('So you can see all your cute Jeffrey\'s!'),

    run: async (interaction: CommandInteraction): Promise<void> => {
        const userID = interaction.user.id;
        const gacha = await findAllUserGachas(userID);
        const embeds = await createGachaEmbeds(userID, gacha, interaction);
        const length = gacha.length;

        if (length === 1) {
            b.next.setDisabled(true);
        }
        const row = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(b.previous, b.next);

        let currentGacha = 0;

        const gachaMessage = await interaction.reply({
            content: `**${gacha[currentGacha].rarity.toUpperCase()}**`,
            embeds: [embeds[currentGacha]],
            components: [row]
        });

        const buttonCollector = gachaMessage.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 1_800_000 });

        buttonCollector.on('collect', async i => {

            if (i.customId === 'next') {
                currentGacha += 1;
                const nextRow = await checkIfFirstOrLast(row, length, currentGacha);
                await i.update({
                    content: `**${gacha[currentGacha].rarity.toUpperCase()}**`,
                    embeds: [embeds[currentGacha]],
                    components: [nextRow]
                });
            }
            if (i.customId === 'previous') {
                currentGacha -= 1;
                const prevRow = await checkIfFirstOrLast(row, length, currentGacha);
                await i.update({
                    content: `**${gacha[currentGacha].rarity.toUpperCase()}**`,
                    embeds: [embeds[currentGacha]],
                    components: [prevRow]
                });
            }
        })

        }
    
};

export async function checkIfFirstOrLast(row: ActionRowBuilder<ButtonBuilder>, rolls: number, currentGacha: number): Promise<ActionRowBuilder<ButtonBuilder>> {

    if (rolls - currentGacha <= 1) {
        b.next.setDisabled(true);
    } else {
        b.next.setDisabled(false);
    }
    if (currentGacha < 1) {
        b.previous.setDisabled(true);
    } else {
        b.previous.setDisabled(false);
    }
    return row.setComponents(b.previous, b.next);
}