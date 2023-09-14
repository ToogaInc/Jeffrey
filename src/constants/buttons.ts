import { ButtonBuilder, ButtonStyle } from "discord.js";

export const BUTTONS = {
    next: new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary),

    previous: new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),

    rollAgain: new ButtonBuilder()
        .setCustomId('roll_again')
        .setLabel('Roll Again!')
        .setStyle(ButtonStyle.Danger)
}