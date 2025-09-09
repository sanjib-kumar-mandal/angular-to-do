import { createAction, props } from '@ngrx/store';
import { NetworkStatus } from './network.interface';

export const setNetwork = createAction('Network', props<NetworkStatus>());
