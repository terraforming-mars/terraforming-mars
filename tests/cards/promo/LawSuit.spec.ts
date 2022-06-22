import {expect} from 'chai';
import {LawSuit} from '../../../src/cards/promo/LawSuit';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LawSuit', () => {
  let card : LawSuit; let player : Player; let player2 : Player;

  beforeEach(() => {
    card = new LawSuit();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot play if no resources or production reduced this turn', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if resource loss is zero', () => {
    player.megaCredits = 0;
    player.addResource(Resources.MEGACREDITS, -1, {log: true, from: player2});
    expect(card.canPlay(player)).is.false;
  });

  it('Can play if resources removed this turn by other player', () => {
    player.megaCredits = 1;
    player.addResource(Resources.MEGACREDITS, -1, {log: true, from: player2});
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play if resources removed by self', () => {
    player.megaCredits = 1;
    player.addResource(Resources.MEGACREDITS, -1, {log: true, from: player});
    expect(card.canPlay(player)).is.false;
  });

  it('Can play if production decreased this turn by other player', () => {
    player.addProduction(Resources.MEGACREDITS, -1, {log: true, from: player2});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.addResource(Resources.MEGACREDITS, -1, {log: true, from: player2});
    player.addProduction(Resources.MEGACREDITS, -1, {log: true, from: player2});

    const play = card.play(player);
    expect(play).instanceOf(SelectPlayer);
  });

  it('Steals resources correctly', () => {
    // This part sets up player2 as a thief whom you will sue.
    player.removingPlayers.push(player2.id);
    // This thief now has has 2MC
    player2.megaCredits = 2;
    player.megaCredits = 0;
    const play = card.play(player);
    expect(play).instanceOf(SelectPlayer);
    (play as SelectPlayer).cb(player2);
    expect(player.megaCredits).eq(2);
    expect(player2.megaCredits).eq(0);
  });
});
