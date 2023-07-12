import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check is post
    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method not allowed'});
        return;
    }

    const prisma = new PrismaClient();
    let {username, songName, score} = req.query;
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
