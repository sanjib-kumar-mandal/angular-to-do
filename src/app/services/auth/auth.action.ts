import { createAction, props } from '@ngrx/store';
import { CurrentUserModel } from './auth.interface';

export const setCurrentUser = createAction(
  'CurrentUser',
  props<CurrentUserModel>()
);
