import { BearerSecurity, createClientAsync } from "soap";

export type GoogleAdManagerClientOptions = {
  networkCode: string;
  apiVersion: string;
};

export class GoogleAdManagerClient {
  private readonly options: GoogleAdManagerClientOptions;

  constructor(options: GoogleAdManagerClientOptions) {
    this.options = options;
  }

  async getService(service: string, token: string): Promise<any> {
    const { apiVersion, networkCode } = this.options;

    const serviceUrl = `https://ads.google.com/apis/ads/publisher/${apiVersion}/${service}?wsdl`;

    const headers = {
      RequestHeader: {
        attributes: {
          "soapenv:actor": "http://schemas.xmlsoap.org/soap/actor/next",
          "soapenv:mustUnderstand": 0,
          "xsi:type": "ns1:SoapRequestHeader",
          "xmlns:ns1":
            "https://www.google.com/apis/ads/publisher/" + apiVersion,
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        },
        "ns1:networkCode": networkCode,
        "ns1:applicationName": "content-api",
      },
    };

    try {
      const client = await createClientAsync(serviceUrl);
      client.addSoapHeader(headers);
      client.setSecurity(new BearerSecurity(token));

      return client;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
