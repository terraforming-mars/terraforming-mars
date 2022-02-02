import {expect} from 'chai';
import {SmallOpenPitMine} from '../../../src/cards/pathfinders/SmallOpenPitMine';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {GHGProducingBacteria} from '../../../src/cards/base/GHGProducingBacteria';

describe('SmallOpenPitMine', function() {
  let card: SmallOpenPitMine;
  let player: TestPlayer;
  let microbeCard: IProjectCard;
  let floaterCard: IProjectCard;

  beforeEach(function() {
    card = new SmallOpenPitMine();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    microbeCard = new GHGProducingBacteria();
    floaterCard = new JovianLanterns();
    player.playedCards = [microbeCard, floaterCard];
  });

  it('play - steel', function() {
    card.play(player);
    const options = player.game.deferredActions.pop()?.execute() as OrOptions;
    const twoSteel = options.options[0];

    twoSteel.cb();

    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 2}));
  });

  it('play - titanium', function() {
    card.play(player);
    const options = player.game.deferredActions.pop()?.execute() as OrOptions;
    const oneTitanium = options.options[1];

    oneTitanium.cb();

    expect(player.getProductionForTest()).deep.eq(Units.of({titanium: 1}));
  });
});
