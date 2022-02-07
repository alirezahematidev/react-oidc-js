import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { User } from "./userManager/User";

function createAxiosMiddle({
  getUser,
  getUserWaitRefresh,
  handleAccessTokenExpired,
  removeUser,
}: {
  getUser: () => Promise<User | null>;
  getUserWaitRefresh: () => Promise<User | null>;
  handleAccessTokenExpired: () => Promise<User | null>;
  removeUser: () => Promise<void>;
}) {
  function axiosMiddle(
    axiosInstance: AxiosInstance,
    isRefreshTokenRequest: (error: AxiosRequestConfig) => boolean
  ) {
    // Response interceptor
    axiosInstance.interceptors.response.use(
      (async (response: AxiosResponse): Promise<any> => {
        return response;
      }) as any,
      async (error: AxiosError) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (error.response) {
          if (
            error.response.status === 401 &&
            isRefreshTokenRequest(error.config)
          ) {
            removeUser();
          } else if (error.response.status === 401) {
            const user = await handleAccessTokenExpired();
            if (user?.access_token) {
              if (!error.config.headers) {
                error.config.headers = {};
              }
              delete error.config.headers.Authorization;
              error.config.headers.authorization = `bearer ${user?.access_token}`;

              return Promise.resolve(axiosInstance.request(error.config));
            }

            removeUser();
          }
        }

        return Promise.reject(error);
      }
    );

    // ًًRequest interceptor
    axiosInstance.interceptors.request.use(
      async (requestConfig) => {
        // Do something before request is sent
        /** Example on how to add authorization based on security */
        if (
          !requestConfig?.headers?.authorization &&
          !requestConfig?.headers?.Authorization
        ) {
          let user;
          if (isRefreshTokenRequest(requestConfig)) {
            user = await getUser();
          } else {
            user = await getUserWaitRefresh();
          }

          if (user?.access_token) {
            if (!requestConfig?.headers) {
              requestConfig.headers = {};
            }
            requestConfig.headers.authorization = `bearer ${user?.access_token}`;
          }
        }

        return requestConfig;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }
  return axiosMiddle;
}

export { createAxiosMiddle };
