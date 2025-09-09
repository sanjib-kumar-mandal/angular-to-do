import { createReducer, on } from '@ngrx/store';
import { Theme } from './theme.interface';
import { setTheme } from './theme.action';

const initialState: Theme = { name: 'light' };
export const themeReducer = createReducer(
  initialState,
  on(setTheme, (state, data) => ({ ...state, ...data }))
);
