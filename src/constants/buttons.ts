import { ButtonBuilder, ButtonStyle } from "discord.js";

export namespace BUTTONS {
    export const NEXT_ID: string = 'next';
    export const NEXT_BUTTON = new ButtonBuilder()
        .setCustomId(NEXT_ID)
        .setLabel('Next ➡')
        .setStyle(ButtonStyle.Primary);

    export const PREVIOUS_ID: string = 'previous';
    export const PREVIOUS_BUTTON = new ButtonBuilder()
        .setCustomId(PREVIOUS_ID)
        .setLabel('⬅ Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    export const ROLL_AGAIN_ID: string = 'roll_again';
    export const ROLL_AGAIN_BUTTON = new ButtonBuilder()
        .setCustomId(ROLL_AGAIN_ID)
        .setLabel('🔁 Roll Again!')
        .setStyle(ButtonStyle.Danger);
}