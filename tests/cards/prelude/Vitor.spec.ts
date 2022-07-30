import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {LavaFlows} from '../../../src/cards/base/LavaFlows';
import {DustSeals} from '../../../src/cards/base/DustSeals';
import {Vitor} from '../../../src/cards/prelude/Vitor';
import {AncientShipyards} from '../../../src/cards/moon/AncientShipyards';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('Vitor', function() {
  let card: Vitor;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Vitor();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(0);
  });

  it('Has initial action', function() {
    const action = cast(card.initialAction(player), OrOptions);
    action.options[0].cb();
    expect(game.hasBeenFunded(game.awards[0])).is.true;
  });

  it('No initial action for solo games', function() {
    Game.newInstance('gameid', [player], player);
    const action = card.initialAction(player);
    expect(action).is.undefined;
  });

  it('Give megacredits when card played', function() {
    player.setCorporationForTest(card);

    // Dust Seals has victory points
    card.onCardPlayed(player, new DustSeals());
    expect(player.megaCredits).to.eq(3);

    // Lava flows has none
    card.onCardPlayed(player, new LavaFlows());
    expect(player.megaCredits).to.eq(3);

    // Ants has dynamic victory points
    card.onCardPlayed(player, new Ants());
    expect(player.megaCredits).to.eq(6);

    // This card has negative dynamic victory points
    card.onCardPlayed(player, new AncientShipyards());
    expect(player.megaCredits).to.eq(6);
  });
});
