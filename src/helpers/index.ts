import jwtDecode from "jwt-decode";
import { User, UserProfile } from "oidc-client-ts";
import { useContext } from "react";
import { Context } from "../context";
import { UserResponse } from "../types";

export const useStoreUserData = () => {
  const { setUserData, userManager } = useContext(Context);
  return async (userData: UserResponse) => {
    if (!userData.access_token) return;
    try {
      const decodedAccessToken: any = jwtDecode(userData.access_token);
    } catch (error) {
      console.log("error", error);
    }
    const decodedAccessToken: any = jwtDecode(userData.access_token);

    const profile: UserProfile = {
      ...decodedAccessToken,
    };

    const userConfig = new User({
      session_state: "",
      state: null,
      /** @todo Check for scope */
      scope: decodedAccessToken.scope.join(" "),
      id_token: decodedAccessToken.iat.toString(),
      profile,
      ...userData,
    });

    if (!userConfig) {
      return;
    }
    console.log({ userConfig });

    userManager.storeUser(userConfig);
    setUserData(userConfig);
  };
};
