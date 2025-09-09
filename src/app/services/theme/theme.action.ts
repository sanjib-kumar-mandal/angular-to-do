import { createAction, props } from '@ngrx/store';
import { Theme } from './theme.interface';

export const setTheme = createAction('Theme', props<Theme>());
