
import { externalApi } from './apiService';

export const amigoApi = {
  deliverData: (p: any) => externalApi.deliverData(p)
};

export const flutterwaveApi = {
  initiatePayment: (p: any) => externalApi.initiatePayment(p)
};
