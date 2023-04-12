const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType, ApplicationCommandOptionType, Client} = require('discord.js');
const TicketSetup = require('../../models/TicketSetup');
const config = require('../../../config.json');

module.exports = {
  /**
   * 123
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (interaction, client)  => {
    const { guild, options } = interaction;
    try {
      const channel = interaction.options.getChannel('channel');
      const category = interaction.options.getChannel('category');
      const transcripts = interaction.options.getChannel('transcripts');
      const handlers = interaction.options.getRole('handlers');
      const everyone = interaction.options.getRole('everyone');
      const description = interaction.options.getString('description');
      const button = interaction.options.getString('button');
      const emoji = interaction.options.getString('emoji');
      await TicketSetup.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: channel.id,
          Category: category.id,
          Transcripts: transcripts.id,
          Handlers: handlers.id,
          Everyone: everyone.id,
          Description: description,
          Button: button,
          Emoji: emoji,
        },
        {
          new: true,
          upsert: true,
        }
      );
      const embed = new EmbedBuilder().setDescription(description);
      const buttonshow = new ButtonBuilder()
        .setCustomId(button)
        .setLabel(button)
        .setEmoji(emoji)
        .setStyle(ButtonStyle.Primary);
      await channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(buttonshow)],
      }).catch(error => {return});
      return interaction.reply({ embeds: [new EmbedBuilder().setDescription('The ticket panel was successfully created.').setColor('Green')], ephemeral: true});
    } catch (err) {
      console.log(err);
      const errEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
      return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
    }
  },

  name: 'ticket',
  devOnly: true,
  description: 'A command to setup the ticket system.',
  options: [
    {
      name: 'channel', 
      description: 'Select the channel where the tickets should be created.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'category',
      description: 'Select the parent where the tickets should be created.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'transcripts',
      description: 'Select the channel where the transcripts should be sent.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'handlers',
      description: 'Select the ticket handlers role.',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'everyone',
      description: 'Select the everyone role.',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'description',
      description: 'Choose a description for the ticket embed.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'button',
      description: 'Choose a name for the ticket embed.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'emoji',
      description: 'Choose a style, so choose a emoji.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  };