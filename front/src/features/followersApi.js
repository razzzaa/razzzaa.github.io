import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Followers"],
  endpoints: (builder) => ({
    getFollowers: builder.query({
      query: (user_id) => `/api/getFollowers?user_id=${user_id}`,
      providesTags: ["Followers"],
    }),
    addFollower: builder.mutation({
      query: ({ vocation_id, user_id }) => ({
        url: "/api/like",
        method: "POST",
        body: { vocation_id, user_id },
      }),
      invalidatesTags: ["Followers"],
    }),
    removeFollower: builder.mutation({
      query: ({ vocation_id, user_id }) => ({
        url: "/api/unlike",
        method: "POST",
        body: { vocation_id, user_id },
      }),
      invalidatesTags: ["Followers"],
    }),
  }),
});

export const {
  useGetFollowersQuery,
  useAddFollowerMutation,
  useRemoveFollowerMutation,
} = apiSlice;
