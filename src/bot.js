// Modules
import { config } from 'dotenv';
import { Telegraf, Scenes, session } from 'telegraf';
import { createConnection } from 'mysql2';
import { CronJob } from 'cron';

// Scenes
import { pollScene } from './scenes/poll.scene.js';

// Composers
import { startComposer } from './composers/start.composer.js';
import { pollComposer } from './composers/poll.composer.js';

config();

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
        const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));

        const dateTomorrow = {
            year: tomorrow.getFullYear(),
            month: tomorrow.getMonth() + 1,
            day: tomorrow.getDate()
        };

        try {
            bot.context.db.query(
                'SELECT * FROM `polls` WHERE `event_date` = ?',
                [`${dateTomorrow.year}-${dateTomorrow.month}-${dateTomorrow.day}`],
                (err, results) => {
                    if (results.length < 0) return;

                    results.forEach(poll => {
                        bot.telegram.sendMessage(process.env.GROUP_ID, `Завтра что-то будет: ${poll.poll_question}`);
                    });
                }
            );
        } catch (err) {
            console.error(err);
        }
    },
    null,
    true,
    'Asia/Novosibirsk'
);

bot.launch();