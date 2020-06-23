export class Storage {
  static get(key: string) {
    let result;

    try {
      result = JSON.parse(localStorage.getItem(key));
    } catch { }

    return result;
  }

  static set(key, value) {
    let val;

    try {
      val = JSON.stringify(value);
    } catch { }

    localStorage.setItem(key, val);
  }
}
