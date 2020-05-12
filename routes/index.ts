import { NextFunction, Request, Response, Router } from 'express';
import * as path from 'path';

export class IndexRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public getIndex(req: Request, res: Response, next: NextFunction) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }

  init() {
    this.router.get('*', this.getIndex);
  }
}

const indexRoutes = new IndexRouter().router;

export default indexRoutes;
