import {expect} from 'chai';
import {CutThroatBudgeting} from '../../../src/server/cards/underworld/CutThroatBudgeting';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('CutThroatBudgeting', () => {
  it('Should play', () => {
    const card = new CutThroatBudgeting();
    const [game, player] = testGame(2);

    player.underworldData.corruption = 0;
    expect(card.canPlay(player)).is.false;
    player.underworldData.corruption = 1;
    expect(card.canPlay(player)).is.true;

    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    cast(card.play(player), undefined);
    runAllActions(game);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1, steel: 1, energy: 1}));
  });
});
