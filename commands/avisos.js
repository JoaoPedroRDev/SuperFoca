const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Envia uma mensagem oficial estilizada')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('titulo')
        .setDescription('Título do anúncio')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('mensagem')
        .setDescription('Conteúdo do anúncio')
        .setRequired(true)
    ),

  async execute(interaction) {
    const titulo = interaction.options.getString('titulo');
    const mensagem = interaction.options.getString('mensagem');

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${titulo}`)
      .setDescription(mensagem)
      .setColor('#FF0000')
      .setTimestamp()
      .setFooter({ text: `Anunciado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Anúncio enviado!', ephemeral: true });
  },
};