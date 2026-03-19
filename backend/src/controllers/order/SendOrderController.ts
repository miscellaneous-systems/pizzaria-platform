import {Request, Response} from 'express';
import { SendOrderService } from '../../services/order/SendOrderService';

class SendOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, name, paymentMethod, tip } = req.body;
        
        const sendOrder = new SendOrderService();
        
        const result = await sendOrder.execute({ 
            order_id: order_id as string, 
            name: name as string,
            paymentMethod: paymentMethod ?? 'MONEY',
            tip: tip ?? 0,
        });
        
        res.status(200).json(result);
    }
}

export { SendOrderController };

