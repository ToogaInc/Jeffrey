import { DailyWheel } from './JeffreyDB';
import { rng } from './utils';

//Object containing the 4 rarities, which are arrays of all the gacha URL pictures from imgur.
export const JeffreyGachaURLs = {
    Common: [
        'https://imgur.com/iSHcsOd.png',
        'https://imgur.com/Oyh1TiC.png',
        'https://imgur.com/hr1tx64.png',
        'https://imgur.com/xQqwrWD.png',
        'https://imgur.com/4mrEWuV.png',
        'https://imgur.com/cSprAX4.png',
        'https://imgur.com/DaCVzq8.png',
        'https://imgur.com/Z2LaGwY.png',
        'https://imgur.com/mx70oY2.png',
        'https://imgur.com/AivmZ0T.png',
        'https://imgur.com/6dD6wHv.png',
        'https://imgur.com/22niPvw.png',
        'https://imgur.com/sqnH5tg.png',
        'https://imgur.com/nXo9YbZ.png',
        'https://imgur.com/po28ZPo.png',
        'https://imgur.com/zEfh9G1.png',
        'https://imgur.com/MsftbNA.png',
        'https://imgur.com/GJFRw0N.png',
        'https://imgur.com/Qgi4yeQ.png',
        'https://imgur.com/bpVQ6xz.png',
        'https://imgur.com/DdhzNO2.png',
        'https://imgur.com/AvqpwfX.png',
        'https://imgur.com/RuOtxcv.png',
        'https://imgur.com/6WkntdW.png',
        'https://imgur.com/40M1KOh.png',
        'https://imgur.com/ZtPZZV9.png'
    ],
    Uncommon: [
        'https://imgur.com/txgkO4S.png',
        'https://imgur.com/gqbRfhW.png',
        'https://imgur.com/qYIxVan.png',
        'https://imgur.com/KBwG10J.png',
        'https://imgur.com/dord5jv.png',
        'https://imgur.com/WGDO515.png',
        'https://imgur.com/JujU88m.png',
        'https://imgur.com/6ur3hgK.png',
        'https://imgur.com/J1Ozvgw.png',
        'https://imgur.com/DQDZFjA.png',
        'https://imgur.com/15p7sDo.png',
        'https://imgur.com/ASOaLa7.png',
        'https://imgur.com/kSo1xYB.png',
        'https://imgur.com/vWkhS1P.png',
        'https://imgur.com/FirGg1T.png',
        'https://imgur.com/WVAcNOm.png',
        'https://imgur.com/57yMtrl.png',
        'https://imgur.com/j00IjET.png',
        'https://imgur.com/DnWGWJS.png',
        'https://imgur.com/OqOol5X.png',
        'https://imgur.com/xryAFJi.png',
        'https://imgur.com/WYGcMzt.png',
        'https://imgur.com/jhIC3Js.png',
        'https://imgur.com/Qh7TDY3.png',
        'https://imgur.com/NaKE5Y2.png',
        'https://imgur.com/M2wJBt9.png',
        'https://imgur.com/voMHJ9n.png',
        'https://imgur.com/z81zoZ9.png',
        'https://imgur.com/mQB4xHr.png'        
    ],
    Rare: [
        'https://imgur.com/eNx2Ntg.png',
        'https://imgur.com/moIgaas.png',
        'https://imgur.com/M2wJBt9.png',
        'https://imgur.com/NaKE5Y2.png',
        'https://imgur.com/KBwG10J.png',
        'https://imgur.com/D1cuR7k.png',
        'https://imgur.com/rt6lIPt.png',
        'https://imgur.com/vvWZ384.png',
        'https://imgur.com/UFNSYrP.png',
        'https://imgur.com/CKfOGtA.png',
        'https://imgur.com/dVGsAIo.png',
        'https://imgur.com/JujU88m.png',
        'https://imgur.com/KnTrE2e.png',
        'https://imgur.com/yjh3yZg.png',
        'https://imgur.com/BbtiZwy.png',
        'https://imgur.com/LijfPss.png',
        'https://imgur.com/GnnuMI5.png',
        'https://imgur.com/eGPRhm5.png',
        'https://imgur.com/l8uOmAq.png'        
    ],
    Legendary: [
        { link: 'https://imgur.com/miHJetv.png', name: 'RadiantJeffrey' },
        { link: 'https://imgur.com/tbS4faL.png', name: 'CannibalJeffrey' },
        { link: 'https://imgur.com/5QfM3zQ.png', name: 'DeadJeffrey' },
        { link: 'https://imgur.com/xhWXOIA.png', name: 'BoxJeffrey' },
        { link: 'https://imgur.com/okvejbp.png', name: 'DisturbedJeffrey' },
        { link: 'https://imgur.com/sdLYctZ.png', name: 'CuddleJeffrey' },
        { link: 'https://imgur.com/CYvTDSC.png', name: 'ThatsNotJeffrey!?' },
        { link: 'https://imgur.com/jmKtrlf.png', name: 'AtpeaceJeffrey' },
        { link: 'https://imgur.com/Y1i2gMP.png', name: 'AttackJeffrey' },
        { link: 'https://imgur.com/3aWCqqe.png', name: 'CaughtJeffrey' },
        { link: 'https://imgur.com/eTGaGLM.png', name: 'LapCatJeffrey' },
        { link: 'https://imgur.com/7YdKWjS.png', name: 'GateKeeperJeffrey' }
    ]
}

//Object containing the Names and Descriptions of all the legendary gachas
const LegendaryInfo: { [key: string]: { Name: string; Description: string } } = {
    RadiantJeffrey: {
        Name: 'Radiant Jeffrey',
        Description: 'Our Lord and Savior Jeffrey'
    },
    CannibalJeffrey: {
        Name: 'Cannibal Jeffrey',
        Description: 'OK FINE ILL FEED YOU NOW!'
    },
    DeadJeffrey: {
        Name: 'Dead Jeffrey',
        Description: 'RIP. Fly high king'
    },
    BoxJeffrey: {
        Name: 'Box Jeffrey',
        Description: 'Wow, soooo original Jeffrey. Never seen a cat do THAT before.'
    },
    DisturbedJeffrey: {
        Name: 'Disturbed Jeffrey',
        Description: 'I don\'t think he\'s a fan...'
    },
    CuddleJeffrey: {
        Name: 'Cuddle Jeffrey',
        Description: 'Wittle Cutie!'
    },
    ThatsNotJeffrey: {
        Name: 'Not Jeffrey',
        Description: 'Hey, that\'s not Jeffrey!'
    },
    AtPeaceJeffrey: {
        Name: 'Peaceful Jeffrey',
        Description: 'That\'s about as peacful as its gonna get...'
    },
    AttackJeffrey: {
        Name: 'Attack Jeffrey',
        Description: 'That bite\'s lethal!'
    },
    CaughtJeffrey: {
        Name: 'Caught Jeffrey',
        Description: 'Hey, what going on over here!'
    },
    LapCatJeffrey: {
        Name: 'Lap-Cat Jeffrey',
        Description: 'He\'s been know to peruse a lap or two.'
    },
    GatekeeperJeffrey: {
        Name: 'Gatekeeper Jeffrey',
        Description: 'Come on Jeffrey, that\'s not very nice!'
    }
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
 *
 * @param gacha - takes a legendary gacha image URL 
 * @returns - gachaInfo, contains legendary info (Name and Description)
 */
export async function displayLegendary(gacha: string): Promise<string[] | null> { 
    for(let i = 0; i < 12; i++){
        if(JeffreyGachaURLs.Legendary[i].link === gacha){
            const legendary = JeffreyGachaURLs.Legendary[i].name;
            const legendaryName = LegendaryInfo[legendary].Name;
            const legendaryDescription = LegendaryInfo[legendary].Description;
            const gachaInfo = [
                `${legendaryName}`,
                `${legendaryDescription}`
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

