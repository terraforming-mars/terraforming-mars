interface IContentType {
  contentType: string;
  extensions: Array<string>;
}
const CONTENT_TYPES: Array<IContentType> = [
  {
    contentType: 'image/x-icon',
    extensions: ['.ico'],
  },
  {
    contentType: 'text/css',
    extensions: ['.css'],
  },
  {
    contentType: 'text/html; charset=utf-8',
    extensions: ['.html'],
  },
  {
    contentType: 'text/javascript',
    extensions: ['.js', '.js.map'],
  },
  {
    contentType: 'font/ttf',
    extensions: ['.ttf'],
  },
  {
    contentType: 'image/jpeg',
    extensions: ['.jpg', '.jpeg'],
  },
  {
    contentType: 'image/png',
    extensions: ['.png'],
  },
];

export class ContentType {
  public static getContentType(filename: string): string | undefined {
    const uncompressedName = this.removeCompressionSuffix(filename);
    for (const entry of CONTENT_TYPES) {
      if (entry.extensions.find((extension) => uncompressedName.endsWith(extension))) {
        return entry.contentType;
      };
    }
    console.log('Content type not found for: ' + filename);
    return undefined;
  }

  private static removeCompressionSuffix(filename: string): string {
    return filename.replace(/\.(br|gz)$/, '');
  }
}
