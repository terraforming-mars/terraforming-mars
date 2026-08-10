import {expect} from 'chai';
import {AICentral} from '@/server/cards/base/AICentral';
import {Algae} from '@/server/cards/base/Algae';
import {Helion} from '@/server/cards/corporation/Helion';
import {MiningArea} from '@/server/cards/base/MiningArea';
import {Teractor} from '@/server/cards/corporation/Teractor';
import {hasBespokeLogic} from '@/server/tools/cardDatabase/hasBespokeLogic';

describe('hasBespokeLogic', () => {
  it('is false for a purely declarative card', () => {
    expect(hasBespokeLogic(new Algae())).is.false;
  });

  it('is false for a card whose action is declarative', () => {
    expect(hasBespokeLogic(new AICentral())).is.false;
  });

  it('is false for a corporation whose effect is a declared card discount', () => {
    expect(hasBespokeLogic(new Teractor())).is.false;
  });

  it('is true for a card that overrides bespokePlay', () => {
    expect(hasBespokeLogic(new Helion())).is.true;
  });

  it('is true for a card that inherits bespoke logic from an intermediate base class', () => {
    expect(hasBespokeLogic(new MiningArea())).is.true;
  });
});
