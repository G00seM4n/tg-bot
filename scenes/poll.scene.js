import { Scenes } from 'telegraf';
import saveData from '../helpers/saveData.js';

export const pollScene = new Scenes.WizardScene(
    'poll_id',
    ctx => {
        ctx.reply('Задайте текст вопросу');

        ctx.wizard.state.oprosData = {};
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.oprosData.question = ctx.message.text;
        ctx.reply('Введите дату анонса в формате: D.M.YYYY');

        return ctx.wizard.next();
    },
    async ctx => {
        const dateArr = ctx.message.text.trim().split('.');
        const [day, month, year] = dateArr;

        const date = new Date(year, month, day);

        if (date.getFullYear() != year && date.getMonth() != month && date.getDate() != day) {
            ctx.reply('Дата не корректна');
            ctx.scene.leave();
        }

        ctx.wizard.state.oprosData.date = dateArr;

        const answers = [
            'Да',
            'Нет',
        ];
        const sendPoll = ctx.telegram.sendPoll(
            Number(process.env.GROUP_ID),
            ctx.wizard.state.oprosData.question,
            answers,
            {
                allows_multiple_answers: false,
                is_anonymous: false
            }
        );

        const poll = {
            'poll_id': (await sendPoll).poll.id,
            'poll_question': (await sendPoll).poll.question,
            'poll_answers': (await sendPoll).poll.options,
            'event_date': ctx.wizard.state.oprosData.date,
            'created_at': new Date().getTime()
        };

        saveData('polls', poll);

        ctx.scene.leave();
    }
);