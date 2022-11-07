// POSTERS BY: https://www.themoviedb.org/about/logos-attribution

import { MovieDb } from 'moviedb-promise'
import { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction } from  'discord.js';
import dotenv from 'dotenv'
dotenv.config()

if(process.env.moviedbtoken == undefined){
    throw Error('Unable to connect to themoviedb.org')
}
const movieDB = new MovieDb(process.env.moviedbtoken)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poster')
		.setDescription('Search Posters for Movies, TV-Shows and Collections')
		.addStringOption(option =>
			option.setName('content-type')
                .addChoices(
                    { name: 'Movie', value: 'movie' },
                    { name: 'TV Show', value: 'show' },
                    { name: 'Collection', value: 'collection' },
                )
				.setDescription('Type of Poster')
                .setRequired(true))
        .addStringOption(option =>
			option.setName('search-term')
				.setDescription('Name of the Movie, TV-Show or Collection you are looking for')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('release-year')
				.setDescription('Year, the Movie or TV-Show was released in')
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction ) {
        const name = interaction.options.getString('search-term', true)
		const releaseYear = interaction.options.getNumber('release-year', true)
        const contentType = interaction.options.getString('content-type', true)
        
        const findMovie = async (title:string, year:number) => {
            const res = await movieDB.searchMovie({ query: title, year: year })
            return res
        }

        const getImages = async (id:number) => {
            const res = await movieDB.movieImages({
                id: id,
                language: 'null'
            })
            return res
        }

        if(contentType == 'movie') {
            try {
                findMovie(name, releaseYear).then(movieResults => {
                    if(movieResults.results != undefined) {
                        const movieID = movieResults.results[0].id
                        const movieTitle = movieResults.results[0].title
                        if(movieID != undefined && movieTitle != undefined){
                            try {
                                getImages(movieID).then(imageResults => {
                                if(imageResults.posters != undefined && imageResults.posters[0] != undefined && imageResults.posters[0].file_path != undefined){
                                    return interaction.reply({files: [new AttachmentBuilder(`https://www.themoviedb.org/t/p/original/${imageResults.posters[0].file_path}`, {name: `${movieTitle} (${releaseYear}).jpg`})]})
                                }
                                })
                            } catch (e) {
                                console.error(e)
                            }
                        }
                    }
                })
            } catch (e) {
                console.error(e)
            }
        } else {
            return interaction.reply({content: 'TV-Show & Collection Support is coming soon :)'})
        }
	},
};
