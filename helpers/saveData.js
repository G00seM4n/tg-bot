import fs from 'fs';

export default function saveData(fileName, obj) {
    if (!fs.existsSync(`data/${fileName}.json`)) {
        fs.writeFile(`data/${fileName}.json`, JSON.stringify([obj]), function (err) {
            if (err) throw err;
        });
        return;
    }

    fs.readFile(`data/${fileName}.json`, function (err, data) {
        if (err) throw err;

        const json = JSON.parse(data);
        json.push(obj);

        fs.writeFile(`data/${fileName}.json`, JSON.stringify(json), function (err) {
            if (err) throw err;
        });
    });
}