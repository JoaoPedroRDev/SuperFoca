const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina uma quantidade específica de mensagens do canal')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName('quantidade')
        .setDescription('Número de mensagens a eliminar (1 a 100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),

  async execute(interaction) {
    const quantidade = interaction.options.getInteger('quantidade');

    try {
      const deleted = await interaction.channel.bulkDelete(quantidade, true);
      await interaction.reply({
        content: `🧹 Foram eliminadas **${deleted.size}** mensagens com sucesso!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erro ao eliminar mensagens:', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao tentar eliminar as mensagens. Mensagens com mais de 14 dias não podem ser apagadas em massa.',
        ephemeral: true,
      });
    }
  },
};