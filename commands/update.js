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
    .setName('update')
    .setDescription('Posta uma nota de atualização/novidades do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('versao')
        .setDescription('Versão da atualização (ex: v1.2, Patch 2.0)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('titulo')
        .setDescription('Título principal das novidades')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('detalhes')
        .setDescription('Descrição das alterações (usa \\n para quebrar linha)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const versao = interaction.options.getString('versao');
    const titulo = interaction.options.getString('titulo');
    const detalhes = interaction.options.getString('detalhes').replace(/\\n/g, '\n');

    const embed = new EmbedBuilder()
      .setTitle(`🚀 ATUALIZAÇÃO ${versao.toUpperCase()} — ${titulo}`)
      .setDescription(detalhes)
      .setColor('#57F287') // Verde Minecraft
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ 
        text: `Publicado por ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL() 
      })
      .setTimestamp();

    // Botões de feedback da comunidade
    const rowFeedback = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('update_feedback_top')
        .setLabel('Gostei! 🔥')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('update_feedback_medio')
        .setLabel('Mais ou menos 😐')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.channel.send({ 
      content: '📢 **@everyone Novidades no servidor!**', 
      embeds: [embed], 
      components: [rowFeedback] 
    });

    await interaction.reply({ content: '✅ Atualização enviada com sucesso!', ephemeral: true });
  },
};