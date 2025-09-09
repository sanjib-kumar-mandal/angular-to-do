import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetworkStatus } from './network.interface';

const networkSelector = createFeatureSelector<NetworkStatus>('Network');
export const getNetwork = createSelector(
  networkSelector,
  (state: NetworkStatus) => state
);
