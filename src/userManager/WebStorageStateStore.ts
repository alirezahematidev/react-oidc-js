// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Logger } from "../utils/Log";
import { StateStore } from "./StateStore";
import { AsyncStorageStatic } from "./Storage";

/** @public */
export class WebStorageStateStore implements StateStore {
  private readonly _logger = new Logger("WebStorageStateStore");

  private readonly _store: AsyncStorageStatic;
  private readonly _prefix: string;

  public constructor({
    prefix = "oidc.",
    store,
  }: {
    prefix?: string;
    store: AsyncStorageStatic;
  }) {
    this._store = store;
    this._prefix = prefix;
  }

  public async set(key: string, value: string): Promise<void> {
    this._logger.debug("set", key);

    key = this.getRealStoredKey(key);
    await this._store.setItem(key, value);
  }

  public get(key: string): Promise<string | null> {
    this._logger.debug("get", key);

    key = this.getRealStoredKey(key);
    const item = this._store.getItem(key);
    return Promise.resolve(item);
  }

  public async remove(key: string): Promise<string | null> {
    this._logger.debug("remove", key);

    key = this.getRealStoredKey(key);
    const item = await this._store.getItem(key);
    this._store.removeItem(key);
    return Promise.resolve(item);
  }

  public async getAllKeys(): Promise<string[]> {
    this._logger.debug("getAllKeys");

    const storeKeys = (await this._store.getAllKeys()) || [];
    const keys = [];
    for (let index = 0; index < storeKeys.length; index++) {
      const key = storeKeys[index];
      if (key && key.indexOf(this._prefix) === 0) {
        keys.push(key.substring(this._prefix.length));
      }
    }
    return keys;
  }

  public getRealStoredKey(key: string): string {
    return this._prefix + key;
  }
}
