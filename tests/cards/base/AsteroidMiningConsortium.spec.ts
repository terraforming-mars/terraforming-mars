import {expect} from 'chai';
import {AsteroidMiningConsortium} from '../../../src/server/cards/base/AsteroidMiningConsortium';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('AsteroidMiningConsortium', () => {
  let card: AsteroidMiningConsortium;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AsteroidMiningConsortium();
    [game, player, player2] = testGame(2);
  });

  it('Cannot play if no titanium production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play if player has titanium production', () => {
    player.production.add(Resource.TITANIUM, 1);

    expect(card.canPlay(player)).is.true;
    expect(card.warnings).to.have.key('selfTarget');
  });

  it('Should play - auto select if single target', () => {
    player2.production.add(Resource.TITANIUM, 1);

    expect(card.warnings).to.not.have.key('selfTarget');
    expect(player.production.titanium).to.eq(0);
    expect(player2.production.titanium).to.eq(1);

    card.play(player); // can decrease own production
    runAllActions(game);
    const input = player.popWaitingFor();

    expect(input).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(player2.production.titanium).to.eq(0);
  });

  it('Should play - do not auto select single target is self', () => {
    player.production.add(Resource.TITANIUM, 1);
    card.play(player); // can decrease own production

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    expect(selectPlayer.players).deep.eq([player]);

    selectPlayer.cb(selectPlayer.players[0]);

    // Demonstrates correct play order: removed from self before adding to self.
    expect(player.production.titanium).to.eq(0);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);

    expect(player.production.titanium).to.eq(1);
  });

  it('Should play - multiple targets', () => {
    player.production.add(Resource.TITANIUM, 1);
    player2.production.add(Resource.TITANIUM, 1);
    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.getWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);

    runAllActions(game);

    expect(player2.production.titanium).to.eq(0);
    expect(player.production.titanium).to.eq(2);
  });

  it('Gives victory points', () => {
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
