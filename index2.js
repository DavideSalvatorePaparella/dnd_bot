require('dotenv').config();



const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const token = process.env.TOKEN;

const apiUrl = 'https://www.dnd5eapi.co/api';
const apiPrefix = 'https://www.dnd5eapi.co';

let races = [];

let classes = [];

const bot = new TelegramBot(token, {
    polling: true
});

// bot.on('message', (msg) => {
//     var hi = "ciao";
//     if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
//         bot.sendMessage(msg.chat.id, "Ciao Mondo!");
//     }
// });


bot.on('polling_error', (error) => {
    console.log(error); // => 'EFATAL'
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hola");
});


bot.onText(/\/create/, async (msg) => {
    let nome, livello;

    let razza, speed;
    let strength, dexterity, constitution, intelligence, wisdom, charisma;
    let strengthmod, dexteritymod, constitutionmod, intelligencemod, wisdommod, charismamod;

    let classe, proficiency_bonus, hit_dice;
    let strengthsaving, dexteritysaving, constitutionsaving, intelligencesaving, wisdomsaving, charismasaving;


    //nome
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Inserisci il nome del personaggio:');

    //livello
    bot.once('message', async (nomeMsg) => {
        nome = nomeMsg.text;
        bot.sendMessage(chatId, 'Inserisci il livello del personaggio:');

        bot.once('message', async (livelloMsg) => {
            livello = parseInt(livelloMsg.text);

            //razze e velocità
            let races = [];
            try {
                const response = await axios.get('https://www.dnd5eapi.co/api/races');
                races = response.data.results.map((r) => r.name);
                const results = response.data.results.map((race) => {
                    return {
                        text: race.name,
                        callback_data: race.url
                    };
                });
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        keyboard: [...results.map((i) => [i])]
                    }
                };
                bot.sendMessage(
                    msg.chat.id,
                    'Seleziona una razza:',
                    options
                );

                razza = await new Promise((resolve) => {
                    bot.once('message', (razzaMsg) => {
                        const razza = razzaMsg.text;
                        resolve(razza);
                    });
                });

                const raceResponse = await axios.get(`https://www.dnd5eapi.co/api/races/${razza.toLowerCase().replace(/\s+/g, '-')}`);
                speed = raceResponse.data.speed;

                switch (raceResponse.data.name.toLowerCase()) {
                    case "dragonborn":
                        strength += 2;
                        charisma += 1;
                        break;
                    case "dwarf":
                        constitution += 2;//
                        break;
                    case "elf":
                        dexterity += 2;//
                        break;
                    case "gnome":
                        intelligence += 2;//
                        break;
                    case "half-elf":
                        charisma += 2;
                        break;
                    case "half-orc":
                        strength += 2;
                        break;
                    case "halfling":
                        dexterity += 2;
                        break;
                    case "human":
                        strength += 1;
                        dexterity += 1;
                        constitution += 1;
                        intelligence += 1;
                        wisdom += 1;
                        charisma += 1;
                        break;
                    case "tiefling":
                        intelligence += 1;
                        charisma += 2;
                        break;
                    default:
                        strength += 0;
                        dexterity += 0;
                        constitution += 0;
                        intelligence += 0;
                        wisdom += 0;
                        charisma += 0;
                }


                //classi
                let classes = [];
                const classesResponse = await axios.get('https://www.dnd5eapi.co/api/classes');
                classes = classesResponse.data.results.map((c) => c.name);
                const classResults = classesResponse.data.results.map((c) => {
                    return {
                        text: c.name,
                        callback_data: c.url
                    };
                });
                const classOptions = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        keyboard: [...classResults.map((i) => [i])]
                    }
                };
                bot.sendMessage(
                    msg.chat.id,
                    'Seleziona una classe:',
                    classOptions
                );

                classe = await new Promise((resolve) => {
                    bot.once('message', (classeMsg) => {
                        const classe = classeMsg.text;
                        resolve(classe);
                    });
                });

                const classResponse = await axios.get(`https://www.dnd5eapi.co/api/classes/${classe.toLowerCase().replace(/\s+/g, '-')}`);


                switch (classResponse.data.name.toLowerCase()) {
                    case "barbarian":
                        proficiency_bonus = 2;
                        hit_dice = "d12";
                        break;
                    case "bard":
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                        break;
                    case "cleric":
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                        break;
                    case "druid":
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                        break;
                    case "rogue":
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                        break;
                    case "warlock":
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                        break;
                    case "monk":
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                        break;
                    case "fighter":
                        proficiency_bonus = 2;
                        hit_dice = "d10";
                        break;
                    case "paladin":
                        proficiency_bonus = 2;
                        hit_dice = "d10";
                        break;
                    case "ranger":
                        proficiency_bonus = 2;
                        hit_dice = "d10";
                        break;
                    case "sorcerer":
                        proficiency_bonus = 2;
                        hit_dice = "d6";
                        break;
                    case "wizard":
                        proficiency_bonus = 2;
                        hit_dice = "d6";
                        break;
                    default:
                        proficiency_bonus = 2;
                        hit_dice = "d8";
                }

                console.log(proficiency_bonus);




            } catch (error) {
                console.error(error);
                bot.sendMessage(msg.chat.id, 'Errore durante la lettura delle razze');
            }


            const character = {
                nome,
                livello,
                razza,
                classe,
                proficiency_bonus,
                combat: {
                    speed,
                    hit_dice
                },
                ability_scores: {
                    strength,
                    strengthmod,
                    dexterity,
                    dexteritymod,
                    constitution,
                    constitutionmod,
                    intelligence,
                    intelligencemod,
                    wisdom,
                    wisdommod,
                    charismamod
                },
                saving_throws:{
                    strengthsaving,
                    dexteritysaving,
                    constitutionsaving,
                    intelligencesaving,
                    wisdomsaving,
                    charismasaving
                }
            };

            // Check if the characters file exists and create it if it doesn't
            if (!fs.existsSync('characters.json')) {
                fs.writeFileSync('characters.json', '{"characters": []}');
            }

            // Read the characters file and parse its contents
            const characters = JSON.parse(fs.readFileSync('characters.json', 'utf8')).characters;

            // Add the new character to the list
            characters.push(character);

            // Write the updated characters list back to the file
            fs.writeFileSync('characters.json', JSON.stringify({ characters }, null, 2));

            bot.sendMessage(chatId, 'Il personaggio è stato creato con successo!');
        });
    });
});






bot.onText(/\/immagine/, (msg) => {
    bot.sendPhoto(msg.chat.id, "https://davidesalvatore.altervista.org/cat.jpg", {
        caption: "silly cat"
    });
});

bot.onText(/\/acidarrow/, async (msg) => {

    try {
        const response = await axios.get(`${apiUrl}/spells/acid-arrow`);

        //casting_time, level, attack_type, damage, classes
        const { name, desc, range, duration, components } = response.data;

        const message = `
      *${name}*
      Description: ${desc.join('\n')}
      Range: ${range}
      Duration: ${duration}
      Components: ${components.join(', ')}
    `;

        bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error(error);
        bot.sendMessage(
            msg.chat.id,
            'An error occurred while fetching Acid Arrow spell info.'
        );
    }
});


// Gestione del comando /races
bot.onText(/\/races/, async (msg) => {
    try {
        const response = await axios.get('https://www.dnd5eapi.co/api/races');
        races = response.data.results.map((r) => r.name);
        const results = response.data.results.map((race) => {
            return {
                text: race.name,
                callback_data: race.url
            };
        });
        const options = {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [...results.map((i) => [i])]
            }
        };
        bot.sendMessage(
            msg.chat.id,
            'Seleziona una razza:',
            options
        );
    } catch (error) {
        console.error(error);
        bot.sendMessage(msg.chat.id, 'Errore durante la lettura delle razze');
    }
});

bot.on('message', async (message) => {
    // const raceName = message.text;
    // const racesArray = races.map((i) => i.name);
    // //console.log(racesArray);
    // if(racesArray.includes(raceName)){
    //   const response = await axios.get(apiUrl + '/races/' + raceName.toLowerCase());
    //   const race = response.data;
    //   const msg = `
    //     *${race.name}*
    //     ${race.alignment}
    //     ${race.age}
    //     ${race.size_description}
    //     ${race.starting_proficiencies.map((proficiency) => proficiency.name).join(', ')}
    //   `;
    //   const options = { parse_mode: 'Markdown' };
    //   bot.sendMessage(message.chat.id, msg, options);
    // }

    console.log(message.text);

    if (races.includes(message.text)) {
        console.log('is a race');
        const response = await axios.get(apiUrl + '/races/' + message.text.toLowerCase());
        const race = response.data;
        const msg = `
        *${race.name}*
        ${race.alignment}
        ${race.age}
        ${race.size_description}
        ${race.starting_proficiencies.map((proficiency) => proficiency.name).join(', ')}
      `;
        const options = { parse_mode: 'Markdown' };
        bot.sendMessage(message.chat.id, msg, options);
    } else if (classes.includes(message.text)) {
        console.log('is a class');
        const response = await axios.get(apiUrl + '/classes/' + message.text.toLowerCase());
        const classname = response.data;
        const msg = `
      *${classname.name}*
      ${classname.hit_die}
      ${classname.class_levels}
      ${classname.size_description}}
    `;
        const options = { parse_mode: 'Markdown' };
        bot.sendMessage(message.chat.id, msg, options);
    }

});


function HandleRace(race) {
    const message = `
    *${race.name}*
    ${race.alignment}
    ${race.age}
    ${race.size_description}
    ${race.starting_proficiencies.map((proficiency) => proficiency.name).join(', ')}
  `;
    const options = { parse_mode: 'Markdown' };
    bot.sendMessage(query.message.chat.id, message, options);
}

function HandleClasses(classname) {
    const message = `
    *${classname.name}*
    ${classname.hit_die}
    ${classname.class_levels}
    ${classname.size_description}}
  `;
    const options = { parse_mode: 'Markdown' };
    bot.sendMessage(query.message.chat.id, message, options);
}



// Ricezione di un callback_query dagli utenti
bot.on('callback_query', async (query) => {
    try {
        console.log(JSON.stringify(query))
        const url = query.data;
        const response = await axios.get(apiPrefix + url);

        if (races.includes(query.data)) {
            HandleRace(response.data);
        } else if (classes.include(query.data)) {
            HandleClasses(response.data);
        }


    } catch (error) {
        console.error(error);
        bot.sendMessage(query.message.chat.id, 'Errore durante la lettura delle informazioni sulla razza');
    }
});


//classes
bot.onText(/\/classes/, async (msg) => {
    try {
        const response = await axios.get('https://www.dnd5eapi.co/api/classes');
        classes = response.data.results.map((c) => c.name);
        const results = response.data.results.map((class1) => {
            return {
                text: class1.name,
                callback_data: class1.url
            };
        });
        const options = {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [...results.map((i) => [i])]
            }
        };
        bot.sendMessage(
            msg.chat.id,
            'Seleziona una classe:',
            options
        );
    } catch (error) {
        console.error(error);
        bot.sendMessage(msg.chat.id, 'Errore durante la lettura delle classi');
    }
});