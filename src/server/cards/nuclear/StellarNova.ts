import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../requirements/CardRequirements';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {max} from '../Options';
import {Player} from '../../Player';


export class StellarNova extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.STELLAR_NOVA,
      cost: 18,
      tags: [Tag.RADIATION, Tag.SPACE],

      requirements: CardRequirements.builder((b) => b.oceans(7, {max})),

      behavior: {
        stock: {steel: 1, titanium: 2, energy: 1, heat: 2},
        //addResourcesToAnyCards: {count: 1, type: CardResource.RADIATION},
        global: {temperature: 1},
      },

      metadata: {
        cardNumber: 'N68',
        renderData: CardRenderer.builder((b) => {
          b.minus().oceans(1).plus().temperature(1).br;
          b.steel(1).titanium(2).energy(1).heat(2).br;
          b.radiations(1).asterix();
        }),
        description: 'Requires 7 or less oceans. Remove 1 ocean tile. Increase temperature 1 step. Gain 1 steel, 2 tianium, 1 energy and 2 heat. Add 1 radiation to all of your cards.',
      },
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.game.canRemoveOcean();
  }
  

  public override bespokePlay(player: Player) {
    player.game.defer(new RemoveOceanTile(player)), 'Remove Ocean Tile',
    player.getResourceCards(CardResource.RADIATION).length > 0; //TODO
  return undefined;
}


}
