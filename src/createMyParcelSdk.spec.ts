import {EndpointBody, UserException} from '@/model';
import {GetShipment, GetShipments} from '@/endpoints';
import {FetchClient} from '@/model/client/FetchClient';
import {GetCarrier} from '@/endpoints/public/carriers/GetCarrier';
import {GetCarriers} from '@/endpoints/public/carriers/GetCarriers';
import {PACKAGE_NAME} from '@/data/packageTypes';
import {POST_NL_ID} from '@/data/carriers';
import {PostShipments} from '@/endpoints/private/shipments/PostShipments';
import {createFetchMock} from '@Test/fetch/createFetchMock';
import {createPrivateSdk} from '@/createPrivateSdk';
import {createPublicSdk} from '@/createPublicSdk';

describe('sdk', () => {
  const fetchMock = createFetchMock();

  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('can not be instantiated without endpoints', () => {
    const exception = new UserException('At least one endpoint must be passed.');
    expect(() => createPublicSdk(new FetchClient(), [])).toThrow(exception);
    expect(() => createPrivateSdk(new FetchClient(), [])).toThrow(exception);
  });

  describe('adding endpoints to public sdk', () => {
    const getCarrier = new GetCarrier();
    const getCarriers = new GetCarriers();

    const publicSdk = createPublicSdk(new FetchClient(), [getCarrier, getCarriers]);

    it('adds method for each passed endpoint', () => {
      expect(Object.keys(publicSdk)).toStrictEqual([getCarrier.name, getCarriers.name]);

      expect(publicSdk.getCarrier).toStrictEqual(expect.any(Function));
      expect(publicSdk.getCarriers).toStrictEqual(expect.any(Function));
    });
  });

  describe('adding endpoints to private sdk', () => {
    const getShipment = new GetShipment();
    const getShipments = new GetShipments();
    const postShipments = new PostShipments();
    const privateSdk = createPrivateSdk(new FetchClient(), [getShipment, getShipments, postShipments]);

    it('adds method for each passed endpoint', () => {
      expect(Object.keys(privateSdk)).toStrictEqual([getShipment.name, getShipments.name, postShipments.name]);

      expect(privateSdk.getShipment).toStrictEqual(expect.any(Function));
      expect(privateSdk.getShipments).toStrictEqual(expect.any(Function));
      expect(privateSdk.postShipments).toStrictEqual(expect.any(Function));
    });

    const body: EndpointBody<PostShipments> = [
      {
        carrier: POST_NL_ID,
        options: {
          package_type: PACKAGE_NAME,
        },
        recipient: {
          cc: 'NL',
          city: 'Hoofddorp',
          person: 'Ms. Parcel',
          street: 'Antareslaan 31',
        },
      },
    ];

    it('throws an error if authorization header is missing', async () => {
      expect.assertions(1);
      await expect(privateSdk.postShipments({body})).rejects.toThrow(
        new Error('Required headers are missing: Authorization'),
      );
    });

    it('executes the request if the authorization header is present', async () => {
      expect.assertions(1);
      await expect(
        privateSdk.postShipments({body, headers: {Authorization: 'base64 encoded api key'}}),
      ).resolves.toStrictEqual([1234567]);
    });
  });
});
