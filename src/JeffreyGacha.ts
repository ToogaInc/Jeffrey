import { DailyWheel } from './JeffreyDB';
import { rng } from './utils';


type GachaURLType = {
    link: string;
    name: string;
    description: string;
};
//Object containing the 4 rarities, 'Common', 'Uncommon', 'Rare' and 'Legendary'.
//Each rarity is an array of gacha objects, containing the link(URL), name and description of all gachas.
export const JeffreyGachaURLs: { [key: string]: GachaURLType[] } = {
    Common: [
        { link: 'https://imgur.com/iSHcsOd.png', name: '', description: '' },
        { link: 'https://imgur.com/Oyh1TiC.png', name: '', description: '' },
        { link: 'https://imgur.com/hr1tx64.png', name: '', description: '' },
        { link: 'https://imgur.com/xQqwrWD.png', name: '', description: '' },
        { link: 'https://imgur.com/4mrEWuV.png', name: '', description: '' },
        { link: 'https://imgur.com/cSprAX4.png', name: '', description: '' },
        { link: 'https://imgur.com/DaCVzq8.png', name: '', description: '' },
        { link: 'https://imgur.com/Z2LaGwY.png', name: '', description: '' },
        { link: 'https://imgur.com/mx70oY2.png', name: '', description: '' },
        { link: 'https://imgur.com/AivmZ0T.png', name: '', description: '' },
        { link: 'https://imgur.com/6dD6wHv.png', name: '', description: '' },
        { link: 'https://imgur.com/22niPvw.png', name: '', description: '' },
        { link: 'https://imgur.com/sqnH5tg.png', name: '', description: '' },
        { link: 'https://imgur.com/nXo9YbZ.png', name: '', description: '' },
        { link: 'https://imgur.com/po28ZPo.png', name: '', description: '' },
        { link: 'https://imgur.com/zEfh9G1.png', name: '', description: '' },
        { link: 'https://imgur.com/MsftbNA.png', name: '', description: '' },
        { link: 'https://imgur.com/GJFRw0N.png', name: '', description: '' },
        { link: 'https://imgur.com/Qgi4yeQ.png', name: '', description: '' },
        { link: 'https://imgur.com/bpVQ6xz.png', name: '', description: '' },
        { link: 'https://imgur.com/DdhzNO2.png', name: '', description: '' },
        { link: 'https://imgur.com/AvqpwfX.png', name: '', description: '' },
        { link: 'https://imgur.com/RuOtxcv.png', name: '', description: '' },
        { link: 'https://imgur.com/6WkntdW.png', name: '', description: '' },
        { link: 'https://imgur.com/40M1KOh.png', name: '', description: '' },
        { link: 'https://imgur.com/ZtPZZV9.png', name: '', description: '' }
    ],
    
    Uncommon: [
        { link: 'https://imgur.com/txgkO4S.png', name: '', description: '' },
        { link: 'https://imgur.com/gqbRfhW.png', name: '', description: '' },
        { link: 'https://imgur.com/qYIxVan.png', name: '', description: '' },
        { link: 'https://imgur.com/KBwG10J.png', name: '', description: '' },
        { link: 'https://imgur.com/dord5jv.png', name: '', description: '' },
        { link: 'https://imgur.com/WGDO515.png', name: '', description: '' },
        { link: 'https://imgur.com/JujU88m.png', name: '', description: '' },
        { link: 'https://imgur.com/6ur3hgK.png', name: '', description: '' },
        { link: 'https://imgur.com/J1Ozvgw.png', name: '', description: '' },
        { link: 'https://imgur.com/DQDZFjA.png', name: '', description: '' },
        { link: 'https://imgur.com/15p7sDo.png', name: '', description: '' },
        { link: 'https://imgur.com/ASOaLa7.png', name: '', description: '' },
        { link: 'https://imgur.com/kSo1xYB.png', name: '', description: '' },
        { link: 'https://imgur.com/vWkhS1P.png', name: '', description: '' },
        { link: 'https://imgur.com/FirGg1T.png', name: '', description: '' },
        { link: 'https://imgur.com/WVAcNOm.png', name: '', description: '' },
        { link: 'https://imgur.com/57yMtrl.png', name: '', description: '' },
        { link: 'https://imgur.com/j00IjET.png', name: '', description: '' },
        { link: 'https://imgur.com/DnWGWJS.png', name: '', description: '' },
        { link: 'https://imgur.com/OqOol5X.png', name: '', description: '' },
        { link: 'https://imgur.com/xryAFJi.png', name: '', description: '' },
        { link: 'https://imgur.com/WYGcMzt.png', name: '', description: '' },
        { link: 'https://imgur.com/jhIC3Js.png', name: '', description: '' },
        { link: 'https://imgur.com/Qh7TDY3.png', name: '', description: '' },
        { link: 'https://imgur.com/NaKE5Y2.png', name: '', description: '' },
        { link: 'https://imgur.com/M2wJBt9.png', name: '', description: '' },
        { link: 'https://imgur.com/voMHJ9n.png', name: '', description: '' },
        { link: 'https://imgur.com/z81zoZ9.png', name: '', description: '' },
        { link: 'https://imgur.com/mQB4xHr.png', name: '', description: '' }
    ],
    
    Rare: [
        { link: 'https://imgur.com/eNx2Ntg.png', name: '', description: '' },
        { link: 'https://imgur.com/moIgaas.png', name: '', description: '' },
        { link: 'https://imgur.com/M2wJBt9.png', name: '', description: '' },
        { link: 'https://imgur.com/NaKE5Y2.png', name: '', description: '' },
        { link: 'https://imgur.com/KBwG10J.png', name: '', description: '' },
        { link: 'https://imgur.com/D1cuR7k.png', name: '', description: '' },
        { link: 'https://imgur.com/rt6lIPt.png', name: '', description: '' },
        { link: 'https://imgur.com/vvWZ384.png', name: '', description: '' },
        { link: 'https://imgur.com/UFNSYrP.png', name: '', description: '' },
        { link: 'https://imgur.com/CKfOGtA.png', name: '', description: '' },
        { link: 'https://imgur.com/dVGsAIo.png', name: '', description: '' },
        { link: 'https://imgur.com/JujU88m.png', name: '', description: '' },
        { link: 'https://imgur.com/KnTrE2e.png', name: '', description: '' },
        { link: 'https://imgur.com/yjh3yZg.png', name: '', description: '' },
        { link: 'https://imgur.com/BbtiZwy.png', name: '', description: '' },
        { link: 'https://imgur.com/LijfPss.png', name: '', description: '' },
        { link: 'https://imgur.com/GnnuMI5.png', name: '', description: '' },
        { link: 'https://imgur.com/eGPRhm5.png', name: '', description: '' },
        { link: 'https://imgur.com/l8uOmAq.png', name: '', description: '' }
    ],  
      
    Legendary: [
        { link: 'https://imgur.com/miHJetv.png', name: 'Radiant Jeffrey', description: 'Our Lord and Savior Jeffrey' },
        { link: 'https://imgur.com/tbS4faL.png', name: 'Radiant Jeffrey', description: 'OK FINE ILL FEED YOU NOW!' },
        { link: 'https://imgur.com/5QfM3zQ.png', name: 'Dead Jeffrey', description: 'RIP. Fly high king' },
        { link: 'https://imgur.com/xhWXOIA.png', name: 'Box Jeffrey', description: 'Wow, soooo original Jeffrey. Never seen a cat do THAT before.' },
        { link: 'https://imgur.com/okvejbp.png', name: 'Disturbed Jeffrey', description: 'I don\'t think he\'s a fan...' },
        { link: 'https://imgur.com/sdLYctZ.png', name: 'Cuddle Jeffrey', description: 'Wittle Cutie!' },
        { link: 'https://imgur.com/CYvTDSC.png', name: 'Not Jeffrey', description: 'Hey, that\'s not Jeffrey!' },
        { link: 'https://imgur.com/jmKtrlf.png', name: 'Peaceful Jeffrey', description: 'That\'s about as peacful as its gonna get...' },
        { link: 'https://imgur.com/Y1i2gMP.png', name: 'Attack Jeffrey', description: 'That bite\'s lethal!' },
        { link: 'https://imgur.com/3aWCqqe.png', name: 'Caught Jeffrey', description: 'Hey, what going on over here!' },
        { link: 'https://imgur.com/eTGaGLM.png', name: 'Lap-Cat Jeffrey', description: 'He\'s been know to peruse a lap or two.' },
        { link: 'https://imgur.com/7YdKWjS.png', name: 'GateKeeper Jeffrey', description: 'Come on Jeffrey, that\'s not very nice!' }
    ]
}

export const WheelResults: { [key: string]: { Name: string; Description: string } } = {
    OneCoin: {
        Name: '1 Coin...',
        Description: 'Wow thats lame...'
    },
    TenCoins: {
        Name: '10 Coins',
        Description: 'Hey, at least its something.'
    },
    TwentyFiveCoins: {
        Name: '25 coins',
        Description: 'Could be more, but not terrible!'
    },
    FiftyCoins: {
        Name: '50 Coins',
        Description: 'Solid spin!'
    },
    SixtyNineCoins: {
        Name: '69 coins',
        Description: 'Nice'
    },
    OneHundredCoins: {
        Name: '100 coins!',
        Description: 'One hundred? Thats TEN rolls if you did them individually! I wouldn\'t recommend that though.' 
    },
    OneFiftyCoins: {
        Name: '150 coins!',
        Description: 'Awesome! Perfect for TEN rolls (if you do them five at a time)!'
    },
    FourTwentyCoins: {
        Name: '420 coins',
        Description: 'Blaze it'
    },
    Legendary: {
        Name: 'LEGENDARY!?',
        Description: 'You got a legendary from the wheel? I didn\'t even know that was possible!'
    },
    Jackpot: {
        Name: ' A JACKPOT!!!!!!!!!',
        Description: 'OMG. Ok im starting to think this creator sucks at balancing.'
    }

}

/**
 * Takes a Legendary gacha URL and returns an array containing the link(url), name and description of that gacha.
 * 
 * @param {string} gacha - A Legendary gacha image URL 
 * @returns {string[]} - gachaInfo, contains legendary info (link, name and description)
 */
export async function displayLegendary(gacha: string): Promise<string[] | null> { 
    const legendary = JeffreyGachaURLs['Legendary'];
    for(let i = 0; i < legendary.length; i++){
        if(legendary[i].link === gacha){
            const gachaInfo = [
                legendary[i].name,
                legendary[i].name,
                legendary[i].description
            ];
            return gachaInfo;
        }
    }
    return null;
}

export async function spinWheel(userID: string): Promise<[string[], number] | null> {
    const rndm = await rng(0, 1000);
    let reward: string[] = [];
    let coins: number = 0;

    try{
        const spin = await DailyWheel.increment({ spins: -1 }, {where: { userid: userID } });
        console.log(`${userID} has used one of their spins!`);
    }catch(err){
        console.error(err);
    }

    if(rndm < 20){
        reward = [
            WheelResults.OneCoin.Name,
            WheelResults.OneCoin.Description
        ];
        coins = 1;
    }else if(rndm >= 20 && rndm < 150 ){
        reward = [
            WheelResults.TenCoins.Name,
            WheelResults.TenCoins.Description
        ];
        coins = 10;
    }else if(rndm >= 150 && rndm < 400){
        reward = [
            WheelResults.TwentyFiveCoins.Name,
            WheelResults.TwentyFiveCoins.Description
        ];
        coins = 25;
    }else if(rndm >= 400 && rndm < 650 ){
        reward = [
            WheelResults.FiftyCoins.Name,
            WheelResults.FiftyCoins.Description
        ];
        coins = 50;
    }else if(rndm >= 650 && rndm < 750 ){
        reward = [
            WheelResults.SixtyNineCoins.Name,
            WheelResults.SixtyNineCoins.Description
        ];
        coins = 69;
    }else if(rndm >= 750 && rndm < 870){
        reward = [
            WheelResults.OneHundredCoins.Name,
            WheelResults.OneHundredCoins.Description
        ];
        coins = 100;
    }else if(rndm >= 870 && rndm < 970 ){
        reward = [
            WheelResults.OneFiftyCoins.Name,
            WheelResults.OneFiftyCoins.Description
        ];
        coins = 150;
    }else if(rndm >= 970 && rndm < 990 ){
        reward = [
            WheelResults.Legendary.Name,
            WheelResults.Legendary.Description
        ];
        coins = -1;
    }else if(rndm >= 990 && rndm <= 1000){
        reward = [
            WheelResults.Jackpot.Name,
            WheelResults.Jackpot.Description
        ];
        coins = 1000;
    }else{
        console.log(`ERROR: Failed to choose WheelResult`);
        return null;
    }
    return [reward, coins];
};

