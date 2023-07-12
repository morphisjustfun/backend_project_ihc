import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

const usersToCreate = [
    'SunsetDreamer',
    'Lender',
    'Nutax',
    'Lordmarcusvane',
    'Koala',
    'Neko',
    'WhisperingWind',
    'MidnightRider',
    'SilverPhoenix',
    'ElectricJolt',
    'MoonlitShadow',
    'CrimsonRose',
    'AzureSkies',
    'EnigmaSoul',
    'RadiantSunflower',
    'MysticSphinx',
    'ScarletNova',
    'EchoingWhisper',
    'SapphireStardust',
    'GoldenFalcon',
    'CrazyCatLady',
    'LuckyClover',
    'EmeraldEyes',
    'NeonNinja',
    'MellowMelody',
    'WhimsicalWizard',
    'RubyRed',
    'SilentStorm',
    'JadeJourney',
    'SerenitySeeker',
    'AmberArrow',
    'HarmonyHarmonica',
    'VelvetVixen',
    'ShadowSorcerer',
    'CrimsonTide',
    'MysticalMist',
    'AzureAura',
    'WhisperingWillow',
    'SapphireSongbird',
    'GoldenGaze',
    'EnchantedElixir',
    'SilverSpellcaster',
    'MoonlightMuse',
    'NebulaNinja',
    'StellarScribe',
    'CelestialChaos',
    'EtherealEcho',
    'AmethystArcher',
    'CobaltCraze',
    'LunarLyric',
    'RadiantRaven',
    'ScarletSiren',
    'MajesticMoonbeam',
    'ElectricEnigma',
    'EnchantedEmber',
    'CrystalCrown',
    'WhimsyWhisperer',
    'StarlightSeeker',
    'SereneSprite',
    'HarmoniousHarp',
    'VelvetVortex',
    'MysticMirage',
    'RubyRhapsody',
    'SilentShade',
    'JadedJester',
    'SerenadingSylph',
    'AmberAlchemy',
    'HarmonizingHaze',
    'EmeraldEnchantress',
    'NeonNimbus',
    'MelodicMystic',
    'WhisperedWonder',
    'SapphireShimmer',
    'GoldenGuardian',
    'CrazyCatnip',
    'LuckyLeprechaun',
    'EnigmaticEmpress',
    'MidnightMystic',
    'SilverShadow',
    'ElectricEclipse',
    'MoonlitMaestro',
    'CrimsonCrescendo',
    'AzureAstral',
    'RadiantRose',
    'MysticalMuse',
    'ScarletSpell',
    'EchoingEclipse',
    'SapphireSpirit',
    'GoldenGlitter',
    'CrazyChaos',
    'LuckyLuminance',
    'EnchantedEssence',
    'MidnightMyst',
    'SilverSorceress',
    'ElectricEquinox',
    'MoonlitMelody',
    'CrimsonCharm',
    'AzureAlchemy',
    'RadiantRhythm',
    'MysticalMermaid',
    'ScarletShadow',
    'EchoingEthereal',
    'SapphireStarlet',
    'GoldenGoddess',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check is post
    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method not allowed'});
        return;
    }

    const prisma = new PrismaClient();
    // username is a hash
    let {username, songName, score} = req.query;

    const usernameHashExistsInCreatedUsers = await prisma.createdUsers.findFirst({
        where: {
            hash: username!
        }
    });

    if (!usernameHashExistsInCreatedUsers) {
        // identify if username exists in table createdUsers and if not create a new user in createdUsers with that hash.
        // username not picked is one which is not in createdUsers table
        const allUserNamesAlreadyPicked = await prisma.createdUsers.findMany({
            select: {
                username: true
            }
        });

        const usernameNotPicked = usersToCreate.find((username) => {
            return !allUserNamesAlreadyPicked.find((user) => user.username === username);
        });

        // suposse usernameNotPicked is never null, so we can use it directly
        // now insert the username in createdUsers table
        await prisma.createdUsers.create({
            data: {
                username: usernameNotPicked,
                hash: username!
            }
        });
    }

    score = parseFloat(score);
    try {
        await prisma.data.create({
            data: {
                username,
                songName,
                score
            }
        });
        res.status(200).json({'message': 'success'});
    } catch (e) {
        res.status(500).json({error: e.toString()});
    }
}
