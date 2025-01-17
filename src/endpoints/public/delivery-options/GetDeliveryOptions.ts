import {CarrierNameOrId, DeliveryTypeId, PackageTypeName, PlatformNameOrId} from '@/types/myparcel.types';
import {HttpMethod, RequestHeaders} from '@/types/request.types';
import {AbstractPublicEndpoint} from '@/model/endpoint/AbstractPublicEndpoint';
import {CreateDefinition} from '@/model/endpoint/AbstractEndpoint.types';
import {DeliveryOption} from '@/endpoints/public/delivery-options/DeliveryOption.types';
import {PublicGetEndpoints} from '@/endpoints/public/PublicGetEndpoints';
import {WithRequired} from '@/types/global.types';

type Parameters = {
  /* eslint-disable @typescript-eslint/naming-convention */
  carrier: CarrierNameOrId;
  cc: string;
  platform: PlatformNameOrId;
  postal_code: string;

  city?: string;
  cutoff_time?: string;
  delivery_date?: string;
  delivery_time?: string;
  deliverydays_window?: number;
  dropoff_days?: string;
  dropoff_delay?: number;
  exclude_delivery_type?: DeliveryTypeId;
  exclude_parcel_lockers?: boolean;
  include?: 'shipment_options' | string;
  latitude?: string;
  longitude?: string;
  monday_delivery?: boolean;
  number?: number;
  package_type?: PackageTypeName;
  saturday_delivery?: boolean;
  street?: string;
  /* eslint-enable @typescript-eslint/naming-convention */
};

/**
 * Either number or full street is required.
 */
export type DeliveryOptionsParameters = WithRequired<Parameters, 'number'> | WithRequired<Parameters, 'street'>;

type GetDeliveryOptionsDefinition = CreateDefinition<{
  parameters: DeliveryOptionsParameters;
  response: DeliveryOption[];
}>;

/**
 * Get available delivery options for given location. Note: This calls version 2 of the endpoint.
 */
export class GetDeliveryOptions extends AbstractPublicEndpoint<GetDeliveryOptionsDefinition> {
  public readonly method: HttpMethod = 'GET';
  public readonly name = PublicGetEndpoints.GET_DELIVERY_OPTIONS;
  public readonly path = 'delivery_options';
  public readonly property = 'deliveries';

  public getHeaders(): RequestHeaders {
    return {...super.getHeaders(), Accept: 'application/json;version=2.0'};
  }
}
