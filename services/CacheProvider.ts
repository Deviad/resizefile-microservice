export class CacheProvider {

  public static cacheInstance = null;

  public static getCache() {
    if (this.cacheInstance === null) {
      this.cacheInstance = new Map<string, boolean>();
    }
    return this.cacheInstance;
  }

  private constructor() {

  }


}
