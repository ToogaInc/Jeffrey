import { 
ChatInputCommandInteraction, 
SlashCommandBuilder, 
EmbedBuilder, 
ActionRowBuilder, 
ButtonBuilder, 
ButtonStyle, 
ComponentType, 
MessageCollector, 
User 
} from 'discord.js';
import { tryDelete, tryToDMEmbed } from '../utils';

const MAX_CHOICES = 15;

export const DM = {
    info: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('The bot will DM the specified user(s), a specified message.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Please type the message you would like me to send!'))
        .addBooleanOption(option =>
            option.setName('anon')
                .setDescription('True: Name shown to recipients (default) | False: Name NOT shown.')
                .setRequired(false)),

    addChoiceOptions: () => {
        for (let i = 0; i < MAX_CHOICES; i++) {
            DM.info.addUserOption(option =>
                option.setName(`user${i + 1}`)
                    .setDescription(`One of the users that will be DM\'d`)
                    .setRequired(false));
        }
    },
    run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('This command can only be run in a server!');
            return;
        }
        const userID = interaction.user.id;

        let higherUp = false;

        const getRole = interaction.guild.roles.cache;

        const role = [
            getRole.find(role => role.name.toLowerCase() === 'moderator'),
            getRole.find(role => role.name.toLowerCase() === 'officer'),
            getRole.find(role => role.name.toLowerCase() === 'head raid leader')
        ];

        const commandUser = await interaction.guild.members.fetch(userID);

        for (const currentRole of role) {
            if (!currentRole) {
                console.log(`ERROR finding higher up role(s) for balance command`);
                continue;
            }
            if (commandUser.roles.cache.has(currentRole.id)) {
                higherUp = true;
                break;
            }
        }
        if (!higherUp) {
            await interaction.reply('Only officer+ can use this command!');
            return;
        }

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('❌ Cancel')
            .setStyle(ButtonStyle.Danger);

        const yes = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('📤 Yes, Send!')
            .setStyle(ButtonStyle.Success);

        //checks the 'message' string option
        const message = interaction.options.getString('message');
        let users: User[] = [];
        //checks all 'user' options.
        for (let i = 0; i < MAX_CHOICES; i++) {
            const getUser = interaction.options.getUser(`user${i + 1}`);
            if (getUser) {
                users.push(getUser);
            }
        }
        //if command users used the message and user options/shortcuts.
        if (message && users.length > 0) {
            //confirmation embed
            const embed = new EmbedBuilder()
                .setDescription(`**Are you sure you want to send this message to these users?**`)
                .setFields(
                    { name: '__Message Recipients:__ ', value: users.join(', ') },
                    { name: '__Current Message:__ ', value: message });

            //confirmation action row with buttons
            const row = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(cancel, yes);

            const embedMessage = await interaction.reply({ content: `Please read over the following:`, embeds: [embed], components: [row] });

            const collector = embedMessage.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 60_000 });

            collector.on('collect', async i => {
                if (i.customId === 'cancel') {
                    await i.update({});
                    await interaction.editReply({ content: `Process Canceled.`, components: [] });
                    return;
                }

                else if (i.customId === 'yes') {
                    await i.update({});
                    await sendDMs(message, users);
                    return;
                }
            })
        }
        //if there is a message and no users, or users and no message - specified options.
        else if (message && users.length < 1 || !message && users.length > 0) {
            await interaction.reply('If you specify a message, you must also specify at least one user (and vice-versa).');
            return;
        }
        //if no message or user options were specified
        else {
            const startEmbed = new EmbedBuilder()
                .setTitle('DM User(s)')
                .addFields(
                    { name: 'Please use the buttons below to: ', value: '- Create your desired message.' },
                    { name: ' ', value: '- Choose which user(s) you would like the bot to send the message to.' },
                    { name: ' ', value: '- Finally, click the "Send" button when you are finished.' }
                );

            const addMsgEmbed = new EmbedBuilder()
                .setTitle('Create/Change Message')
                .addFields({ name: ' ', value: '*Please type the message you would like me to send for you! Click "Done" when you are satisfied with the message.*' });

            const addUsersEmbed = new EmbedBuilder()
                .setTitle('Add Users')
                .setDescription('Please type the names of the users you\'d like me to DM!');

            const addMessage = new ButtonBuilder()
                .setCustomId('add_message')
                .setLabel('✉ Add/Change Message')
                .setStyle(ButtonStyle.Primary);
            const addUsers = new ButtonBuilder()
                .setCustomId('add_users')
                .setLabel('➕ Add Users')
                .setStyle(ButtonStyle.Primary);

            const send = new ButtonBuilder()
                .setCustomId('send')
                .setLabel('📤 Send')
                .setStyle(ButtonStyle.Success);

            const back = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('⬅ Back')
                .setStyle(ButtonStyle.Danger);

            const done = new ButtonBuilder()
                .setCustomId('done')
                .setLabel('✅ Done')
                .setStyle(ButtonStyle.Success);

            const reset = new ButtonBuilder()
                .setCustomId('reset')
                .setLabel('🔃 Reset')
                .setStyle(ButtonStyle.Danger);

            const startRow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(cancel, addMessage, addUsers, send);

            const addMsgRow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(back, done);
            const addUsersRow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(back, done, reset);

            const confirmRow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(back, yes);


            const embedMessage = await interaction.reply({ content: 'Please follow the instructions below!', embeds: [startEmbed], components: [startRow] });

            if (!embedMessage) {
                await interaction.reply('An error has occurred, please contact a developer.');
                return;
            }

            const buttonCollector = embedMessage.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 60_000 });

            let msgCollector: MessageCollector;
            let userCollector: MessageCollector;
            let memberList: User[] = [];
            let DM = '';

            buttonCollector.on('collect', async i => {

                if (i.customId === 'add_message') {
                    await i.update({ embeds: [addMsgEmbed], components: [addMsgRow] })

                    msgCollector = interaction.channel!.createMessageCollector({
                        filter: (m) => m.author.id === userID,
                        time: 60_000,
                    });

                    msgCollector.on('collect', async m => {
                        await tryDelete(m);
                        if (m.content) {
                            DM = m.content;
                            if (DM.length > 1024) {
                                DM = '**__Message too long! (limit: 1024 characters)__**';
                            }
                            addMsgEmbed.setFields({ name: '__Current Message:__ ', value: DM });
                        } else {
                            await interaction.channel?.send('Could not read message.');
                        }
                        await i.editReply({ embeds: [addMsgEmbed], components: [addMsgRow] });
                    });
                }

                else if (i.customId === 'add_users') {
                    await i.update({ embeds: [addUsersEmbed], components: [addUsersRow] });

                    userCollector = interaction.channel!.createMessageCollector({
                        filter: (m) => m.author.id === userID,
                        time: 60_000,
                    });

                    userCollector.on('collect', async m => {
                        await tryDelete(m);
                        const words = m.content.split(' ');

                        for (const currentWord of words) {

                            let member = interaction.guild?.members.cache.find((member) =>
                                member.user.username === currentWord ||
                                member.user.displayName === currentWord ||
                                member.user.id === currentWord
                            ); if (!member) {
                                const fetchMember = await interaction.guild?.members.fetch({ query: currentWord, limit: 1 });
                                if (fetchMember) {
                                    member = fetchMember.first();
                                }
                            }
                            if (member) {
                                if (memberList.includes(member.user)) {
                                    continue;
                                } else {
                                    memberList.push(member.user);
                                }
                            }
                            addUsersEmbed.setFields({ name: '__Message Recipients:__ ', value: memberList.join(', ') });
                        }
                        await interaction.editReply({ embeds: [addUsersEmbed], components: [addUsersRow] });
                    });
                }

                else if (i.customId === 'cancel') {
                    await interaction.editReply({ content: 'Process canceled', components: [] });
                    console.log('Stopped all Collectors');
                    return;
                }

                else if (i.customId === 'done') {
                    msgCollector?.stop();
                    userCollector?.stop();

                    startEmbed.setTitle('DM User(s)')
                        .setFields(
                            { name: 'Please use the buttons below to: ', value: '- Create your desired message.' },
                            { name: ' ', value: '- Choose which user(s) you would like the bot to send the message to.' },
                            { name: ' ', value: '- Finally, click the "Send" button when you are finished.' }
                        );
                    if (memberList.length > 0) {
                        startEmbed.addFields({ name: '__Message Recipients:__ ', value: memberList.join(', ') });
                    }
                    if (DM.length > 0 && DM !== '**__Message too long! (limit: 4096 characters)__**') {
                        startEmbed.addFields({ name: '__Current Message:__ ', value: DM });
                    }

                    await interaction.editReply({ embeds: [startEmbed], components: [startRow] });
                    await i.update({});
                }

                else if (i.customId === 'back') {
                    msgCollector?.stop();
                    userCollector?.stop();

                    await i.update({ embeds: [startEmbed], components: [startRow] });
                }

                else if (i.customId === 'reset') {
                    memberList.length = 0;
                    addUsersEmbed.setDescription('Please type the names of the user(s) you\'d like me to DM!');
                    addUsersEmbed.spliceFields(0, 1);
                    await i.update({ components: [addUsersRow] });
                    await interaction.editReply({ embeds: [addUsersEmbed] });
                }

                else if (i.customId === 'send') {
                    if (!DM || memberList.length < 1) {
                        await interaction.channel?.send(`No message OR no user specified!`);
                        await i.update({})
                    } else {
                        startEmbed.setDescription(`**Are you sure you want to send this message to these users?**`);
                        startEmbed.setFields(
                            { name: '__Message Recipients:__ ', value: memberList.join(', ') },
                            { name: '__Current Message:__ ', value: DM }
                        );
                        await interaction.editReply({ embeds: [startEmbed], components: [confirmRow] });
                        await i.update({ components: [confirmRow] });
                    }
                } else if (i.customId === 'yes') {
                    await i.update({})
                    await sendDMs(DM, memberList);
                }
            });
        }
        /**
         * function specifically for this command.
         * Attempts to send specified message to all specified users.
         * 
         * @param {string} m - The message that is to be sent to all users 
         * @param {User[]}users - Object array of all specified discord users. 
         */
        async function sendDMs(m: string, users: User[]): Promise<void> {
            const DMEmbed = new EmbedBuilder()

                .addFields(
                    { name: '__Message Content:__ ', value: m },
                    { name: ' ', value: '--END--' },
                    {
                        name: ' ', value: `** **\n*__Note:__ This bot cannot recieve DMs. `
                            + `For any questions or concerns regarding this message, please contact a higher up in the related Discord server.*\n** **`
                    },
                )
                .setColor('#8B0000');

            //tries to get the server icon
            const serverIcon = interaction.guild?.iconURL();
            if (serverIcon) {
                DMEmbed.setAuthor({ name: interaction.guild!.name, iconURL: serverIcon })
            } else {
                DMEmbed.setAuthor({ name: interaction.guild!.name });
            }
            //if the command user wants to be anonymous or not (name will be shown if false)
            const anon = interaction.options.getBoolean('anon');
            if (!anon) {
                const userIcon = interaction.user.avatarURL();
                if (userIcon) {
                    DMEmbed.setFooter({ text: `Message sent by: ${interaction.user.displayName} (${interaction.user.username})`, iconURL: userIcon });
                } else {
                    DMEmbed.setFooter({ text: `Message sent by: ${interaction.user.displayName} (${interaction.user.username})` });
                }
            }
            //stores all users that were successfully DM'd
            let sentArr: User[] = [];
            //stores all users that could not be DM'd
            let notSentArr: User[] = [];
            for (const currentMember of users) {
                const sent = await tryToDMEmbed(DMEmbed, currentMember);
                if (sent) {
                    sentArr.push(currentMember);
                } else if (!sent) {
                    notSentArr.push(currentMember);
                }
            }
            if (sentArr.length > 0) {
                await interaction.channel?.send(`Successfully DM'd: ${sentArr.join(', ')}`);
            }
            if (notSentArr.length > 0) {
                await interaction.channel?.send(`Failed to DM: ${notSentArr.join(', ')}`);
            }
            await interaction.editReply({ content: 'Sent!', embeds: [DMEmbed], components: [] });
            return;
        }

    }
};
