import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {ProcessorFactory} from '../../../src/cards/moon/ProcessorFactory';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('ProcessorFactory', () => {
  let player: Player;
  let card: ProcessorFactory;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new ProcessorFactory();
    moonData = MoonExpansion.moonData(game);
  });


  it('can act', () => {
    player.steel = 1;
    expect(card.canAct(player)).is.true;

    player.steel = 0;
    expect(card.canAct(player)).is.false;
  });

  it('act   ', () => {
    expect(moonData.colonyRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 1;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(moonData.colonyRate).eq(2);
    expect(player.getTerraformRating()).eq(16);
  });
});



it('Should play - no targets', function() {
  const action = card.play(player) as OrOptions;
  expect(action instanceof OrOptions).is.true;

  expect(action.options).has.lengthOf(2);
  const orOptions = action.options[1] as OrOptions;

  orOptions.cb();
  expect(game.getVenusScaleLevel()).to.eq(4);
});

it('Should play - single target', function() {
  player.playedCards.push(dirigibles);

  const action = card.play(player) as OrOptions;
  expect(action instanceof OrOptions).is.true;

  const orOptions = action.options[1] as OrOptions;
  orOptions.cb();
  expect(game.getVenusScaleLevel()).to.eq(4);
  expect(dirigibles.resourceCount).to.eq(2);
});

it('Should play - multiple targets', function() {
  player.playedCards.push(dirigibles, floatingHabs);

  const orOptions = card.play(player) as OrOptions;

  // First the global parameter
  orOptions.options[0].cb();
  expect(game.getTemperature()).to.eq(-26);
  orOptions.options[1].cb();
  expect(game.getVenusScaleLevel()).to.eq(4);

  // Then the floaters
  const selectCard = orOptions.cb() as SelectCard<ICard>;
  selectCard.cb([dirigibles]);
  expect(dirigibles.resourceCount).to.eq(2);
  selectCard.cb([floatingHabs]);
  expect(floatingHabs.resourceCount).to.eq(2);
});