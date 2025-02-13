import {expect} from 'chai';
import {cast, churn} from '../../TestingUtils';
import {NitriteReducingBacteria} from '../../../src/server/cards/base/NitriteReducingBacteria';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NitriteReducingBacteria', () => {
  let card: NitriteReducingBacteria;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NitriteReducingBacteria();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    player.playedCards.push(card);
    card.play(player);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(3);
  });

  it('Should act', () => {
    player.playedCards.push(card);

    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card, 3);
    const orOptions = cast(churn(card.action(player), player), OrOptions);

    expect(churn(() => orOptions.options[1].cb(), player)).is.undefined;
    expect(card.resourceCount).to.eq(5);

    expect(churn(() => orOptions.options[0].cb(), player)).is.undefined;
    expect(card.resourceCount).to.eq(2);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
