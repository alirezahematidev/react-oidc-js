import jwtDecode from "jwt-decode";
import { User, UserProfile } from "../userManager";
import { useContext } from "react";
import { Context } from "../context";
import { UserResponse } from "../types";

export const useStoreUserData = () => {
  const { setUserData, userManager } = useContext(Context);
  return async (userData: UserResponse) => {
    if (!userData.access_token) return;

    const decodedAccessToken: any = jwtDecode(userData.access_token);

    const profile: UserProfile = {
      ...decodedAccessToken,
    };

    const userConfig = new User({
      session_state: "",
      /** @todo Check for scope */
      scope: decodedAccessToken.scope.join(" "),
      id_token: decodedAccessToken.iat.toString(),
      profile,
      ...userData,
    });

    if (!userConfig) {
      return;
    }

    userManager.storeUser(userConfig);
    setUserData(userConfig);

    return userConfig;
  };
};
