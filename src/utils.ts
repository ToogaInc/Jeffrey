import { Message, HexColorString } from 'discord.js';

export const NUMBER_EMOJIS: string[] = [
    "1⃣",
    "2⃣",
    "3⃣",
    "4⃣",
    "5⃣",
    "6⃣",
    "7⃣",
    "8⃣",
    "9⃣",
    "🔟"
];
/**
 * Chooses a random number between min and max
 * @param min - the lowest possible number
 * @param max - the highest possible number
 * @returns - returns the random number
 */
export async function rng(min: number, max: number): Promise<number> {

    const randomDecimal = Math.random();

    const range = max - min + 1;
    const randomNumber = Math.floor(randomDecimal * range + 1) + min;

    return randomNumber
}

export async function getEmbedColor(rarity: string): Promise<HexColorString> {
    let color: HexColorString;
    if(rarity === 'common') {
        color = `#808080`; //grey
    }else if(rarity === 'uncommon') {
        color = `#00A36C`; //green
    }else if (rarity === 'rare') {
        color = `#FF69B4`; //pink
    }else if (rarity === 'legendary') {
        color = `#D4A017`;// orange gold
    }else{
        color = `#000000` //black (shouldnt show up)
    }
    return color;
}

export async function tryDelete(m: Message): Promise<boolean> {
    try{
        m.delete();
        return true;
    }catch(err){
        console.error('could not delete message', err);
        return false;
    }
}