import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {Extremophiles} from '../../../src/server/cards/venusNext/Extremophiles';
import {FreyjaBiodomes} from '../../../src/server/cards/venusNext/FreyjaBiodomes';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('FreyjaBiodomes', function() {
  let card: FreyjaBiodomes;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new FreyjaBiodomes();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without energy production', function() {
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if Venus requirement not met', function() {
    player.production.add(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play - single target', function() {
    const card2 = new Extremophiles();
    player.playedCards.push(card2);

    player.production.add(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.true;

    expect(card.play(player)).is.undefined;
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
    expect(card2.resourceCount).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new Extremophiles();
    const card3 = new VenusianAnimals();
    player.production.add(Resources.ENERGY, 1);
    player.playedCards.push(card2, card3);

    const action = cast(card.play(player), SelectCard<ICard>);

    action.cb([card2]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
    expect(card2.resourceCount).to.eq(2);
  });
});
