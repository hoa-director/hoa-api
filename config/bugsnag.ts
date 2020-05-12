import bugsnag from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';

const bugsnagClient = bugsnag({
  apiKey: '05e6181845da22bbdbdee88ba4ef8641',
  appVersion: process.env.npm_package_version,
  releaseStage: process.env.BUGSNAG_STAGE || process.env.NODE_ENV,
});
bugsnagClient.use(bugsnagExpress);

export { bugsnagClient };
