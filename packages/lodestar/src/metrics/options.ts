/**
 * @module metrics
 */

export interface IMetricsOptions {
  enabled: boolean;
  timeout: number;
  pushGateway: boolean;
  serverPort?: number;
  gatewayUrl?: string;
}

const config: IMetricsOptions = {
  enabled: false,
  timeout: 5000,
  pushGateway: false,
  serverPort: 5000,
};

export default config;
