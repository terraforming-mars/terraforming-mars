import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {ICard} from '../../../src/server/cards/ICard';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {HydrogenToVenus} from '../../../src/server/cards/venusNext/HydrogenToVenus';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('HydrogenToVenus', function() {
  let card: HydrogenToVenus;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new HydrogenToVenus();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play with multiple venus cards', function() {
    const card2 = new DeuteriumExport();
    const card3 = new ColonizerTrainingCamp();
    const card4 = new Dirigibles();
    player.playedCards.push(card2, card3, card4);

    const action = cast(card.play(player), SelectCard<ICard>);
    action.cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with single venus card', function() {
    const card = new HydrogenToVenus();
    const card2 = new DeuteriumExport();
    const card3 = new ColonizerTrainingCamp();
    player.playedCards.push(card2, card3);

    expect(card.play(player)).is.undefined;
    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with no venus cards', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
