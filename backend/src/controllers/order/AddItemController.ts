import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/order/AddItemOrderService";

class AddItemController {
    async handle(req: Request, res: Response) {
        const { order_id, product_id, amount } = req.body;

        const addItemOrder = new AddItemOrderService();

        const newItem = await addItemOrder.execute({
            order_id: order_id,
            product_id: product_id,
            amount: amount,
        });

        res.status(201).json(newItem);
    }
}

export { AddItemController };