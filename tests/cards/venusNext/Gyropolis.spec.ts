import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {Gyropolis} from '../../../src/server/cards/venusNext/Gyropolis';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';
import {DeepLunarMining} from '../../../src/server/cards/moon/DeepLunarMining';
import {cast, runAllActions} from '../../TestingUtils';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {Units} from '../../../src/common/Units';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('Gyropolis', function() {
  let card: Gyropolis;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Gyropolis();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const researchNetwork = new ResearchNetwork();
    const lunaGoveror = new LunaGovernor();

    player.playedCards.push(researchNetwork, lunaGoveror);
    player.production.add(Resources.ENERGY, 2);

    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(action.cb(action.availableSpaces[0])).is.undefined;
    expect(action.availableSpaces[0].player).to.eq(player);
    expect(action.availableSpaces[0].tile).is.not.undefined;
    expect(action.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
  });

  it('Compatible with Moon Embassy', function() {
    player.playedCards = [new DeepLunarMining()];
    card.play(player);
    expect(player.production.megacredits).to.eq(0);

    player.playedCards = [new EarthEmbassy()];
    card.play(player);
    expect(player.production.megacredits).to.eq(2);

    player.production.override({megacredits: 0});
    player.playedCards = [new DeepLunarMining(), new EarthEmbassy()];
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });

  it('Compatible with Robotic Workforce', function() {
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

    const selectCard = cast(roboticWorkforce.play(player), SelectCard);
    expect(selectCard.cards).deep.eq([card]);
    selectCard.cb([selectCard.cards[0]]);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });
});
