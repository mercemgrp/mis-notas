

export  class UtilsService {

  constructor() { }

  public static copyDeep(oldCopy: any): any {
    if (!oldCopy) {
      return null;
    }
    const newCopy = JSON.parse(JSON.stringify(oldCopy));
    return newCopy;
  }

  public static convertToDataURLviaCanvas(url, outputFormat){
    return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
      canvas = null;
    };
    img.src = url;
  });
}
}
