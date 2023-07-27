import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    target: 'node',
    entry: './src/bot.js',
    output: {
        filename: 'bot.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};