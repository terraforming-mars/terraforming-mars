import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {ArchimedesHydroponicsStation} from '../../../src/server/cards/moon/ArchimedesHydroponicsStation';
import {TestPlayer} from '../../TestPlayer';

describe('ArchimedesHydroponicsStation', () => {
  let player: TestPlayer;
  let card: ArchimedesHydroponicsStation;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new ArchimedesHydroponicsStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.production.override({energy: 1, megacredits: -4});
    expect(player.getPlayableCards()).does.include(card);

    player.production.override({energy: 0, megacredits: -4});
    expect(player.getPlayableCards()).does.not.include(card);

    player.production.override({energy: 1, megacredits: -5});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.production.override({energy: 1, megacredits: 1, plants: 0});

    card.play(player);

    expect(player.production.energy).eq(0);
    expect(player.production.megacredits).eq(0);
    expect(player.production.plants).eq(2);
  });
});
