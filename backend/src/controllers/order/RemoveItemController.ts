import { Request, Response } from "express";
import { RemoveItemService } from "../../services/order/RemoveItemService";

class RemoveItemController {
    async handle(req: Request, res: Response) {
        const item_id = req.query.item_id 

        const removeItem = new RemoveItemService();

        const result = await removeItem.execute({ 
            item_id: item_id as string
        });

        res.status(200).json(result);
    }
}

export { RemoveItemController };
