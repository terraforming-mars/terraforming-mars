import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {ICard} from '../../../src/server/cards/ICard';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {HydrogenToVenus} from '../../../src/server/cards/venusNext/HydrogenToVenus';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {testGame} from '../../TestGame';

describe('HydrogenToVenus', function() {
  let card: HydrogenToVenus;
  let player: TestPlayer;
  let game: Game;
  let venusCard1: IProjectCard;
  let venusCard2: IProjectCard;
  let jovianTagCard1: IProjectCard;
  let jovianTagCard2: IProjectCard;

  beforeEach(function() {
    card = new HydrogenToVenus();
    [game, player] = testGame(2);
    venusCard1 = new DeuteriumExport();
    venusCard2 = new Dirigibles();
    jovianTagCard1 = new ColonizerTrainingCamp();
    jovianTagCard2 = new JovianLanterns();
  });

  it('Should play with multiple venus cards', function() {
    player.playedCards.push(venusCard1, jovianTagCard1, venusCard2);

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    action.cb([venusCard1]);
    expect(venusCard1.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with multiple jovian tag cards', function() {
    player.playedCards.push(venusCard1, jovianTagCard1, jovianTagCard2);

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    expect(venusCard1.resourceCount).to.eq(2);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with single venus card', function() {
    player.playedCards.push(venusCard1, jovianTagCard1);

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
    expect(venusCard1.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play with no venus cards', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
