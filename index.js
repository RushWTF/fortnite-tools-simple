//Variables
const cosmetics = require('./modules/cosmetics.js');
const fs = require('fs');

//Save buffer to file 
async function saveFile(buffer) {
    fs.writeFile('cosmetics.webp', buffer, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

//Main function
async function main() {
    let image = await cosmetics.main();
    await saveFile(image);
}

//Run main function
main();