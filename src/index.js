import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import job from './cron.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// start cron job
job.start();

// ^ the cron job is needed to prevent the server from going into sleep mode
// remove it if you arent using a poor person's server host

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    client.commands.set(command.default.data.name, command.default);
}


client.once("ready", () => {
    console.log("Bot is online.");
});

// Custom Replys
client.on("messageCreate", (message) => {
    if (message.content.startsWith("hi")) {
        message.channel.send("Hello there!");
    }
});


// Slash Commands
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return interaction.reply({ content: "Command not found.", ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        await interaction.reply({ content: "There was an error executing that command.", ephemeral: true });
    }
});

client.login(process.env.BOT_TOKEN);



import http from 'http';

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    if (req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Pong\n');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found\n');
    }
}).listen(PORT, () => {
    console.log(`Ping server running on port ${PORT}`);
});

