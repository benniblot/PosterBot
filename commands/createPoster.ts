import { ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction, AttachmentBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder } from 'discord.js';
import { createCanvas, registerFont, loadImage } from 'canvas'
import converter from 'number-to-words'

function getModal():ModalBuilder{
	const modal = new ModalBuilder()
	.setCustomId('posterModal')
	.setTitle('Poster Creator')

	// Add components to modal

	// Create the text input components
	const header = new TextInputBuilder()
		.setCustomId('header')
		.setLabel("Header:")
		.setPlaceholder('Dickinson')
		.setStyle(TextInputStyle.Short)
		.setRequired(true)

	const subText = new TextInputBuilder()
		.setCustomId('subText')
		.setLabel("Sub-Text:")
		.setPlaceholder('Season 0')
		// Paragraph means multiple lines of text.
		.setStyle(TextInputStyle.Short)
		.setRequired(false)

	// An action row only holds one text input,
	// so you need one action row per text input.
	const headerRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(header)
	const subTextRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(subText)

	// Add inputs to the modal
	return modal.addComponents(headerRow, subTextRow)
}

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('createPoster')
        .setType(ApplicationCommandType.Message),
	async execute(interaction: ContextMenuCommandInteraction) {
		// Show the modal to the user
		//await interaction.showModal(getModal());
		await interaction.deferReply()

		//TODO: fix local font
		//registerFont('assets/fonts/Nunito_Sans/NunitoSans-Black.ttf', { family: 'NunitoSans', weight: 'bold' })

		if(interaction.channel != undefined){
			let message = (await interaction.channel.messages.fetch(interaction.targetId)).attachments.first()
			if(message != undefined){
				if(message.name == undefined) return

				//TODO: add Collection Support
				// seperate show / movie name from file name
				let textArray = message.name.split('_')
				let name = ''
				let seasonIndex = 0
				textArray.forEach((element, index) => {
					if(element == '-'){
						for(let i = 0; i < index-1; i++){
							name += `${textArray[i]} `
						}
						name.trimEnd()
						name = name.toUpperCase()
						seasonIndex = index + 1
						
						return
					}
				})

				if(name == ''){
					for(let i = 0; i < textArray.length-1; i++){
						name += `${textArray[i]} `
					}
					name = name.trim()
					name = name.toUpperCase()
				}

				// creating Canvas
				const canvas = createCanvas(1000, 1500)
				const context = canvas.getContext('2d');
	
				// loading images
				const poster = await loadImage(message.url);
				const vignette = await loadImage('assets/effects/vignette.png');
				const frame  = await loadImage('assets/effects/frame.png');

				//drawing background (textless-poster)
				context.drawImage(poster, 0, 0, canvas.width, canvas.height);

				//drawing vignette
				context.drawImage(vignette, 0, 0, canvas.width, canvas.height);

				//drawing frame
				context.drawImage(frame, 0, 0, canvas.width, canvas.height);
				
				//TODO: fix font size when Header is too big (> (a lil bit unter 1000)
				context.font = '76pt "Nunito Sans Black"'
				context.fillStyle = '#ffffff';
				context.textAlign = 'center'
				context.fillText(name, canvas.width * 0.5, 1348.46, context.measureText(name).width - 80);
				
				let subText = ''
				if(textArray[seasonIndex] == 'Season'){
					//TODO: fix font size when Sub-Text is too big (find a ratio to the upper one)
					context.font = '35pt "Nunito Sans Black"'
					context.fillStyle = '#ffffff';
					context.textAlign = 'center'
					subText = `Season ${converter.toWords(textArray[seasonIndex+1].split('.')[0])}`.toUpperCase()
					context.fillText(subText, canvas.width * 0.5, 1403.21, context.measureText(subText).width - 25);
				}

				let testString = textArray[textArray.length-1].split('.')[0]
				if(testString == 'Collection' || testString == 'Specials'){
					//TODO: fix font size when Sub-Text is too big (find a ratio to the upper one)
					context.font = '35pt "Nunito Sans Black"'
					context.fillStyle = '#ffffff';
					context.textAlign = 'center'
					subText = testString.toUpperCase()
					context.fillText(subText, canvas.width * 0.5, 1403.21, context.measureText(subText).width - 25);
				}

				console.log(textArray)
				console.log(`Created Poster for: ${name} - ${subText}`)


				// Use the helpful Attachment class structure to process the file for you
				const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: message.name});
	
				return interaction.followUp({files: [attachment]})
			}
		}
	},
}