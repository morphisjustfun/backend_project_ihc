import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

// model Data {
//     id        Int      @id @default(autoincrement())
//     username  String
//     songName  String
//     score     Float
//     timestamp DateTime @default(now())
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // return a json like {highscore: {}, mostRecents: []}
    // highscore is the highscore (record) of a given song
    // mostRecents is the most recent 5 records of a given song
    // check is get
    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method not allowed'});
        return;
    }

    // use form data
    const prisma = new PrismaClient();
    const {songName} = req.query;

    try {
        const highscore = await prisma.data.findFirst({
            where: {
                songName
            },
            orderBy: {
                score: 'desc'
            }
        });

        const mostRecents = await prisma.data.findMany({
            where: {
                songName
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 5
        });
        res.status(200).json({highscore, mostRecents});
    } catch (e) {
        res.status(500).json({error: e.toString()});
    }
}
