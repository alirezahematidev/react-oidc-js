import {
  User,
  UserManager,
  UserManagerSettings as OCUserManagerSettings,
} from "./userManager";
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
import { handleSetUserData, useStoreUserData } from "./helpers";
import { UserResponse } from "./types";
import { Logger } from "./utils/Log";
import { createAxiosMiddle } from "./axiosMiddle";

interface UserManagerSettings extends OCUserManagerSettings {
  onRefresh?: (user: User) => Promise<UserResponse>;
}

export const createUserManagerContext = ({
  onRefresh,
  ...userManagerSettings
}: UserManagerSettings) => {
  let refreshing: Promise<User | null> | null = null;

  const userManager = new UserManager(userManagerSettings);

  let _handleAccessTokenExpired: () => Promise<User | null> = async () => null;
  const handleAccessTokenExpired = () => _handleAccessTokenExpired();

  const removeUser: () => Promise<void> = async () => {
    await userManager.removeUser();
    Logger.info("User removed");
  };

  const Provider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const isMounted = useRef(false);

    useEffect(() => {
      isMounted.current = true;

      return () => {
        isMounted.current = false;
      };
    }, []);

    _handleAccessTokenExpired = async () => {
      Logger.info("Access token expired", new Date());

      if (refreshing || !onRefresh) {
        return refreshing;
      }

      refreshing = new Promise<User | null>(async (resolve, reject) => {
        try {
          const user = await userManager.getUser();
          Logger.info("Access token expired", user?.expires_in);

          if (!user?.refresh_token) {
            throw new Error("");
          }

          const res = await onRefresh(user);

          const newUser = await handleSetUserData(res, userManager);

          resolve(newUser || null);

          Logger.info("Access token refreshed");
        } catch (err) {
          Logger.error((err as any)?.message);

          await removeUser();
          reject(err);
        }

        refreshing = null;
      });

      return refreshing;
    };

    useEffect(() => {
      userManager.events.addAccessTokenExpiring(handleAccessTokenExpired);
      userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
      userManager.events.addUserLoaded((user: User) => {
        setUserData(user);
      });
      userManager.events.addUserUnloaded(() => {
        if (isMounted.current) {
          setUserData(null);
        }
      });

      userManager
        .getUser()
        .then((user) => {
          setIsLoaded(true);
        })
        .catch((reason) => {
          Logger.error(reason);
          setUserData(null);
          setIsLoaded(true);
        });
      return () => {
        userManager.events.removeAccessTokenExpiring(handleAccessTokenExpired);
        userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
      };
    }, []);

    const value = useMemo(
      () => ({
        userManager,
        userData,
        isLoaded,
        removeUser,
      }),
      [userData, isLoaded, removeUser]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const getUserWaitRefresh = async () => {
    if (refreshing) {
      Logger.info("Waiting for refresh");
      await refreshing;
    }

    return userManager.getUser();
  };

  const getUser = async () => {
    return userManager.getUser();
  };

  const axiosMiddle = createAxiosMiddle({
    getUser,
    getUserWaitRefresh,
    handleAccessTokenExpired,
    removeUser,
  });

  return {
    Provider,
    getUser,
    getUserWaitRefresh,
    removeUser,
    handleAccessTokenExpired,
    axiosMiddle,
  };
};

export const useAuth = () => {
  const { userData, removeUser, isLoaded } = useContext(Context);
  const setUser = useStoreUserData();

  return {
    userData,
    removeUser,
    setUser,
    isLoaded,
  };
};

export type { User, UserManager };
