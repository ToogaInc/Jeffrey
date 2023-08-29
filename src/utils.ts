
    export const numberEmojis: string[] = [
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

    export async function rng(min: number, max: number): Promise<number> {
        const randomDecimal = Math.random();

        const range = max - min + 1;
        const randomNumber = Math.floor(randomDecimal * range) + min;
        
        return randomNumber
    }