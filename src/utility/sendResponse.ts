import type { ServerResponse } from "http";

export const sendResponse = (
    res: ServerResponse, 
    statusCode: number, 
    success: boolean, 
    messege: string, 
    data?: any) => {

    const response = {
        success,
        messege,
        data
    }

    res.writeHead(statusCode, { "content-type": "application/json" });
    res.end(JSON.stringify(response))
}