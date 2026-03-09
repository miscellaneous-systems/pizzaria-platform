import {Request, Response} from 'express';
import { DailyCashFlowService } from '../../services/cashflow/DailyCashFlowService';

class DailyCashFlowController {
    async handle(req: Request, res: Response) {
        const date = req.query.date as string | undefined;

        const dailyCashFlow = new DailyCashFlowService();

        const result = await dailyCashFlow.execute({
            date: date
        });

        res.status(200).json(result);
    }
}

export { DailyCashFlowController };