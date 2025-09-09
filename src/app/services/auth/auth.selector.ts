import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrentUserModel } from './auth.interface';

const currentUserSelector =
  createFeatureSelector<CurrentUserModel>('CurrentUser');
export const getAuth = createSelector(
  currentUserSelector,
  (state: CurrentUserModel) => state
);
