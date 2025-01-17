import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  CarData: a.model({
      content: a.string(),
      idnumber: a.string(),
      src: a.string().array(),
      diameter: a.string(),
      diameter2: a.string(),
      width: a.string(),
      width2: a.string(),
      tirewidth: a.string(),
      tirewidth2: a.string(),
      tireSidewall: a.string(),
      tireSidewall2: a.string(),
      offset: a.string(),
      offset2: a.string(),
      style: a.string(),
      model: a.string(),
      chassis: a.string(),
      description:a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
