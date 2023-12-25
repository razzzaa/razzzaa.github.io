import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const followersCountApi = createApi({
  reducerPath: "countSum",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://travelreactserver.onrender.com",
  }),
  endpoints: (builder) => ({
    getSum: builder.query({
      query: () => "/api/getCount",
    }),
  }),
});

export const { useGetSumQuery } = followersCountApi;
