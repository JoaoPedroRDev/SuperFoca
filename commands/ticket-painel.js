const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  PermissionFlagsBits 
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-painel')
    .setDescription('Envia o painel para abertura de tickets de suporte')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📩 Central de Suporte & Moderação')
      .setDescription('Precisa de ajuda ou quer fazer um relatório/denúncia? Clique no botão abaixo para abrir um ticket privado com a Staff.')
      .setColor('#2B2D31')
      .setFooter({ text: 'Sistema de Atendimento Reservado' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('abrir_ticket_btn')
        .setLabel('Abrir Ticket')
        .setEmoji('🎫')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Painel de tickets enviado!', ephemeral: true });
  },
};