import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Theme } from './theme.interface';

const getThemeFeature = createFeatureSelector<Theme>('Theme');
export const getTheme = createSelector(
  getThemeFeature,
  (state: Theme) => state
);
