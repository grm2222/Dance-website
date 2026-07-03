import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'unconfigured',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  studioHost: 'dancesport-mn',
  deployment: {
    appId: 'ytsg7kmmy4jzl03x3oeictaf',
  },
});
