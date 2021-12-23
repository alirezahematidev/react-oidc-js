import { User, UserManager, UserManagerSettings as OCUserManagerSettings } from "oidc-client-ts";
import { ReactNode } from "react";
import { UserResponse } from "./types";
interface UserManagerSettings extends OCUserManagerSettings {
    onRefresh?: (user: User) => UserResponse;
}
export declare const createUserManagerContext: (userManagerSettings: UserManagerSettings) => {
    Provider: ({ children }: {
        children: ReactNode;
    }) => JSX.Element;
    userManager: UserManager;
    handleAccessTokenExpired: () => Promise<User | null>;
};
export declare const useAuth: () => {
    userManager: UserManager;
    userData: User | null;
    removeUser: () => Promise<void>;
    setUser: (userData: UserResponse) => Promise<void>;
};
export {};
//# sourceMappingURL=index.d.ts.map