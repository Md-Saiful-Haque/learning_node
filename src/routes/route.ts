import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller";

export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        // console.log('This is Root route');
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify({messege: "This is Root Route"}))
    }
    else if (url?.startsWith('/products')) {
        productController(req, res)
    }
    else {
        res.writeHead(404, {"content-type" : "application/json"});
        res.end(JSON.stringify({messege: "Route Not Found"}))
    }
}