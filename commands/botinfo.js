const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Exibe as informações técnicas e os criadores do SuperFoca'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 Sobre o SuperFoca')
      .setDescription('Bot oficial desenvolvido sob medida para automação e suporte!')
      .setColor('#5865F2')
      .addFields(
        { name: '👨‍💻 Desenvolvedor:', value: `<@${interaction.client.application.owner?.id || interaction.user.id}>`, inline: true },
        { name: '⚙️ Linguagem:', value: 'JavaScript (Node.js)', inline: true },
        { name: '📚 Biblioteca:', value: 'discord.js v14', inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};