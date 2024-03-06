// npm install react-router-dom localforage match-sorter sort-by // For offline + misc

import { useLocation } from 'react-router-dom';
import { Application } from 'express';
import tutorialRoutes from './tutorial.routes';

export type StudyIdParam = {
  studyId: string;
};

export function useStudyId(): string {
  const location = useLocation();

  return location.pathname.split('/')[1];
}

export function useCurrentStep(): string {
  const location = useLocation();

  return location.pathname.split('/')[2];
}
export default class Routes {
  constructor(app: Application) {
    app.use('/api/tutorials', tutorialRoutes);
  }
}
