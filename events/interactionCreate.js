const { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ChannelType, 
  PermissionFlagsBits 
} = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {

    // 1. Slash Commands (/comandos)
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const content = { content: '❌ Ocorreu um erro ao executar este comando.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(content);
        } else {
          await interaction.reply(content);
        }
      }
    }

    // 2. Ações de Botões Interativos (Cargos, Tickets e Sugestões)
    if (interaction.isButton()) {

      // Lógica dos Botões de Cargo
      if (interaction.customId.startsWith('cargo_')) {
        const roleId = interaction.customId.split('_')[1];
        const member = interaction.member;

        if (member.roles.cache.has(roleId)) {
          const botaoDesativado = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('cargo_resgatado')
              .setLabel('Cargo já resgatado')
              .setEmoji('✔️')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
          );

          await interaction.reply({
            content: '🔒 Você já possui este cargo e ele não pode ser removido por aqui.',
            components: [botaoDesativado],
            ephemeral: true
          });
        } else {
          try {
            await member.roles.add(roleId);

            const botaoConfirmado = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId('cargo_sucesso')
                .setLabel('Cargo Resgatado!')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
            );

            await interaction.reply({
              content: '🎉 Cargo adicionado com sucesso ao seu perfil!',
              components: [botaoConfirmado],
              ephemeral: true
            });
          } catch (error) {
            console.error('Erro ao adicionar cargo:', error);
            await interaction.reply({
              content: '❌ Ocorreu um erro ao adicionar o cargo. Verifique a hierarquia do cargo do bot.',
              ephemeral: true
            });
          }
        }
      }

      // Abertura do Modal de Ticket
      if (interaction.customId === 'abrir_ticket_btn') {
        const modal = new ModalBuilder()
          .setCustomId('modal_ticket')
          .setTitle('Abertura de Ticket');

        const assuntoInput = new TextInputBuilder()
          .setCustomId('ticket_assunto')
          .setLabel('Assunto principal')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Ex: Dúvida, Denúncia, Parceria...')
          .setRequired(true);

        const descricaoInput = new TextInputBuilder()
          .setCustomId('ticket_descricao')
          .setLabel('Descreva a sua solicitação em detalhe')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(assuntoInput),
          new ActionRowBuilder().addComponents(descricaoInput)
        );

        await interaction.showModal(modal);
      }

      // Encerramento do Ticket (Deleta o Tópico Privado)
      if (interaction.customId === 'fechar_ticket_btn') {
        await interaction.reply('🔒 O ticket será encerrado e este subtópico será deletado em 5 segundos...');

        setTimeout(async () => {
          try {
            await interaction.channel.delete();
          } catch (error) {
            console.error('Erro ao excluir o subtópico do ticket:', error);
          }
        }, 5000);
      }

      // Abertura do Modal de Sugestão pelo Botão
      if (interaction.customId === 'abrir_sugestao_btn') {
        const modal = new ModalBuilder()
          .setCustomId('modal_sugestao')
          .setTitle('💡 Sugestão de Conteúdo');

        const tituloInput = new TextInputBuilder()
          .setCustomId('sugestao_titulo')
          .setLabel('Título resumido da sua ideia')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Ex: Mod de Dragões, Seed com Vila Quádrupla...')
          .setRequired(true);

        const detalheInput = new TextInputBuilder()
          .setCustomId('sugestao_detalhe')
          .setLabel('Explique a sua ideia em detalhe')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Explique o que torna esta ideia interessante para um vídeo!')
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(tituloInput),
          new ActionRowBuilder().addComponents(detalheInput)
        );

        await interaction.showModal(modal);
      }

      // Feedback das Atualizações
      if (interaction.customId === 'update_feedback_top') {
        await interaction.reply({ 
          content: '🙌 Obrigado pelo teu feedback! Ficamos felizes por teres gostado das novidades.', 
          ephemeral: true 
        });
      }

      if (interaction.customId === 'update_feedback_medio') {
        await interaction.reply({ 
          content: '💡 Obrigado pelo teu feedback! Vamos continuar a trabalhar para melhorar.', 
          ephemeral: true 
        });
      }

    }

    // 3. Submissão dos Formulários (Modais)
    if (interaction.isModalSubmit()) {

      // Modal de Ticket (Cria Tópico Privado e Notifica o Cargo de Atendente)
      if (interaction.customId === 'modal_ticket') {
        try {
          await interaction.deferReply({ ephemeral: true });

          const assunto = interaction.fields.getTextInputValue('ticket_assunto');
          const descricao = interaction.fields.getTextInputValue('ticket_descricao');

          const ID_CARGO_ATENDENTE = '1565207672255553566';

          // Criar Tópico Privado dentro do canal de suporte
          const topicoTicket = await interaction.channel.threads.create({
            name: `ticket-${interaction.user.username}`,
            autoArchiveDuration: 1440,
            type: ChannelType.PrivateThread,
            reason: `Ticket aberto por ${interaction.user.tag}`,
          });

          // Adiciona o autor do ticket ao tópico
          await topicoTicket.members.add(interaction.user.id);

          const embedTicket = new EmbedBuilder()
            .setTitle(`🎫 Ticket: ${assunto}`)
            .setDescription(`**Aberto por:** <@${interaction.user.id}>\n\n**Descrição:**\n${descricao}`)
            .setColor('#5865F2')
            .setTimestamp();

          const rowFechar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('fechar_ticket_btn')
              .setLabel('Fechar Ticket')
              .setEmoji('🔒')
              .setStyle(ButtonStyle.Danger)
          );

          // Notifica os atendentes e envia o card com o botão de fechar
          await topicoTicket.send({ 
            content: `🔔 <@&${ID_CARGO_ATENDENTE}> Novo ticket aberto por <@${interaction.user.id}>!`, 
            embeds: [embedTicket], 
            components: [rowFechar] 
          });

          await interaction.editReply({ content: `✅ Ticket criado com sucesso! Acesse seu subtópico: ${topicoTicket}` });

        } catch (error) {
          console.error('❌ Erro ao criar o subtópico de ticket:', error);
          if (interaction.deferred) {
            await interaction.editReply({ 
              content: '❌ Erro ao criar o subtópico. Verifique se o bot tem as permissões de **"Criar Tópicos Privados"** e **"Gerenciar Tópicos"**.' 
            });
          }
        }
      }

      // Modal de Sugestão (Envia para o canal de ideias de vídeo)
      if (interaction.customId === 'modal_sugestao') {
        try {
          await interaction.deferReply({ ephemeral: true });

          const titulo = interaction.fields.getTextInputValue('sugestao_titulo');
          const detalhe = interaction.fields.getTextInputValue('sugestao_detalhe');

          const ID_CANAL_SUGESTOES = '1564711648747458580';
          const canalSugestoes = interaction.guild.channels.cache.get(ID_CANAL_SUGESTOES);

          if (!canalSugestoes) {
            return await interaction.editReply({ content: '❌ Canal de sugestões não encontrado.' });
          }

          const embedSugestao = new EmbedBuilder()
            .setTitle(`💡 Nova Sugestão: ${titulo}`)
            .setDescription(detalhe)
            .setColor('#FEE75C')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setFooter({ text: 'Use as reações abaixo para votar nesta ideia!' })
            .setTimestamp();

          const mensagemEnviada = await canalSugestoes.send({ embeds: [embedSugestao] });

          await mensagemEnviada.react('👍');
          await mensagemEnviada.react('👎');

          await interaction.editReply({ content: '✅ Sua sugestão foi enviada com sucesso para o canal de ideias!' });

        } catch (error) {
          console.error('Erro ao processar sugestão:', error);
          if (interaction.deferred) {
            await interaction.editReply({ content: '❌ Ocorreu um erro ao enviar a sua sugestão.' });
          }
        }
      }

    }

  },
};