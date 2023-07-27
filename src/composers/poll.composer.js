import { Composer } from 'telegraf';

export const pollComposer = new Composer();

pollComposer.command('opros', ctx => {
    if (ctx.from.id !== Number(process.env.ADMIN_ID) && ctx.chat.id < 0) return; //проверка на админа и что боту пишут лично

    try {
        ctx.scene.enter('poll_id');
    } catch (err) {
        console.error('Error' + err);
    }

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

pollComposer.on('poll_answer', ctx => {
    const answer = {
        'user_id': ctx.pollAnswer.user.id,
        'poll_id': ctx.pollAnswer.poll_id,
        'answer_id': ctx.pollAnswer.option_ids[0],
        'created_at': new Date().getTime(),
    };

    try {
        ctx.db.execute(
            "INSERT INTO `answers`(`user_id`, `poll_id`, `answer_id`, `created_at`) VALUES (?, ?, ?, ?)",
            [answer.user_id, answer.poll_id, answer.answer_id, answer.created_at]
        );
    } catch (err) {
        console.log(err)
    }
});