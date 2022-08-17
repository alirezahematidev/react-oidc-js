import jwtDecode from "jwt-decode";
import { User, UserManager, UserProfile } from "../userManager";
import { useContext } from "react";
import { Context } from "../context";
import { UserResponse } from "../types";
import { Logger } from "../utils/Log";

export const useStoreUserData = () => {
  const { userManager } = useContext(Context);
  return async (userData: UserResponse) => {
    Logger.info("Set new user data");
    return handleSetUserData(userData, userManager);
  };
};

export const handleSetUserData = async (
  userData: UserResponse,
  userManager: UserManager
) => {
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

  await userManager.storeUser(userConfig);

  return userConfig;
};
