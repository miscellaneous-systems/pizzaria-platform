import {Request, Response} from 'express';
import { FinishOrderService } from '../../services/order/FinishOrderService';

class FinishOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, paymentMethod, tip } = req.body;
        
        const finishOrder = new FinishOrderService();
        
        const result = await finishOrder.execute({ 
            order_id: order_id,
            paymentMethod: paymentMethod as string,
            tip: tip ?? 0,
        });
        
        res.status(200).json(result);
    }
}

export { FinishOrderController };

