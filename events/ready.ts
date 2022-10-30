import { DiscordAPIError, ClientUser, ActivityType } from 'discord.js';
import { bot_info } from '../config.json'

module.exports = {
	name: 'ready',
	once: true,
	execute(client: { user: ClientUser }) {
		console.log(`${client.user.tag}` + ' Version ' + bot_info.version + ' started sucessfully!')
		
		client.user.setActivity("V" + bot_info.version, {
			type: ActivityType.Playing, 
		})
	
		/*
		Version INFO: <Major.Minor.Revision.Build>
		- Major is a major update to the software
		- Minor is a small update to the software
		- Revision is any change made (bug fixes, small updates)
		*/
	},
};