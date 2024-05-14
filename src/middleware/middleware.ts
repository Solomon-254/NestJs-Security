import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('LoggerMiddleware executed');

    // Extract data from the request
    const requestData = {
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      // Add more fields as needed
    };

    // Log the request data
    console.log('Request data:', requestData);

    // Intercept the response to log the headers
    res.on('finish', () => {
      console.log('Response headers:', res.getHeaders());
    });

    // Pass control to the next middleware or route handler
    next();
  }
}
