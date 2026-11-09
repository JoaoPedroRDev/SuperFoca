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
    .setName('sugerir')
    .setDescription('Envia o painel de sugestões de conteúdo')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Apenas a Staff envia o painel

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('💡 Central de Sugestões de Conteúdo')
      .setDescription('Tem alguma ideia para um vídeo de Minecraft, mod divertido, seed incrível ou desafio?\n\nClique no botão abaixo para enviar sua sugestão diretamente para a comunidade!')
      .setColor('#FEE75C')
      .setFooter({ text: 'Sua ideia pode virar o próximo vídeo do canal!' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('abrir_sugestao_btn')
        .setLabel('Enviar Sugestão')
        .setEmoji('💡')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Painel de sugestões enviado!', ephemeral: true });
  },
};