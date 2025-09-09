import { createReducer, on } from '@ngrx/store';
import { CurrentUserModel } from './auth.interface';
import { setCurrentUser } from './auth.action';

export const initialUser: CurrentUserModel = undefined!;
export const currentUserReducer = createReducer(
  initialUser,
  on(setCurrentUser, (_, data) => {
    if (data?.hasOwnProperty('type')) {
      const { type, ...prop } = data;
      return Object.keys(prop).length ? prop : null!;
    }
    return Object.keys(data).length ? data : null!;
  })
);
