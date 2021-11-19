

export  class StaticUtilsService {

  constructor() { }

  public static copyDeep(oldCopy: any): any {
    if (!oldCopy) {
      return null;
    }
    const newCopy = JSON.parse(JSON.stringify(oldCopy));
    return newCopy;
  }

  public static getRandomId() {
    return Math.random()
      .toString()
      .replace('.', '');
  }

}
