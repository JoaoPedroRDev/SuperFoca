const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    // Ignora mensagens enviadas por bots para não poluir o log
    if (message.author?.bot) return;

    const ID_CANAL_LOGS = '1069309504602247329'; // Substitua pelo ID do seu canal de #logs
    const canalLogs = message.guild.channels.cache.get(ID_CANAL_LOGS);
    if (!canalLogs) return;

    // Tenta resgatar quem era o autor da mensagem
    let autorTag = message.author ? `<@${message.author.id}> (${message.author.tag})` : 'Desconhecido (mensagem antiga/fora do cache)';
    let autorAvatar = message.author ? message.author.displayAvatarURL() : message.guild.iconURL();

    // Busca no Audit Log quem executou a ação de deletar (útil se um moderador apagou a mensagem de alguém)
    let deletadoPor = 'Próprio autor ou desconhecido';
    try {
      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
      });
      const deletionLog = fetchedLogs.entries.first();

      if (deletionLog) {
        const { executor, target } = deletionLog;
        // Se a mensagem deletada pertence ao mesmo usuário registrado no log de auditoria recente
        if (target.id === message.author?.id) {
          deletadoPor = `<@${executor.id}> (${executor.tag})`;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar Audit Log de mensagem deletada:', error);
    }

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Mensagem Excluída')
      .setColor('#ED4245')
      .setThumbnail(autorAvatar)
      .addFields(
        { name: '👤 Autor da Mensagem:', value: autorTag, inline: false },
        { name: '🛠️ Apagado por:', value: deletadoPor, inline: false },
        { name: '📍 Canal:', value: `<#${message.channel.id}>`, inline: true },
        { name: '💬 Conteúdo Excluído:', value: message.content || '*Nenhum texto (imagem, sticker ou anexo)*', inline: false }
      )
      .setTimestamp();

    await canalLogs.send({ embeds: [embed] });
  },
};