import {
  User,
  UserManager,
  UserManagerSettings as OCUserManagerSettings,
} from "oidc-client-ts";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Context } from "./context";
import { useStoreUserData } from "./helpers";
import { UserResponse } from "./types";

interface UserManagerSettings extends OCUserManagerSettings {
  onRefresh?: (user: User) => Promise<UserResponse>;
}

export const createUserManagerContext = (
  userManagerSettings: UserManagerSettings
) => {
  let refreshing: Promise<User> | null = null;

  const userManager = new UserManager(userManagerSettings);
  let _handleAccessTokenExpired: () => Promise<User | null>;

  const handleAccessTokenExpired = () => _handleAccessTokenExpired();

  const Provider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const isLoaded = useRef(false);

    const removeUser = useCallback(async () => {
      await userManager.removeUser();
      setUserData(null);
    }, []);

    const storeUserDatas = useStoreUserData();
    _handleAccessTokenExpired = async () => {
      if (refreshing || !userManagerSettings.onRefresh) {
        return Promise.resolve(refreshing);
      }
      refreshing = new Promise<any>(async (resolve, reject) => {
        try {
          const user = await userManager.getUser();

          if (!user?.refresh_token) {
            await removeUser();
            throw new Error("");
          }

          const res = await userManagerSettings.onRefresh!(user);

          await storeUserDatas(res);
          refreshing = null;

          resolve(res);
        } catch (err) {
          console.error("handleAccessTokenExpired", err);

          removeUser();
          refreshing = null;
          reject(err);
        }
      });

      return refreshing;
    };

    useEffect(() => {
      userManager
        .getUser()
        .then((user) => {
          isLoaded.current = true;
          setUserData(user);
        })
        .catch(() => {
          isLoaded.current = true;
          setUserData(null);
        });
    }, [userManager]);

    useEffect(() => {
      userManager.events.addAccessTokenExpired(handleAccessTokenExpired);

      return () => {
        userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
      };
    }, []);

    const value = useMemo(
      () => ({
        userManager,
        userData,
        isLoaded: isLoaded.current,
        setUserData,
        removeUser,
      }),
      [userManager, userData, setUserData, removeUser]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Provider,
    userManager,
    handleAccessTokenExpired,
  };
};

export const useAuth = () => {
  const { userManager, userData, removeUser } = useContext(Context);
  const setUser = useStoreUserData();

  return {
    userManager,
    userData,
    removeUser,
    setUser,
  };
};
