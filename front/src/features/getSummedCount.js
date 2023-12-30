import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

export const followersCountApi = createApi({
  reducerPath: "countSum",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getSum: builder.query({
      query: () => "/api/getCount",
    }),
  }),
});

export const { useGetSumQuery } = followersCountApi;
