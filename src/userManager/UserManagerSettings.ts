// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import {
  OidcClientSettings,
  OidcClientSettingsStore,
} from "./OidcClientSettings";
import { WebStorageStateStore } from "./WebStorageStateStore";
import { Storage } from "./Storage";

const DefaultAccessTokenExpiringNotificationTimeInSeconds = 60;
const DefaultCheckSessionIntervalInSeconds = 2;

/**
 * The settings used to configure the {@link UserManager}.
 *
 * @public
 */
export interface UserManagerSettings extends OidcClientSettings {
  /**
   * The URL for the page containing the call to signinPopupCallback to handle
   * the callback from the OIDC/OAuth2
   */
  popup_redirect_uri?: string;
  popup_post_logout_redirect_uri?: string;

  /** The target parameter to window.open for the popup signin window (default: "_blank") */
  popupWindowTarget?: string;
  /** The methods window.location method used to redirect (default: "assign") */
  redirectMethod?: "replace" | "assign";

  /** The URL for the page containing the code handling the silent renew */
  silent_redirect_uri?: string;
  /**
   * Number of seconds to wait for the silent renew to return before assuming it
   * has failed or timed out (default: 10)
   */
  silentRequestTimeoutInSeconds?: number;
  /**
   * Flag to indicate if there should be an automatic attempt to renew the
   * access token prior to its expiration (default: true)
   */
  automaticSilentRenew?: boolean;
  /** Flag to validate user.profile.sub in silent renew calls (default: true) */
  validateSubOnSilentRenew?: boolean;
  /**
   * Flag to control if id_token is included as id_token_hint in silent renew
   * calls (default: false)
   */
  includeIdTokenInSilentRenew?: boolean;

  /** Will raise events for when user has performed a signout at the OP (default: false) */
  monitorSession?: boolean;
  monitorAnonymousSession?: boolean;
  /** Interval in seconds to check the user's session (default: 2) */
  checkSessionIntervalInSeconds?: number;
  query_status_response_type?: string;
  stopCheckSessionOnError?: boolean;

  /**
   * The `token_type_hint`s to pass to the authority server by default (default:
   * ["access_token", "refresh_token"])
   *
   * Token types will be revoked in the same order as they are given here.
   */
  revokeTokenTypes?: ("access_token" | "refresh_token")[];
  /**
   * Will invoke the revocation endpoint on signout if there is an access token
   * for the user (default: false)
   */
  revokeTokensOnSignout?: boolean;
  /**
   * The number of seconds before an access token is to expire to raise the
   * accessTokenExpiring event (default: 60)
   */
  accessTokenExpiringNotificationTimeInSeconds?: number;

  /**
   * Storage object used to persist User for currently authenticated user
   * (default: window.sessionStorage, InMemoryWebStorage iff no window). E.g.
   * `userStore: new WebStorageStateStore({ store: window.localStorage })`
   */
  userStore?: WebStorageStateStore;
}

/**
 * The settings with defaults applied of the {@link UserManager}.
 *
 * @public
 * @see {@link UserManagerSettings}
 */
export class UserManagerSettingsStore extends OidcClientSettingsStore {
  public readonly silentRequestTimeoutInSeconds: number | undefined;

  public readonly monitorSession: boolean;
  public readonly monitorAnonymousSession: boolean;
  public readonly checkSessionIntervalInSeconds: number;
  public readonly query_status_response_type: string | undefined;
  public readonly stopCheckSessionOnError: boolean;

  public readonly revokeTokenTypes: ("access_token" | "refresh_token")[];
  public readonly revokeTokensOnSignout: boolean;
  public readonly accessTokenExpiringNotificationTimeInSeconds: number;

  public readonly userStore: WebStorageStateStore;

  public constructor(args: UserManagerSettings) {
    const {
      silentRequestTimeoutInSeconds,
      monitorSession = false,
      monitorAnonymousSession = false,
      checkSessionIntervalInSeconds = DefaultCheckSessionIntervalInSeconds,
      query_status_response_type,
      stopCheckSessionOnError = true,
      revokeTokenTypes = ["access_token", "refresh_token"],
      revokeTokensOnSignout = false,
      accessTokenExpiringNotificationTimeInSeconds = DefaultAccessTokenExpiringNotificationTimeInSeconds,
      userStore,
    } = args;

    super(args);

    this.silentRequestTimeoutInSeconds = silentRequestTimeoutInSeconds;

    this.monitorSession = monitorSession;
    this.monitorAnonymousSession = monitorAnonymousSession;
    this.checkSessionIntervalInSeconds = checkSessionIntervalInSeconds;
    this.stopCheckSessionOnError = stopCheckSessionOnError;
    if (query_status_response_type) {
      this.query_status_response_type = query_status_response_type;
    } else {
      this.query_status_response_type = "code";
    }

    this.revokeTokenTypes = revokeTokenTypes;
    this.revokeTokensOnSignout = revokeTokensOnSignout;
    this.accessTokenExpiringNotificationTimeInSeconds =
      accessTokenExpiringNotificationTimeInSeconds;

    if (userStore) {
      this.userStore = userStore;
    } else {
      const store = Storage;
      this.userStore = new WebStorageStateStore({ store });
    }
  }
}
