import {expect} from 'chai';
import {ContentType} from '../../src/server/routes/ContentType';

describe('ContentType', () => {
  const tests: Array<[path: string, type: string|undefined]> = [
    ['/path/to/foo.ico', 'image/x-icon'],
    ['/path/to/foo.js', 'text/javascript'],
    ['/path/to/foo.map', 'text/javascript'],
    ['/path/to/foo.js.gz', 'text/javascript'],
    ['/path/to/foo.png.br', 'image/png'],
    ['/path/to/foo.js.zip', undefined],
    ['/path/to/foo.png.ico', 'image/x-icon'],
    ['/path/to/foo.png.ico', 'image/x-icon'],
    ['/path/to/foo.txt', undefined],

    // These aren't reasonable inputs but it shows the
    // that this has some resiliance to bad inputs.
    ['', undefined],
    ['ico', 'image/x-icon'],
  ];

  tests.forEach(([file, contentType]) => {
    it('getContentType: ' + file, () => {
      expect(ContentType.getContentType(file)).eq(contentType);
    });
  });
});
