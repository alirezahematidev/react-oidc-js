// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Logger } from "../utils/Log";
import { User } from "./User";
import { UserManagerEvents } from "./UserManagerEvents";
import {
  UserManagerSettings,
  UserManagerSettingsStore,
} from "./UserManagerSettings";

/**
 * Provides a higher level API for signing a user in, signing out, managing the
 * user's claims returned from the OIDC provider, and managing an access token
 * returned from the OIDC/OAuth2 provider.
 *
 * @public
 */
export class UserManager {
  /** Returns the settings used to configure the `UserManager`. */
  public readonly settings: UserManagerSettingsStore;
  protected readonly _logger = new Logger("UserManager");

  protected readonly _events: UserManagerEvents;

  public constructor(settings: UserManagerSettings) {
    this.settings = new UserManagerSettingsStore(settings);

    this._events = new UserManagerEvents(this.settings);
  }

  /** Returns an object used to register for events raised by the `UserManager`. */
  public get events(): UserManagerEvents {
    return this._events;
  }

  /** Returns promise to load the `User` object for the currently authenticated user. */
  public async getUser(): Promise<User | null> {
    const user = await this._loadUser();
    if (user) {
      this._logger.info("getUser: user loaded");
      this._events.load(user, false);
      return user;
    }

    this._logger.info("getUser: user not found in storage");
    return null;
  }

  /** Returns promise to remove from any storage the currently authenticated user. */
  public async removeUser(): Promise<void> {
    await this.storeUser(null);
    this._logger.info("removeUser: user removed from storage");
    this._events.unload();
  }

  protected get _userStoreKey(): string {
    return `user:${this.settings.authority}:${this.settings.client_id}`;
  }

  protected async _loadUser(): Promise<User | null> {
    const storageString = await this.settings.userStore.get(this._userStoreKey);
    if (storageString) {
      this._logger.debug("_loadUser: user storageString loaded");
      return User.fromStorageString(storageString);
    }

    this._logger.debug("_loadUser: no user storageString");
    return null;
  }

  public async storeUser(user: User | null): Promise<void> {
    if (user) {
      this._logger.debug("storeUser: storing user");
      const storageString = user.toStorageString();
      await this.settings.userStore.set(this._userStoreKey, storageString);
      this._events.revokeOldAccessTokenTimers(user);
    } else {
      this._logger.debug("storeUser: removing user");
      await this.settings.userStore.remove(this._userStoreKey);
    }
  }
}
