// .env
import { config } from 'dotenv';
config();

// Telegraf
import { Telegraf, Scenes, session } from 'telegraf';

// Scenes
import { pollScene } from './scenes/poll.scene.js';

// mySql
import { createConnection } from 'mysql2';

// Composers
import { startComposer } from './composers/start.composer.js';
import { pollComposer } from './composers/poll.composer.js';

const bot = new Telegraf(process.env.TELEGRAF_KEY);

const stage = new Scenes.Stage([pollScene]);
bot.use(session());
bot.use(stage.middleware());

bot.context.db = createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bot-opros',
    namedPlaceholders: true
});

bot.use(startComposer);
bot.use(pollComposer);

bot.launch();