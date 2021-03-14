import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {TheWomb} from '../../../src/cards/moon/TheWomb';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {PlaceMoonColonyTile} from '../../../src/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('TheWomb', () => {
  let player: TestPlayer;
  let card: TheWomb;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new TheWomb();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    player.setProductionForTest({energy: 2});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 2;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 2;
    player.setProductionForTest({energy: 2});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.setProductionForTest({energy: 2});
    player.titanium = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);
    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonColonyTile);
  });
});

