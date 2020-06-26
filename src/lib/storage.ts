export class Storage {
  static get(key: string) {
    let result;

    try {
      result = JSON.parse(localStorage.getItem(key));
    } catch {
      result = undefined;
    }

    return result;
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
