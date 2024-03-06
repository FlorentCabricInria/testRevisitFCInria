import { Application } from 'express';
// eslint-disable-next-line import/no-self-import
import tutorialRoutes from './tutorial.routes';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/tutorials', tutorialRoutes);
  }
}
