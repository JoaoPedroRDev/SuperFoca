require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
const commandsArray = [];

// Carregando comandos dinamicamente
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());
  }
}

// Registrar os comandos no servidor de teste
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log('🔄 Atualizando Slash Commands no servidor de testes...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commandsArray }
    );
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
}

// Importação e registro dos Eventos
const readyEvent = require('./events/ready.js');
const interactionCreateEvent = require('./events/interactionCreate.js');
const guildMemberAddEvent = require('./events/guildMemberAdd.js');


client.once('ready', () => readyEvent.execute(client, registerCommands));

client.on('interactionCreate', interaction => interactionCreateEvent.execute(interaction));
client.on('guildMemberAdd', member => guildMemberAddEvent.execute(member));

const messageDeleteEvent = require('./events/messageDelete.js');
const messageUpdateEvent = require('./events/messageUpdate.js');

client.on('messageDelete', message => messageDeleteEvent.execute(message));
client.on('messageUpdate', (oldMsg, newMsg) => messageUpdateEvent.execute(oldMsg, newMsg));

client.login(process.env.DISCORD_TOKEN);