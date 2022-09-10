import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ExtractorBalloons} from '../../../src/server/cards/venusNext/ExtractorBalloons';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ExtractorBalloons', function() {
  let card: ExtractorBalloons;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new ExtractorBalloons();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);

    const orOptions = cast(card.action(player), OrOptions);

    orOptions!.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
