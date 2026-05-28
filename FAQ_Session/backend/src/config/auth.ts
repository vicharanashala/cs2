import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins';

import mongoose from 'mongoose';

import { env } from './env';

import { Roles } from '../core/constants/roles';

import { DatabaseError } from '../core/errors';

let authInstance: any;

const createAuth = () => {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,

    baseURL: env.BETTER_AUTH_URL,

    database: mongodbAdapter(
      mongoose.connection.db!,
    ),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    user: {
      additionalFields: {
        role: {
          type: 'string',
          defaultValue: Roles.STUDENT,
          input: false,
        },
      },
    },

    plugins: [
      admin({
        defaultRole: Roles.STUDENT,
        adminRole: [Roles.ADMIN],
      }),
    ],

    trustedOrigins: [env.CORS_ORIGIN],
  });
};

export const getAuth = () => {
  if (!mongoose.connection.db) {
    throw new DatabaseError(
      'MongoDB connection is not initialized',
    );
  }

  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
};