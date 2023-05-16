require('dotenv').config();



const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const token = process.env.TOKEN;

const apiUrl = 'https://www.dnd5eapi.co/api';
const apiPrefix = 'https://www.dnd5eapi.co';

const charactersData = JSON.parse(fs.readFileSync('characters.json', 'utf8'));






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

    let razza, speed, hit_points, initiative;
    let strength = 0;
    let dexterity = 0;
    let constitution = 0;
    let intelligence = 0;
    let wisdom = 0;
    let charisma = 0;
    
    let strengthmod = 0;
    let dexteritymod = 0;
    let constitutionmod = 0;
    let intelligencemod = 0;
    let wisdommod = 0;
    let charismamod = 0;

    let classe, proficiency_bonus, hit_dice;
    let strengthsaving = 0, dexteritysaving = 0, constitutionsaving = 0, intelligencesaving = 0, wisdomsaving = 0, charismasaving = 0;



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

                var raceResponse = await axios.get(`https://www.dnd5eapi.co/api/races/${razza.toLowerCase().replace(/\s+/g, '-')}`);
                speed = raceResponse.data.speed;

                


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

                var classResponse = await axios.get(`https://www.dnd5eapi.co/api/classes/${classe.toLowerCase().replace(/\s+/g, '-')}`);




            } catch (error) {
                console.error(error);
                bot.sendMessage(msg.chat.id, 'Errore durante la lettura delle razze');
            }



            //gestione hit dice e proficiency
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

            //razze abilty scores 
            switch (raceResponse.data.name.toLowerCase()) {
                case "dragonborn":
                    strength += 2;
                    charisma += 1;
                    console.log(strength);
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

            //razze Modifiers
            bot.sendMessage(chatId, 'Roll the Dices!');
            bot.sendMessage(chatId, 'Strength:');
            bot.once('message', async (livelloMsg) => {
                strength = parseInt(livelloMsg.text);
                strengthmod += applyMod(strength);

                bot.sendMessage(chatId, 'Dexterity:');
                bot.once('message', async (livelloMsg) => {
                    dexterity = parseInt(livelloMsg.text);
                    dexteritymod += applyMod(dexterity);

                    bot.sendMessage(chatId, 'Constitution:');
                    bot.once('message', async (livelloMsg) => {
                        constitution = parseInt(livelloMsg.text);
                        constitutionmod += applyMod(constitution);

                        bot.sendMessage(chatId, 'Intelligence:');
                        bot.once('message', async (livelloMsg) => {
                            intelligence = parseInt(livelloMsg.text);
                            intelligencemod += applyMod(intelligence);
    
                            bot.sendMessage(chatId, 'Wisdom:');
                            bot.once('message', async (livelloMsg) => {
                                wisdom = parseInt(livelloMsg.text);
                                wisdommod += applyMod(wisdom);
        
                                bot.sendMessage(chatId, 'Charisma:');
                                bot.once('message', async (livelloMsg) => {
                                    charisma = parseInt(livelloMsg.text);
                                    charismamod += applyMod(charisma);

                                    //saving throws added after modifiers
                                    switch (classResponse.data.name.toLowerCase()) {
                                        case "barbarian":
                                            hit_points = 8 + constitutionmod;
                                            strengthsaving = strengthmod + proficiency_bonus;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod + proficiency_bonus;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod;
                                            break;
                                        case "bard":                         
                                            hit_points = 8 + constitutionmod;                   
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod + proficiency_bonus;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod + proficiency_bonus;
                                            break;
                                        case "cleric":
                                            hit_points = 8 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod + proficiency_bonus;
                                            charismasaving = charismamod + proficiency_bonus;
                                            break;
                                        case "druid":
                                            hit_points = 8 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod + proficiency_bonus;
                                            wisdomsaving = wisdommod + proficiency_bonus;
                                            charismasaving = charismamod;
                                            break;
                                        case "rogue":
                                            hit_points = 8 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod + proficiency_bonus;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod + proficiency_bonus;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod;
                                            break;
                                        case "warlock":
                                            hit_points = 8 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod + proficiency_bonus;
                                            charismasaving = charismamod  + proficiency_bonus;
                                            break;
                                        case "monk":
                                            hit_points = 8 + constitutionmod;
                                            strengthsaving = strengthmod + proficiency_bonus;
                                            dexteritysaving = dexteritymod + proficiency_bonus;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod;
                                            break;
                                        case "fighter":
                                            hit_points = 10 + constitutionmod;
                                            strengthsaving = strengthmod + proficiency_bonus;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod + proficiency_bonus;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod;
                                            break;
                                         case "paladin":
                                            hit_points = 10 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod + proficiency_bonus;
                                            charismasaving = charismamod  + proficiency_bonus;
                                            break;
                                        case "ranger":
                                            hit_points = 10 + constitutionmod;
                                            strengthsaving = strengthmod + proficiency_bonus;
                                            dexteritysaving = dexteritymod + proficiency_bonus;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod;
                                            break;
                                        case "sorcerer":
                                            hit_points = 6 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod+ proficiency_bonus;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod  + proficiency_bonus;
                                            break;
                                        case "wizard":
                                            hit_points = 6 + constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod + proficiency_bonus;
                                            wisdomsaving = wisdommod + proficiency_bonus;
                                            charismasaving = charismamod;
                                            break;
                                        default:
                                            hit_points = constitutionmod;
                                            strengthsaving = strengthmod;
                                            dexteritysaving = dexteritymod;
                                            constitutionsaving = constitutionmod;
                                            intelligencesaving = intelligencemod;
                                            wisdomsaving = wisdommod;
                                            charismasaving = charismamod;
                                    }



                                    initiative = dexteritymod;

                                    const character = {
                                        nome,
                                        livello,
                                        razza,
                                        classe,
                                        proficiency_bonus,
                                        combat: {
                                            speed,
                                            hit_dice,
                                            initiative
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
                                            charisma,
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
                    });
                });
            });

            
        });
    });
});



function applyMod(value){
    let mod = 0;
    if (value === 1) {
      mod = -5;
    } else if (value >= 2 && value <= 3) {
      mod = -4;
    } else if (value >= 4 && value <= 5) {
      mod = -3;
    } else if (value >= 6 && value <= 7) {
      mod = -2;
    } else if (value >= 8 && value <= 9) {
      mod = -1;
    } else if (value >= 10 && value <= 11) {
      mod = 0;
    } else if (value >= 12 && value <= 13) {
      mod = 1;
    } else if (value >= 14 && value <= 15) {
      mod = 2;
    } else if (value >= 16 && value <= 17) {
      mod = 3;
    } else if (value >= 18 && value <= 19) {
      mod = 4;
    } else if (value >= 20 && value <= 21) {
      mod = 5;
    } else if (value >= 22 && value <= 23) {
      mod = 6;
    } else if (value >= 24 && value <= 25) {
      mod = 7;
    } else if (value >= 26 && value <= 27) {
      mod = 8;
    } else if (value >= 28 && value <= 29) {
      mod = 9;
    } else if (value === 30) {
      mod = 10;
    }
    return mod;
}



//see your characers /characters
bot.onText(/\/characters/, (msg) => {
    const chatId = msg.chat.id;
    const characterNames = charactersData.characters.map((character) => character.nome);
    const inlineKeyboard = characterNames.map((name) => [{ text: name, callback_data: name }]);
    const options = { reply_markup: JSON.stringify({ inline_keyboard: inlineKeyboard }) };
    bot.sendMessage(chatId, 'Seleziona un personaggio:', options);
  });

// callback characters
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const characterName = callbackQuery.data;
    const selectedCharacter = charactersData.characters.find((character) => character.nome === characterName);
    


    if (selectedCharacter) {
      const characterInfo = `
        Nome: ${selectedCharacter.nome}
        Livello: ${selectedCharacter.livello}
        Razza: ${selectedCharacter.razza}
        Classe: ${selectedCharacter.classe}
        Bonus di competenza: ${selectedCharacter.proficiency_bonus}
        Velocità di combattimento: ${selectedCharacter.combat.speed}
        Dado vita: ${selectedCharacter.combat.hit_dice}
        Iniziativa: ${selectedCharacter.combat.initiative}
        Valori abilità:
          Forza: ${selectedCharacter.ability_scores.strength} (mod: ${selectedCharacter.ability_scores.strengthmod})
          Destrezza: ${selectedCharacter.ability_scores.dexterity} (mod: ${selectedCharacter.ability_scores.dexteritymod})
          Costituzione: ${selectedCharacter.ability_scores.constitution} (mod: ${selectedCharacter.ability_scores.constitutionmod})
          Intelligenza: ${selectedCharacter.ability_scores.intelligence} (mod: ${selectedCharacter.ability_scores.intelligencemod})
          Saggezza: ${selectedCharacter.ability_scores.wisdom} (mod: ${selectedCharacter.ability_scores.wisdommod})
          Carisma: ${selectedCharacter.ability_scores.charisma} (mod: ${selectedCharacter.ability_scores.charismamod})
        Tiri salvezza:
          Forza: ${selectedCharacter.saving_throws.strengthsaving}
          Destrezza: ${selectedCharacter.saving_throws.dexteritysaving}
          Costituzione: ${selectedCharacter.saving_throws.constitutionsaving}
          Intelligenza: ${selectedCharacter.saving_throws.intelligencesaving}
          Saggezza: ${selectedCharacter.saving_throws.wisdomsaving}
          Carisma: ${selectedCharacter.saving_throws.charismasaving}
      `;
  
      bot.sendMessage(chatId, characterInfo);
    } else {
      bot.sendMessage(chatId, 'Personaggio non trovato.');
    }
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
// bot.on('callback_query', async (query) => {
//     try {
//         console.log(JSON.stringify(query))
//         const url = query.data;
//         const response = await axios.get(apiPrefix + url);

//         if (races.includes(query.data)) {
//             HandleRace(response.data);
//         } else if (classes.include(query.data)) {
//             HandleClasses(response.data);
//         }


//     } catch (error) {
//         console.error(error);
//         bot.sendMessage(query.message.chat.id, 'Errore durante la lettura delle informazioni sulla razza');
//     }
// });


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