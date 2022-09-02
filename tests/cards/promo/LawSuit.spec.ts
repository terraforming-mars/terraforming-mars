import {expect} from 'chai';
import {LawSuit} from '../../../src/server/cards/promo/LawSuit';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('LawSuit', () => {
  let card: LawSuit;
  let player: Player;
  let player2: Player;

  beforeEach(() => {
    card = new LawSuit();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
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
    player.production.add(Resources.MEGACREDITS, -1, {log: true, from: player2});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.addResource(Resources.MEGACREDITS, -1, {log: true, from: player2});
    player.production.add(Resources.MEGACREDITS, -1, {log: true, from: player2});

    const play = card.play(player);
    expect(play).instanceOf(SelectPlayer);
  });

  it('Steals resources correctly', () => {
    // This part sets up player2 as a thief whom you will sue.
    player.removingPlayers.push(player2.id);
    // This thief now has has 2MC
    player2.megaCredits = 2;
    player.megaCredits = 0;
    const play = cast(card.play(player), SelectPlayer);
    play.cb(player2);
    expect(player.megaCredits).eq(2);
    expect(player2.megaCredits).eq(0);
  });
});
