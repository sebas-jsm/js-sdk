import {NoInfer} from '@/types/global.types';
import {RequestHeaders} from '@/types/request.types';

export interface EndpointDefinition {
  body?: NoInfer<unknown>;
  headers?: RequestHeaders;
  parameters?: NoInfer<Record<string, string | number | boolean>>;
  path?: Record<string, string | number>;
  response?: NoInfer<unknown[]>;
}

export type CreateDefinition<D extends EndpointDefinition> = D;
