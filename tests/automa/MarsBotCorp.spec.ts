import {expect} from 'chai';
import {CardName} from '../../src/common/cards/CardName';
import {IMarsBot} from '../../src/server/automa/IMarsBot';
import {MarsBotCorp} from '../../src/server/automa/MarsBotCorp';

class TestCorp extends MarsBotCorp {
  constructor() {
    super({name: CardName.CREDICOR, description: 'Gains 4 M€.'});
  }

  public override roundStart(marsBot: IMarsBot) {
    marsBot.gainMc(4);
  }
}

describe('MarsBotCorp', () => {
  it('has no tags unless its card has some', () => {
    expect(new TestCorp().tags).deep.eq([]);
  });

  it('has only the hooks its card uses', () => {
    const corp = new TestCorp();

    expect(corp.roundStart).is.not.undefined;
    expect(corp.beforeActionPhase).is.undefined;
    expect(corp.onProjectCardResolved).is.undefined;
  });
});
