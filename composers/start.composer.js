import { Composer } from "telegraf";

export const startComposer = new Composer();

startComposer.start(ctx => ctx.reply('Дарова!'));
startComposer.help(ctx => ctx.reply('Нужна помощь?'));