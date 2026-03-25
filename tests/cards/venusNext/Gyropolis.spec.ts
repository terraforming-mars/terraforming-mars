import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {Gyropolis} from '../../../src/server/cards/venusNext/Gyropolis';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';
import {DeepLunarMining} from '../../../src/server/cards/moon/DeepLunarMining';
import {cast, runAllActions} from '../../TestingUtils';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {Units} from '../../../src/common/Units';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {assertPlaceCity} from '../../assertions';
import {IGame} from '../../../src/server/IGame';

describe('Gyropolis', () => {
  let card: Gyropolis;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Gyropolis();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    const researchNetwork = new ResearchNetwork();
    const lunaGoveror = new LunaGovernor();

    player.playedCards.push(researchNetwork, lunaGoveror);
    player.production.add(Resource.ENERGY, 2);

    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
    runAllActions(player.game);

    assertPlaceCity(player, player.popWaitingFor());
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
  });

  it('Compatible with Moon Embassy', () => {
    player.playedCards.set(new DeepLunarMining());
    card.play(player);
    expect(player.production.megacredits).to.eq(0);

    player.playedCards.set(new EarthEmbassy());
    card.play(player);
    expect(player.production.megacredits).to.eq(2);

    player.production.override({megacredits: 0});
    player.playedCards.set(new DeepLunarMining(), new EarthEmbassy());
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });

  it('Compatible with Robotic Workforce', () => {
    const lunaGoveror = new LunaGovernor();

    player.playedCards.push(lunaGoveror, card);

    const roboticWorkforce = new RoboticWorkforce();
    expect(roboticWorkforce.canPlay(player)).is.false;
    expect(roboticWorkforce.play(player)).is.undefined;

    player.production.override(Units.of({energy: 1}));

    expect(roboticWorkforce.canPlay(player)).is.false;
    expect(roboticWorkforce.play(player)).is.undefined;

    player.production.override(Units.of({energy: 2}));
    expect(roboticWorkforce.canPlay(player)).is.true;

    cast(roboticWorkforce.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).deep.eq([card]);
    selectCard.cb([selectCard.cards[0]]);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });
});
