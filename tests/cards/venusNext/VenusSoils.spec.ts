import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {VenusSoils} from '../../../src/server/cards/venusNext/VenusSoils';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {ICard} from '../../../src/server/cards/ICard';

describe('VenusSoils', function() {
  let card: VenusSoils;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new VenusSoils();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    player.popSelectInitialCards();
  });

  it('Should play - single target', function() {
    const card2 = new Thermophiles();
    player.playedCards.push(card2);
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

    expect(card2.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new Thermophiles();
    const card3 = new VenusianInsects();
    player.playedCards.push(card2, card3);

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    action.cb([card2]);

    expect(card2.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
