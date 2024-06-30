export type Evaluate<type> = { [key in keyof type]: type[key] } & unknown

export type State = {
  chainId?: string
  connections?: Record<string, string>
  current?: string
  status?: string
}

export type ExactPartial<type> = {
    [key in keyof type]?: type[key] | undefined
  }

export type PartializedState = Evaluate<
  ExactPartial<Pick<State, 'chainId' | 'connections' | 'current' | 'status'>>
>

export type NetworkType = 'mainnet' | 'testnet' | 'custom-network';

export interface NetworkDetails {
  algod: string;
  genesisHash: string;
  genesisId: string;
  token: string;
  port: string;
  decimals: string;
  name: string;
  logoUrl: string;
  status?: 'active' | 'inactive';
  additionalOptions: {
    apiUrl: string;
    explorerUrl: string;
    explorerTxnSegment: string;
  };
}

export interface NetworkConfig {
  [networkId: string]: {
    [type in NetworkType]?: NetworkDetails;
  };
}
