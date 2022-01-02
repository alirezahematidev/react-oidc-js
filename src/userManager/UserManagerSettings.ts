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
  silentRequestTimeoutInSeconds?: number;
  /** Interval in seconds to check the user's session (default: 2) */
  checkSessionIntervalInSeconds?: number;

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

  public readonly checkSessionIntervalInSeconds: number;
  public readonly query_status_response_type: string | undefined;

  public readonly accessTokenExpiringNotificationTimeInSeconds: number;

  public readonly userStore: WebStorageStateStore;

  public constructor(args: UserManagerSettings) {
    const {
      silentRequestTimeoutInSeconds,
      checkSessionIntervalInSeconds = DefaultCheckSessionIntervalInSeconds,
      accessTokenExpiringNotificationTimeInSeconds = DefaultAccessTokenExpiringNotificationTimeInSeconds,
      userStore,
    } = args;

    super(args);

    this.silentRequestTimeoutInSeconds = silentRequestTimeoutInSeconds;

    this.checkSessionIntervalInSeconds = checkSessionIntervalInSeconds;

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
