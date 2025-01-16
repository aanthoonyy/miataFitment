import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  CarData: a.model({
      content: a.string(),
      idnumber: a.string(),
      src: a.string(),
      diameter: a.string(),
      width: a.string(),
      tirewidth: a.string(),
      tireSidewall: a.string(),
      offset: a.string(),
      style: a.string(),
      model: a.string(),
      chassis: a.string(),
      description:a.string(),
    })
    .authorization(allow => [allow.owner()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',

  }
});
