```js
import { ReactNode } from "react";
import { createUserManagerContext, useAuth } from "react-oidc-js";

const {
  Provider,
  handleAccessTokenExpired,
  getUser,
  removeUser,
  getUserWaitRefresh,
  axiosMiddle,
} = createUserManagerContext({
  onRefresh: async (user) => {
    const { postAuthV1PublicAuthConnectToken } = await import("../../services");
    const res = await postAuthV1PublicAuthConnectToken(
      {
        refreshToken: user?.refresh_token,
        grantType: "RefreshToken",
        clientSecret: __CLIENT_SECRET__,
        clientId: __CLIENT_ID__,
      },
      { deviceId: getDeviceId(), platform: "web" },
      {
        headers: {
          authorization: AUTHORIZATION,
        },
      }
    );

    return {
      access_token: res.accessToken || "",
      refresh_token: res.refreshToken || "",
      expires_in: res.expiresIn,
      token_type: res.tokenType || "",
    };
  },
  authority: "web.example.com",
  client_id: __CLIENT_ID__,
});

const UserManagerProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export {
  handleAccessTokenExpired,
  getUser,
  removeUser,
  getUserWaitRefresh,
  axiosMiddle,
  useAuth,
};

export default UserManagerProvider;
```

# logger

```js
import { Log } from "react-oidc-js/lib/utils/Log";
Log.logger = console;
```
