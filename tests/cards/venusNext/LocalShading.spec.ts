import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';
import {cast, churn} from '../../TestingUtils';

describe('LocalShading', () => {
  let card: LocalShading;
  let player: TestPlayer;

  beforeEach(() => {
    card = new LocalShading();
    [/* game */, player] = testGame(1);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast( churn(card.action(player), player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });
});
