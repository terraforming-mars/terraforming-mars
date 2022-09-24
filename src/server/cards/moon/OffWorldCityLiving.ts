import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';
import {all} from '../Options';

export class OffWorldCityLiving extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.OFF_WORLD_CITY_LIVING,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.SPACE],
      cost: 35,
      victoryPoints: 'special',

      behavior: {
        moon: {habitatRate: 1},
        production: {megacredits: {cities: {where: 'offmars'}}},
      },

      metadata: {
        // Check the card for a clever icon.
        description: 'Increase your M€ production 1 step per city tile NOT ON MARS. Increase Habitat Rate 1 step.',
        cardNumber: 'M53',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().city({all, secondaryTag: Tag.SPACE}).br;
          b.moonHabitatRate().br;
          b.vpText('1 VP for every 3rd City in play.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3, true),
      },
    });
  }

  public override getVictoryPoints(player: Player) {
    const amount = player.game.getCitiesCount();
    return Math.floor(amount / 3);
  }
}
