const apiPath = process.env.API_PATH ?? '/api/v1';

export const routes = {
  // pages
  page: {
    base: {
      homePage: '/',
    },
  },
  // ideas
  idea: {
    findMany: [apiPath, 'idea'].join('/'),
    vote: (id?: number) => [apiPath, 'idea', id ?? ':id', 'vote'].join('/'),
  },
} as const;
