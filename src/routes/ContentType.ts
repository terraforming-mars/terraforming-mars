const CONTENT_TYPES: Map<string /* file extension */, string /* content type*/> = new Map([
  ['ico', 'image/x-icon'],
  ['css', 'text/css'],
  ['html', 'text/html; charset=utf-8'],
  ['js', 'text/javascript'],
  ['map', 'text/javascript'],
  ['ttf', 'font/ttf'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['png', 'image/png'],
]);

export class ContentType {
  public static getContentType(filename: string): string | undefined {
    const parts = filename.split('.');
    let idx = parts.length - 1;
    if (parts[idx] === 'br' || parts[idx] === 'gz') {
      idx--;
    }
    if (idx < 0) {
      return undefined;
    }
    const suffix = parts[idx];
    return CONTENT_TYPES.get(suffix);
  }
}
