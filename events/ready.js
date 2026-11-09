module.exports = {
  name: 'ready',
  async execute(client, registerCommands) {
    console.log(`🤖 ${client.user.tag} está online e pronto!`);

    // Registra os Slash Commands
    await registerCommands();
  },
};
