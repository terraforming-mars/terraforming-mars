import {expect} from 'chai';
import {SelectOption} from '../../src/server/inputs/SelectOption';

describe('SelectOption', function() {
  let selected = false;
  const cb = () => {
    selected = true;
    return undefined;
  };


  it('Simple', function() {
    const selectOption = new SelectOption('').andThen(cb);

    expect(selected).eq(false);
    selectOption.process({type: 'option'});
    expect(selected).eq(true);
  });
});
