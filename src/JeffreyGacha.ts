export const JeffreyGotchaURLs = {
    Common: [
        'https://imgur.com/iSHcsOd',
        'https://imgur.com/Oyh1TiC',
        'https://imgur.com/hr1tx64',
        'https://imgur.com/xQqwrWD',
        'https://imgur.com/4mrEWuV',
        'https://imgur.com/cSprAX4',
        'https://imgur.com/DaCVzq8',
        'https://imgur.com/Z2LaGwY',
        'https://imgur.com/mx70oY2',
        'https://imgur.com/AivmZ0T',
        'https://imgur.com/6dD6wHv',
        'https://imgur.com/22niPvw',
        'https://imgur.com/sqnH5tg',
        'https://imgur.com/nXo9YbZ',
        'https://imgur.com/po28ZPo',
        'https://imgur.com/zEfh9G1',
        'https://imgur.com/MsftbNA',
        'https://imgur.com/GJFRw0N',
        'https://imgur.com/Qgi4yeQ',
        'https://imgur.com/bpVQ6xz',
        'https://imgur.com/DdhzNO2',
        'https://imgur.com/AvqpwfX',
        'https://imgur.com/RuOtxcv',
        'https://imgur.com/6WkntdW',
        'https://imgur.com/40M1KOh',
        'https://imgur.com/ZtPZZV9'

    ],
    Uncommon: [
        'https://imgur.com/txgkO4S',
        'https://imgur.com/gqbRfhW',
        'https://imgur.com/qYIxVan',
        'https://imgur.com/KBwG10J',
        'https://imgur.com/dord5jv',
        'https://imgur.com/WGDO515',
        'https://imgur.com/JujU88m',
        'https://imgur.com/6ur3hgK',
        'https://imgur.com/J1Ozvgw',
        'https://imgur.com/DQDZFjA',
        'https://imgur.com/15p7sDo',
        'https://imgur.com/ASOaLa7',
        'https://imgur.com/kSo1xYB',
        'https://imgur.com/vWkhS1P',
        'https://imgur.com/FirGg1T',
        'https://imgur.com/WVAcNOm',
        'https://imgur.com/57yMtrl',
        'https://imgur.com/j00IjET',
        'https://imgur.com/DnWGWJS',
        'https://imgur.com/OqOol5X',
        'https://imgur.com/xryAFJi',
        'https://imgur.com/WYGcMzt',
        'https://imgur.com/jhIC3Js',
        'https://imgur.com/Qh7TDY3',
        'https://imgur.com/NaKE5Y2',
        'https://imgur.com/M2wJBt9',
        'https://imgur.com/voMHJ9n',
        'https://imgur.com/z81zoZ9',
        'https://imgur.com/mQB4xHr'
    ],
    Rare: [
        'https://imgur.com/eNx2Ntg',
        'https://imgur.com/moIgaas',
        'https://imgur.com/M2wJBt9',
        'https://imgur.com/NaKE5Y2',
        'https://imgur.com/KBwG10J',
        'https://imgur.com/D1cuR7k',
        'https://imgur.com/rt6lIPt',
        'https://imgur.com/vvWZ384',
        'https://imgur.com/UFNSYrP',
        'https://imgur.com/CKfOGtA',
        'https://imgur.com/dVGsAIo',
        'https://imgur.com/JujU88m',
        'https://imgur.com/KnTrE2e',
        'https://imgur.com/yjh3yZg',
        'https://imgur.com/BbtiZwy',
        'https://imgur.com/LijfPss',
        'https://imgur.com/GnnuMI5',
        'https://imgur.com/eGPRhm5',
        'https://imgur.com/l8uOmAq'
    ],
    Legendary: [
        'https://imgur.com/miHJetv', // Radiant Jeffrey
        'https://imgur.com/tbS4faL', // Cannibal Jeffrey
        'https://imgur.com/5QfM3zQ', // Dead Jeffrey
        'https://imgur.com/xhWXOIA', // Box Jeffrey
        'https://imgur.com/okvejbp', // Disturbed Jeffrey
        'https://imgur.com/sdLYctZ', // Cuddle Jeffrey
        'https://imgur.com/CYvTDSC', // Thats not Jeffrey!?
        'https://imgur.com/jmKtrlf', // At peace Jeffrey
        'https://imgur.com/Y1i2gMP', // Attack Jeffrey
        'https://imgur.com/3aWCqqe', // Caught in the act Jeffrey
        'https://imgur.com/eTGaGLM', // Lap Cat Jeffrey
        'https://imgur.com/7YdKWjS'  // GateKeeper Jeffrey
    ]
}

const LegendaryInfo = {
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
    LapCat: {
        Name: 'Lap-Cat Jeffrey',
        Description: 'He\'s been know to peruse a lap or two.'
    },
    GatekeeperJeffrey: {
        Name: 'Gatekeeper Jeffrey',
        Description: 'Come on Jeffrey, that\'s not very nice!'
    }
}

export async function displayLegendary(gacha: string): Promise<string[] | null> {
    for (const [legendaryName, legendaryURL] of Object.entries(JeffreyGotchaURLs.Legendary)) {
        if (legendaryURL === gacha) {
            const legendaryInfo = LegendaryInfo[legendaryName as keyof typeof LegendaryInfo];
            const legendaryNameText = legendaryInfo.Name;
            const legendaryDescriptionText = legendaryInfo.Description;
            const gachaInfo = [
            `${legendaryNameText}`,
            `${legendaryDescriptionText}`
            ];
            return gachaInfo;
        }
    }
    return null;
}

