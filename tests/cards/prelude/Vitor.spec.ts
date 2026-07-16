import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {LavaFlows} from '../../../src/server/cards/base/LavaFlows';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {Vitor} from '../../../src/server/cards/prelude/Vitor';
import {AncientShipyards} from '../../../src/server/cards/moon/AncientShipyards';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Vitor', () => {
  let card: Vitor;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Vitor();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    expect(player.megaCredits).to.eq(0);
  });

  it('Has initial action', () => {
    const action = cast(card.initialAction(player), OrOptions);
    action.options[0].cb();
    expect(game.hasBeenFunded(game.awards[0])).is.true;
  });

  it('No initial action for solo games', () => {
    testGame(1);
    const action = player.defer(card.initialAction(player));
    cast(action, undefined);
  });

  it('Give megacredits when card played', () => {
    player.playedCards.push(card);

    // Dust Seals has victory points
    card.onCardPlayedForCorps(player, new DustSeals());
    expect(player.megaCredits).to.eq(3);

    // Lava flows has none
    card.onCardPlayedForCorps(player, new LavaFlows());
    expect(player.megaCredits).to.eq(3);

    // Ants has dynamic victory points
    card.onCardPlayedForCorps(player, new Ants());
    expect(player.megaCredits).to.eq(6);

    // This card has negative dynamic victory points
    card.onCardPlayedForCorps(player, new AncientShipyards());
    expect(player.megaCredits).to.eq(6);
  });
});
