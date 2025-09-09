import { createReducer, on } from '@ngrx/store';
import { NetworkStatus } from './network.interface';
import { setNetwork } from './network.action';

const initialState: NetworkStatus = { status: true };
export const networkReducer = createReducer(
  initialState,
  on(setNetwork, (state, data) => ({ ...state, ...data }))
);
