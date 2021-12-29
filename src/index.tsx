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
import { useStoreUserData } from "./helpers";
import { UserResponse } from "./types";
import { Log } from "./utils/Log";

interface UserManagerSettings extends OCUserManagerSettings {
  onRefresh?: (user: User) => Promise<UserResponse>;
  logging?: boolean;
}

export const createUserManagerContext = ({
  logging,
  onRefresh,
  ...userManagerSettings
}: UserManagerSettings) => {
  let refreshing: Promise<User> | null = null;

  Log.logger = console;
  Log.level = Log.DEBUG;

  const userManager = new UserManager(userManagerSettings);
  let _handleAccessTokenExpired: () => Promise<User | null>;

  const handleAccessTokenExpired = () => _handleAccessTokenExpired();

  const Provider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const removeUser = useCallback(async () => {
      await userManager.removeUser();
      setUserData(null);
    }, []);

    const storeUserDatas = useStoreUserData();
    _handleAccessTokenExpired = async () => {
      if (refreshing || !onRefresh) {
        return Promise.resolve(refreshing);
      }
      refreshing = new Promise<any>(async (resolve, reject) => {
        try {
          const user = await userManager.getUser();

          if (!user?.refresh_token) {
            await removeUser();
            throw new Error("");
          }

          const res = await onRefresh(user);

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
      userManager.events.addAccessTokenExpiring(handleAccessTokenExpired);
      userManager.events.addAccessTokenExpired(handleAccessTokenExpired);

      userManager
        .getUser()
        .then((user) => {
          setUserData(user);
          setIsLoaded(true);
        })
        .catch(() => {
          setUserData(null);
          setIsLoaded(true);
        });
      return () => {
        userManager.events.addAccessTokenExpiring(handleAccessTokenExpired);
        userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
      };
    }, []);

    const value = useMemo(
      () => ({
        userManager,
        userData,
        isLoaded,
        setUserData,
        removeUser,
      }),
      [userManager, userData, isLoaded, setUserData, removeUser]
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
  const { userManager, userData, removeUser, isLoaded } = useContext(Context);
  const setUser = useStoreUserData();

  return {
    userManager,
    userData,
    removeUser,
    setUser,
    isLoaded,
  };
};

export type { User, UserManager };
