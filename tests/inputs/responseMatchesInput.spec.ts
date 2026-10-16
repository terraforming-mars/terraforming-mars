import {expect} from 'chai';
import {AndOptions} from '../../src/server/inputs/AndOptions';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {SelectAmount} from '../../src/server/inputs/SelectAmount';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {responseMatchesInput} from '../../src/server/inputs/responseMatchesInput';

describe('responseMatchesInput', () => {
  const option = new SelectOption('');
  const amount = new SelectAmount('', '', 0, 10);

  it('compares the type of a simple input', () => {
    expect(responseMatchesInput(option, {type: 'option'})).is.true;
    expect(responseMatchesInput(option, {type: 'amount', amount: 1})).is.false;
  });

  it('follows the selected option of an OrOptions', () => {
    const orOptions = new OrOptions(option, amount);
    expect(responseMatchesInput(orOptions, {type: 'or', index: 1, response: {type: 'amount', amount: 1}})).is.true;
    expect(responseMatchesInput(orOptions, {type: 'or', index: 1, response: {type: 'option'}})).is.false;
    expect(responseMatchesInput(orOptions, {type: 'or', index: 2, response: {type: 'option'}})).is.false;
    expect(responseMatchesInput(orOptions, {type: 'option'})).is.false;
  });

  it('follows nested options', () => {
    const nested = new OrOptions(option, new OrOptions(amount));
    expect(responseMatchesInput(nested, {type: 'or', index: 1, response: {type: 'or', index: 0, response: {type: 'amount', amount: 1}}})).is.true;
    expect(responseMatchesInput(nested, {type: 'or', index: 1, response: {type: 'or', index: 0, response: {type: 'option'}}})).is.false;
  });

  it('matches every option of an AndOptions', () => {
    const andOptions = new AndOptions(option, amount);
    expect(responseMatchesInput(andOptions, {type: 'and', responses: [{type: 'option'}, {type: 'amount', amount: 1}]})).is.true;
    expect(responseMatchesInput(andOptions, {type: 'and', responses: [{type: 'amount', amount: 1}, {type: 'option'}]})).is.false;
    expect(responseMatchesInput(andOptions, {type: 'and', responses: [{type: 'option'}]})).is.false;
  });

  it('tolerates malformed responses', () => {
    const orOptions = new OrOptions(option, amount);
    expect(responseMatchesInput(orOptions, {type: 'or'} as any)).is.false;
    expect(responseMatchesInput(orOptions, {type: 'or', index: 'a', response: {type: 'option'}} as any)).is.false;
    expect(responseMatchesInput(new AndOptions(option), {type: 'and', responses: 'x'} as any)).is.false;
  });
});
