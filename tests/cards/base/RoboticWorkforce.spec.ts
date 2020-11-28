import {expect} from 'chai';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {NoctisFarming} from '../../../src/cards/base/NoctisFarming';
import {FoodFactory} from '../../../src/cards/base/FoodFactory';
import {Resources} from '../../../src/Resources';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Capital} from '../../../src/cards/base/Capital';
import {CommercialDistrictAres} from '../../../src/cards/ares/CommercialDistrictAres';
import {CapitalAres} from '../../../src/cards/ares/CapitalAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';

describe('RoboticWorkforce', function() {
  let card : RoboticWorkforce; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RoboticWorkforce();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player, ARES_OPTIONS_NO_HAZARDS);
    // game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play if no building cards to copy', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should throw', function() {
    player.playedCards.push(new FoodFactory(), new BiomassCombustors(), card);
    expect(card.canPlay(player, game)).is.not.true;
    const action = card.play(player, game);
    expect(action).is.undefined;
  });

  it('Should play', function() {
    player.playedCards.push(new NoctisFarming());
    const action = card.play(player, game);
    expect(action).is.not.undefined;
        action!.cb([new NoctisFarming()]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Should work with capital', function() {
    player.playedCards.push(new Capital());
    player.addProduction(Resources.ENERGY, 2);
    const action = card.play(player, game);
    expect(action).is.not.undefined;
        action!.cb([new Capital()]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with CommercialDistrict (ares expansion)', function() {
    player.playedCards.push(new CommercialDistrictAres());
    player.addProduction(Resources.ENERGY, 2);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(game.getCitiesInPlayOnMars()).to.eq(1);
    const action = card.play(player, game);
    expect(action).is.not.undefined;
        action!.cb([new CommercialDistrictAres()]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });

  it('Should work with Capital (ares expansion)', function() {
    player.playedCards.push(new CapitalAres());
    player.addProduction(Resources.ENERGY, 2);
    const action = card.play(player, game);
    expect(action).is.not.undefined;
        action!.cb([new CapitalAres()]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

 it('Should play with corporation cards', function() {
    const corporationCard = new UtopiaInvest();
    player.corporationCard = corporationCard;

    const action = card.play(player, game);
    expect(action).is.not.undefined;

    expect(player.getProduction(Resources.STEEL)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
        action!.cb([corporationCard as any]);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
