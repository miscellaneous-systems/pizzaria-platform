import cors from "cors";
import 'dotenv/config'
import express, {NextFunction, Request, Response} from "express";
import {router} from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use((error: Error, _: Request, res: Response, __: NextFunction) => {
    if (error instanceof Error) {
        return res.status(400).json({ 
            error: error.message 
        });
    }
    return res.status(500).json({ 
        error: "Internal server error" 
    });
});

const port = process.env.PORT! || 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});