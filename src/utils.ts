import { Message, HexColorString, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { BUTTONS } from './constants/buttons';

/**
 * Chooses a random number between min and max
 * @param {number} min - the lowest possible number
 * @param {number} max - the highest possible number
 * @returns - returns the random number
 */
export async function rng(min: number, max: number): Promise<number> {
    const randomDecimal = Math.random();
    const range = max - min + 1;
    const randomNumber = Math.floor(randomDecimal * range + 1) + min;
    return randomNumber
};

/**
 * Function that takes a rarity and returns the color that the embed for that gacha rarity should be.
 * 
 * @param {string} rarity -  the rarity of the gacha to be displayed
 * @returns {Promise<HexColorString>} - the color(hexadecimal color string) associated with the given rarity
 */
export async function getEmbedColor(rarity: string): Promise<HexColorString> {
    let color: HexColorString;
    if (rarity === 'common') {
        color = `#808080`; //grey
    } else if (rarity === 'uncommon') {
        color = `#00A36C`; //green
    } else if (rarity === 'rare') {
        color = `#FF69B4`; //pink
    } else if (rarity === 'legendary') {
        color = `#D4A017`;// orange gold
    } else {
        color = `#000000` //black (shouldnt show up)
    }
    return color;
};

/**
 * Attempts to delete specified message.
 * 
 * @param {Message} m -  a discord message
 * @returns {Promise<boolean>} - Whether or not the message was successfully deleted
 */
export async function tryDelete(m: Message): Promise<boolean> {
    try {
        m.delete();
        return true;
    } catch (err) {
        console.error('could not delete message', err);
        return false;
    }
};

/**
 * Function used specifically for situations where the user cycles through 'Next' and 'Previous' buttons.
 * Checks if next/previous should be disabled or not. 
 * Previous - disabled if there is no place before it (position 0)
 * Next - disabled if there is no place above it (current position === max/highest possible position)
 * 
 * @param {number} currentPos - The current position in an array/list
 * @param {number} max - The highest possible position/number
 */
export async function checkIfFirstOrLast(currentPos: number, max: number): Promise<ActionRowBuilder<ButtonBuilder>> {
    const row = new ActionRowBuilder<ButtonBuilder>();
    if (currentPos < 1) {
        row.addComponents(BUTTONS.PREVIOUS_BUTTON.setDisabled(true));
    } else {
        row.addComponents(BUTTONS.PREVIOUS_BUTTON.setDisabled(false));
    }
    if (max - currentPos <= 1) {
        row.addComponents(BUTTONS.NEXT_BUTTON.setDisabled(true));
    } else {
        row.addComponents(BUTTONS.NEXT_BUTTON.setDisabled(false));
    }
    row.addComponents(BUTTONS.ROLL_AGAIN_BUTTON);
    return row;
};