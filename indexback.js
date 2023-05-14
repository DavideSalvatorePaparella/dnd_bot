require('dotenv').config();



const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

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



bot.onText(/\/immagine/, (msg) => {
    bot.sendPhoto(msg.chat.id, "https://davidesalvatore.altervista.org/cat.jpg", {
        caption: "silly cat"
    });
});

bot.onText(/\/acidarrow/, async (msg) =>{

    try{
    const response = await axios.get(`${apiUrl}/spells/acid-arrow`);

    //casting_time, level, attack_type, damage, classes
    const { name, desc, range, duration, components} = response.data;

    const message = `
      *${name}*
      Description: ${desc.join('\n')}
      Range: ${range}
      Duration: ${duration}
      Components: ${components.join(', ')}
    `;

    bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    }catch (error) {
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

    if(races.includes(message.text)){
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
    }else if(classes.includes(message.text)){
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
  

  function HandleRace(race){
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

  function HandleClasses(classname){
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

      if(races.includes(query.data)){
        HandleRace(response.data);
      }else if(classes.include(query.data))
      {
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