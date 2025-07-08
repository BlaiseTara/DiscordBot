module.exports = {
    data: {
        name: "help",
        description: "Shows a list of all available commands"
    },
    async execute(interaction) {
        const commandList = interaction.client.commands.map(cmd => {
            return `/${cmd.data.name} - ${cmd.data.description}`;
        });

        await interaction.reply({
            embeds: [{
                title: "🛠️ Available Commands",
                description: commandList.join("\n")
            }],
            ephemeral: true
        });
    }
};
