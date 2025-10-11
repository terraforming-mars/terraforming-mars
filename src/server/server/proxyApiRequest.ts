import * as http from "http";
import * as https from "https";
import { URL as NodeURL } from "url";
import { Request } from "../Request";
import { Response } from "../Response";
import * as responses from "./responses";

export function proxyApiRequest(_req: Request, _res: Response): void {
  const req = _req as http.IncomingMessage;
  const res = _res as http.ServerResponse;
  const host = "https://terraforming-mars.herokuapp.com/";
  const targetUrl = new NodeURL(req.url ?? "/", host);
  const client = targetUrl.protocol === "http:" ? http : https;
  const headers = { ...req.headers, host: targetUrl.host };
  const proxyRequest = client.request(
    targetUrl,
    {
      method: req.method,
      headers: headers,
    },
    (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode ?? 502, proxyResponse.headers);
      proxyResponse.on("error", (error) => {
        if (!res.headersSent) {
          responses.internalServerError(req, res, error);
        } else {
          res.end();
        }
      });
      proxyResponse.pipe(res);
    }
  );

  proxyRequest.on("error", (error) => {
    if (!res.headersSent) {
      responses.internalServerError(req, res, error);
    } else {
      res.end();
    }
  });

  req.on("aborted", () => {
    proxyRequest.destroy();
  });

  req.pipe(proxyRequest);
}
