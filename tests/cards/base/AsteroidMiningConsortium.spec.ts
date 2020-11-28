import {expect} from 'chai';
import {AsteroidMiningConsortium} from '../../../src/cards/base/AsteroidMiningConsortium';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';

describe('AsteroidMiningConsortium', function() {
  let card : AsteroidMiningConsortium; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new AsteroidMiningConsortium();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
  });

  it('Can\'t play if no titanium production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play if player has titanium production', function() {
    player.addProduction(Resources.TITANIUM);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play - auto select if single target', function() {
    player.addProduction(Resources.TITANIUM);
    card.play(player, game); // can decrease own production
    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.TITANIUM);
    player2.addProduction(Resources.TITANIUM);
    card.play(player, game);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.TITANIUM)).to.eq(0);
  });

  it('Gives victory points', function() {
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
