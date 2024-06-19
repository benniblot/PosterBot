// POSTERS BY: https://www.themoviedb.org/about/logos-attribution

import { MovieDb } from 'moviedb-promise'
import { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction } from  'discord.js';
import dotenv from 'dotenv'
dotenv.config()

if(process.env.moviedbtoken == undefined){
    throw Error('Unable to connect to themoviedb.org')
}
const movieDB = new MovieDb(process.env.moviedbtoken)
type contentType = "tv" | "movie";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poster')
		.setDescription('Search Posters for Movies, TV-Shows and Collections')
		.addStringOption(option =>
			option.setName('content-type')
                .addChoices(
                    { name: 'Movie', value: 'movie' },
                    { name: 'TV Show', value: 'tv' },
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

        const findTVShow = async (title:string) => {
            const res = await movieDB.searchTv({ query: title })
            return res;
        }

        const getImages = async (id:number, type:contentType) => {
            switch(type) {
                case "tv":
                    return await movieDB.tvImages({
                        id: id,
                        language: 'null'
                    })
                case "movie":
                    return await movieDB.movieImages({
                        id: id,
                        language: 'null'
                    })   
            }
        }

        if(contentType == 'movie') {
            try {
                findMovie(name, releaseYear).then(movieResults => {
                    if(movieResults.results != undefined) {
                        const movieID = movieResults.results[0].id
                        const movieTitle = movieResults.results[0].title
                        if(movieID != undefined && movieTitle != undefined){
                            try {
                                getImages(movieID, "movie").then(imageResults => {
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
        } else if(contentType == 'tv') {
            try {
                //movieDB.seasonImages(0)
                findTVShow("The Mandalorian").then(tvResults => {
                    if(tvResults.results != undefined){
                        const tvID = tvResults.results[0].id
                        const tvName = tvResults.results[0].name
                        if(tvID != undefined && tvName != undefined){
                            try {
                                getImages(tvID, "tv").then(imageResults => {
                                    console.log(imageResults)
                                if(imageResults.posters != undefined && imageResults.posters[0] != undefined && imageResults.posters[0].file_path != undefined){
                                    return interaction.reply({files: [new AttachmentBuilder(`https://www.themoviedb.org/t/p/original/${imageResults.posters[0].file_path}`, {name: `${tvName} (${releaseYear}).jpg`})]})
                                }
                                })
                            } catch (e) {
                                console.error(e)
                            }
                        }
                        // year:number, showPoster:boolean, season?:number
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
