import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Priority} from '../../deferredActions/DeferredAction';
import { CardResource } from '../../../common/CardResource';

export class TritonExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TRITON_EXPEDITION,
      tags: [Tag.RADIATION, Tag.JOVIAN, Tag.SPACE],
      cost: 31,
      victoryPoints: 3,

      behavior: {
      stock: {titanium: 3, steel: 1},
      addResourcesToAnyCard:{count: 3, type: CardResource.RADIATION},
      },

      metadata: {
        description: {
          text: 'Increase your steel production 1 step and heat production 1 step OR your titanium production 1 step. Add 3 radiations to ANOTHER card.',
          align: 'left'},
        cardNumber: 'N40',
        renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.steel(1).heat(1).or(Size.SMALL).titanium(1)).br;
        b.titanium(3).steel(1).br;
        b.radiations(3).asterix();
        }),
      },
    });
  }
  public override bespokePlay(player: Player) {
    const options = new OrOptions(
      new SelectOption('Increase your steel production 1 step and heat production 1 step', 'Increase', () => {
        player.production.add(Resource.STEEL, 1, {log: true});
        player.production.add(Resource.HEAT, 1, {log: true});
        return undefined;
      }),
      new SelectOption('Increase your titanium production 1 step', 'Increase', () => {
        player.production.add(Resource.TITANIUM, 1, {log: true});
        return undefined;
      }),
    );
    player.defer(options, Priority.GAIN_RESOURCE_OR_PRODUCTION);
    return undefined;
  }
}
