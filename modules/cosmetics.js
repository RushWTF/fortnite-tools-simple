//Variables
const axios = require('axios');
const { loadImage, createCanvas } = require('canvas');


//Functions
async function getData() {
    let request = axios.get('https://fortnite-api.com/v2/cosmetics/br/new');
    let response = await request;
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}

async function orderData(data) {
    class Cosmetic {
        constructor(id, name, description, type, rarity, series, images) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.type = type;
            this.rarity = rarity;
            this.series = series;
            this.images = images;
        }
    };
    let cosmetics = [];
    for (let cosmetic of data.data.items) {
        let cosmeticData = new Cosmetic(cosmetic.id, cosmetic.name, cosmetic.description, cosmetic.type.value, cosmetic.rarity.value, cosmetic.series, cosmetic.images);
        cosmetics.push(cosmeticData);
    }
    return cosmetics;
}

async function createImage(cosmetic) {
   //Size depends on the number of cosmetics
    let size = cosmetic.length;
    let px = 512;
    let cols = Math.ceil(Math.sqrt(size));
    let rows = Math.ceil(size / cols);
    let width = cols * px;
    let height = rows * px;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    let x = 0;
    let y = 0;
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, width, height);
    for (let cosmetics of cosmetic) {
        //Draw Background 
        let rarity = cosmetics.rarity;
        let color;
        switch (rarity) {
            case 'uncommon':
                color = '#1eff00';
                break;
            case 'rare':
                color = '#0070dd';
                break;
            case 'epic':
                color = '#a335ee';
                break;
            case 'legendary':
                color = '#ff8000';
                break;
            case 'icon':
                color = '#ffffff';
                break;
            default:
                color = '#ffffff';
                break;
        }
        ctx.fillStyle = color;
        ctx.fillRect(x, y, px, px);
        
        //Draw Image    
        let featured = cosmetics.images.featured;
        let icon = cosmetics.images.icon;
        if (featured === null) {
            featured = icon;
        }
        let image = await loadImage(featured);

        
        ctx.drawImage(image, x, y, px, px);
        x += 512;
        if (x >= width) {
            x = 0;
            y += 512;
        }
    }
    return canvas.toBuffer('image/png');
}


async function main() {
    let data = await getData();
    let cosmetics = await orderData(data);
    let image = await createImage(cosmetics);
    return image;
}

module.exports = { main };
