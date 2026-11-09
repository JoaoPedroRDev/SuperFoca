const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong e exibe a latência do bot!'),

  async execute(interaction) {
    const pingAPI = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setDescription(`A latência da API do Discord é de **${pingAPI}ms**.`)
      .setColor('#5865F2')
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true, // Apenas quem enviou o comando enxerga a resposta
    });
  },
};