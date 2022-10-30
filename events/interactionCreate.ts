import { Interaction } from "discord.js";

module.exports = {
	name: 'interactionCreate',
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return

		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`)
			return
		}

		try {
			console.log('Executing Command: ' + interaction.commandName)
			await command.execute(interaction)
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`)
			console.error(error)
		}
	},
}