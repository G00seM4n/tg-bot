require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const bot = new Telegraf(process.env.TELEGRAF_KEY);

const answers = [
    'ответ 1',
    'ответ 2',
    'ответ 3',
    'ответ 4',
    'ответ 5'
];
bot.command('opros', ctx => {
    ctx.sendPoll(
        'вопрос?',
        answers,
        {
            allows_multiple_answers: false,
            is_anonymous: false
        }
    );

    const reminder = new CronJob(
        '0 4 * * * *', //выполняется каждые 4 часа
        function () {
            const date = new Date(2023, 6, 19), //январь = 0
                year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();

            const nowDate = new Date(),
                nowYear = nowDate.getFullYear(),
                nowMonth = nowDate.getMonth(),
                nowDay = nowDate.getDate();

            if (nowYear === year && nowMonth === month && nowDay === day) {
                console.log('НАПОМИНАНИЕ');

                reminder.stop();
            }
        },
        null,
        true,
        'Asia/Novosibirsk'
    );
});

bot.on('poll_answer', ctx => {
    const user = {
        "user_id": ctx.pollAnswer.user.id,
        "answer_id": ctx.pollAnswer.option_ids[0]
    };

    if (!fs.existsSync(`data/${ctx.update.poll_answer.poll_id}.json`)) {
        fs.writeFileSync(`data/${ctx.update.poll_answer.poll_id}.json`, JSON.stringify([user]));
    } else {
        fs.readFile(`data/${ctx.update.poll_answer.poll_id}.json`, function (err, data) {
            if (err) throw err;

            const json = JSON.parse(data);
            json.push(user);

            fs.writeFile(`data/${ctx.update.poll_answer.poll_id}.json`, JSON.stringify(json), function (err) {
                if (err) throw err;
            });

            console.log('Saved!');
        });
    }
});

bot.launch();