import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Size} from '../../../common/cards/render/Size';

export class WeatherBalloons extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WEATHER_BALLOONS,
      tags: [Tag.SCIENCE],
      cost: 11,
      resourceType: CardResource.FLOATER,

      behavior: {
        drawCard: 1,
      },

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Spend 1 floater here to gain 1 M€ per city on Mars',
            spend: {resourcesHere: 1},
            stock: {megacredits: {cities: {where: 'onmars'}}},
            // LogHelper.logRemoveResource(player, this, 1, '');
          },
          {
            title: 'Add 1 floater here',
            addResources: 1,
          }],
        },
      },

      metadata: {
        cardNumber: '033',
        description: 'Draw 1 card.',
        renderData: CardRenderer.builder((b) => {
          b.arrow(Size.SMALL).resource(CardResource.FLOATER, {size: Size.SMALL});
          b.br;
          b.resource(CardResource.FLOATER, {size: Size.SMALL}).arrow(Size.SMALL).megacredits(1, {size: Size.SMALL}).slash().city({size: Size.SMALL, all}).asterix();
          b.br;
          b.plainText('(Action: Add 1 floater here, or spend 1 floater here to gain 1 M€ per city ON MARS.)');
          b.br;
          b.cards(1, {size: Size.SMALL});
        }),
      },
    });
  }
}
