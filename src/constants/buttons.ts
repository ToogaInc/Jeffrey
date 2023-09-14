import { ButtonBuilder, ButtonStyle } from "discord.js"

export const BUTTONS = {
    addMessage: new ButtonBuilder()
        .setCustomId('add_message')
        .setLabel('✉ Add/Change Message')
        .setStyle(ButtonStyle.Primary),

    addUsers: new ButtonBuilder()
        .setCustomId('add_users')
        .setLabel('➕ Add Users')
        .setStyle(ButtonStyle.Primary),

    send: new ButtonBuilder()
        .setCustomId('send')
        .setLabel('📤 Send')
        .setStyle(ButtonStyle.Success),

    back: new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅ Back')
        .setStyle(ButtonStyle.Danger),

    done: new ButtonBuilder()
        .setCustomId('done')
        .setLabel('✅ Done')
        .setStyle(ButtonStyle.Success),

    reset: new ButtonBuilder()
        .setCustomId('reset')
        .setLabel('🔃 Reset')
        .setStyle(ButtonStyle.Danger),

    cancel: new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('❌ Cancel')
        .setStyle(ButtonStyle.Danger),

    yes: new ButtonBuilder()
        .setCustomId('yes')
        .setLabel('✅ Yes')
        .setStyle(ButtonStyle.Success)
}

