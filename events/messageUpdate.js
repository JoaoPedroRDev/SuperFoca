const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (oldMessage.partial || oldMessage.author?.bot || oldMessage.content === newMessage.content) return;

    const ID_CANAL_LOGS = '1069309504602247329'; // ID do teu canal de #logs
    const canalLogs = oldMessage.guild.channels.cache.get(ID_CANAL_LOGS);
    if (!canalLogs) return;

    const embed = new EmbedBuilder()
      .setTitle('✏️ Mensagem Editada')
      .setColor('#FEE75C')
      .addFields(
        { name: 'Autor:', value: `<@${oldMessage.author.id}>`, inline: true },
        { name: 'Canal:', value: `<#${oldMessage.channel.id}>`, inline: true },
        { name: 'Antes:', value: oldMessage.content || '*Vazio*' },
        { name: 'Depois:', value: newMessage.content || '*Vazio*' }
      )
      .setTimestamp();

    await canalLogs.send({ embeds: [embed] });
  },
};