import {Request, Response} from 'express';
import { SendOrderService } from '../../services/order/SendOrderService';

class SendOrderController {
    async handle(req: Request, res: Response) {
        const { order_id, name } = req.body;
        
        const sendOrder = new SendOrderService();
        
        const result = await sendOrder.execute({ 
            order_id: order_id as string, 
            name: name as string 
        });
        
        res.status(200).json(result);
    }
}

export { SendOrderController };

