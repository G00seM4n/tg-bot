import { config } from 'dotenv';
import fs from 'fs';
import { Telegraf, Scenes, session } from 'telegraf';
// import { CronJob } from 'cron';

config();
const bot = new Telegraf(process.env.TELEGRAF_KEY);

// const { isAdmin } = require('../helpers/isAdmin.js');

const oprosWizard = new Scenes.WizardScene(
    'opros',
    ctx => {
        ctx.reply('Задайте текст вопросу');

        ctx.wizard.state.oprosData = {};
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.oprosData.question = ctx.message.text;
        ctx.reply('Введите дату анонса в формате: D.M.YYYY H:M');

        return ctx.wizard.next();
    },
    async ctx => {
        let date = ctx.message.text.trim().split('.');

        ctx.wizard.state.oprosData.date = date;

        const answers = [
            'Да',
            'Нет',
        ];
        await ctx.telegram.sendPoll(
            Number(process.env.GROUP_ID),
            ctx.wizard.state.oprosData.question,
            answers,
            {
                allows_multiple_answers: false,
                is_anonymous: false
            }
        );

        // console.log(ctx)
        ctx.scene.leave();
    }
);

const stage = new Scenes.Stage([oprosWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => ctx.reply('Дарова!'));
bot.help(ctx => ctx.reply('Нужна помощь?'));

bot.command('opros', async ctx => {
    if (ctx.from.id !== Number(process.env.ADMIN_ID) && ctx.chat.id < 0) return; //проверка на админа и что боту пишут лично

    ctx.scene.enter('opros');

    // isAdmin(ctx.message.chat.id, ctx).then((res) => {
    // console.log(ctx.message.chat.id)
    // if (ctx.message.chat.id > 0 && ctx.from.id !== 870633416) {
    //     ctx.telegram.sendMessage('870633416', ctx.scene.enter('opros_data_id'))

    // console.log(ctx.message.chat.id)

    // const reminder = new CronJob(
    //     '0 4 * * * *', //выполняется каждые 4 часа
    //     function () {
    //         const date = new Date(2023, 6, 19), //январь = 0
    //             year = date.getFullYear(),
    //             month = date.getMonth(),
    //             day = date.getDate();

    //         const nowDate = new Date(),
    //             nowYear = nowDate.getFullYear(),
    //             nowMonth = nowDate.getMonth(),
    //             nowDay = nowDate.getDate();

    //         if (nowYear === year && nowMonth === month && nowDay === day) {
    //             console.log('НАПОМИНАНИЕ');

    //             reminder.stop();
    //         }
    //     },
    //     null,
    //     true,
    //     'Asia/Novosibirsk'
    // );
    // }

    // .catch((err) => {
    //     console.log("Произошла ошибка при создании опроса: " + JSON.stringify(err));
    // });
});

bot.on('poll_answer', ctx => {
    const answer = {
        'poll_id': Number(ctx.pollAnswer.poll_id),
        'user_id': Number(ctx.pollAnswer.user.id),
        'answer_id': Number(ctx.pollAnswer.option_ids[0]),
        'created_at': new Date().getTime(),
    };

    if (!fs.existsSync('data/answers.json')) {
        fs.writeFileSync('data/answers.json', JSON.stringify([answer]));
        return;
    }

    fs.readFileSync('data/answers.json', function (err, data) {
        if (err) throw err;

        const json = JSON.parse(data);
        json.push(answer);

        fs.writeFileSync('data/answers.json', JSON.stringify(json), function (err) {
            if (err) throw err;
        });
    });
});

bot.launch();