import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    // /products => /products/1 => ['', 'products', '1']
    const urlParts = url?.split("/");
    // console.log(urlParts);

    const id = urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null
    // console.log("This is Actual id :", id);

    if (url === "/products" && method === "GET") {

        // const product = [
        //     {
        //         id : 1,
        //         name : "Product -1"
        //     }
        // ]
        const products = readProduct()

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ messege: "This is Products Route", data: products }))
    }
    else if (method === "GET" && id !== null) {
        const products = readProduct()
        const product = products.find((p: IProduct) => p.id === id)
        // console.log(product);

        if (!product) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ messege: "Product Not Found", data: product }))
        }

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ messege: "Product retrived successfully", data: product }))
    }
    else if (method === "POST" && url === "/products") {
        // created product by POST method
        const products = readProduct()  // [{}, {}, {}]
        const body = await parseBody(req);
        // console.log("Body",body);
        const newProduct = {
            id: Date.now(),
            ...body
        }
        // console.log(newProduct);
        products.push(newProduct) // [{}, {}, {}, {new}]
        insertProduct(products)
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ messege: "Product Created successfully", data: newProduct }))
    }
    else if (method === "PUT" && id !== null) {
        const body = await parseBody(req);
        const products = readProduct()

        const index = products.findIndex((p: IProduct) => p.id === id)
        // console.log(index);
        if (index < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ messege: "Product not found", data: null }))
        }
        // console.log(products[index])

        products[index] = { id: products[index].id, ...body };

        insertProduct(products)

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ messege: "Product updated successfully", data: products[index] }))
    }
    else if (method === "DELETE" && id !== null) {
        const products = readProduct()
        const index = products.findIndex((p: IProduct) => p.id === id)

        if (index < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ messege: "Product not found", data: null }))
        }

        products.splice(index, 1)
        insertProduct(products)
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ messege: "Product Deleted Successfully", data: null }))
    }
}