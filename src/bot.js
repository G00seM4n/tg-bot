// .env
import { config } from 'dotenv';
config();

// Telegraf
import { Telegraf, Scenes, session } from 'telegraf';

// Scenes
import { pollScene } from './scenes/poll.scene.js';

// Composers
import { startComposer } from './composers/start.composer.js';
import { pollComposer } from './composers/poll.composer.js';

// mySql
import { createConnection } from 'mysql2';

// cron
import { CronJob } from 'cron';

const bot = new Telegraf(process.env.TELEGRAF_KEY);

const stage = new Scenes.Stage([pollScene]);
bot.use(session());
bot.use(stage.middleware());

bot.context.db = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    namedPlaceholders: true
});

bot.use(startComposer);
bot.use(pollComposer);

const reminder = new CronJob(
    '0 12 * * *', // Выполняется каждый день в 12:00 (https://crontab.guru/#0_12_*_*_*)
    () => {
        const today = new Date();
        const now = today.toLocaleDateString('ru-RU').split('.'); // получить сегодняшнюю дату в формате '[MM, DD, YYYY]'

        console.log(now);

        /*
            Каждый день в 12:00 делать запрос в таблицу "poll" и искать в ней опрос,
            у которого значение "event_date" =(равен) сегодняшней дате -(минус) 1 день.
            Если есть совпадение, то отправить в чат оповещение.
        */

        // ctx.db.query(
        //     'SELECT * FROM `polls` WHERE `event_date` = ?',
        //     [/* Дата */],
        //     function (err, results) {
        //         console.log(results);
        //     }
        // );
    },
    null,
    true,
    'Asia/Novosibirsk'
);

bot.launch();