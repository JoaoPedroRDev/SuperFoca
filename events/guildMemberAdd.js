const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // ID do canal onde a mensagem de boas-vindas será enviada
    const ID_CANAL_BOAS_VINDAS = '1069309495634821260'; 
    const canal = member.guild.channels.cache.get(ID_CANAL_BOAS_VINDAS);
    if (!canal) return;

    // Criar o Canvas (LARGURA x ALTURA)
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Fundo do Card (Gradiente Escuro Elegante)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e1f22');
    gradient.addColorStop(1, '#2b2d31');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Borda colorida
    ctx.strokeStyle = '#5865F2';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Texto de Boas-Vindas
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('BEM-VINDO(A)!', 200, 100);

    // Nome do Utilizador
    ctx.fillStyle = '#5865F2';
    ctx.font = 'bold 32px sans-serif';
    const username = member.user.username;
    ctx.fillText(username.length > 15 ? username.substring(0, 15) + '...' : username, 200, 145);

    // Detalhe de Membros
    ctx.fillStyle = '#b5bac1';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Membro #${member.guild.memberCount}`, 200, 180);

    // Desenhar a foto de perfil recortada em círculo
    ctx.save();
    ctx.beginPath();
    ctx.arc(100, 125, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.drawImage(avatar, 40, 65, 120, 120);
    ctx.restore();

    // Gerar o anexo
    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'bem-vindo.png' });

    const embed = new EmbedBuilder()
      .setTitle(`👋 Olá, ${member.user.username}!`)
      .setDescription(`Seja muito bem-vindo(a) ao **${member.guild.name}**! Não se esqueça de ler as regras.`)
      .setColor('#5865F2')
      .setImage('attachment://bem-vindo.png');

    await canal.send({ content: `<@${member.id}>`, embeds: [embed], files: [attachment] });
  },
};