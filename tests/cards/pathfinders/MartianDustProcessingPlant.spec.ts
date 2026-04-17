import {expect} from 'chai';
import {MartianDustProcessingPlant} from '../../../src/server/cards/pathfinders/MartianDustProcessingPlant';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {IGame} from '../../../src/server/IGame';
import {runAllActions} from '../../TestingUtils';

describe('MartianDustProcessingPlant', () => {
  let card: MartianDustProcessingPlant;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianDustProcessingPlant();
    [game, player] = testGame(1, {pathfindersExpansion: true});
  });

  it('canPlay', () => {
    player.production.override({energy: 0});
    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    player.production.override({energy: 1});
    expect(player.terraformRating).eq(14);

    card.play(player);
    runAllActions(game);

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 2}));
    expect(player.terraformRating).eq(15);
  });

  it('canPlay true when Mars track advance lands on energy_production reward', () => {
    game.pathfindersData!.mars = 7;
    expect(card.canPlay(player)).is.true;
  });

  it('playing the card nets zero change to energy production', () => {
    game.pathfindersData!.mars = 7;
    player.playCard(card);
    runAllActions(game);
    expect(player.production.energy).eq(0);
    expect(player.production.steel).eq(2);
  });
});
