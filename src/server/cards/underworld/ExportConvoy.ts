import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer, CanAffordOptions} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {digit} from '../Options';

export class ExportConvoy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EXPORT_CONVOY,
      type: CardType.EVENT,
      cost: 6,
      tags: [Tag.SPACE],
      victoryPoints: -1,

      metadata: {
        cardNumber: 'U097',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(4, {digit}).or()
            .minus().resource(CardResource.MICROBE, {amount: 3, digit}).asterix().br
            .or().minus().resource(CardResource.ANIMAL, {amount: 2, digit}).asterix().br;
          b.megacredits(20).corruption(1);
        }),
        description: 'Pay 4 plants, or 3 microbes, or 2 animals from any of your cards. ' +
          'Gain 20 M€ and 1 corruption.',
      },
    });
  }

  public microbeCards(player: IPlayer) {
    return player.playedCards.filter((card) => card.resourceType === CardResource.MICROBE && card.resourceCount >= 3);
  }

  public animalCards(player: IPlayer) {
    return player.playedCards.filter((card) => card.name !== CardName.PETS && card.resourceType === CardResource.ANIMAL && card.resourceCount >= 2);
    // NB Animals can't be removed from Pets.
  }

  public override bespokeCanPlay(player: IPlayer, _canAffordOptions: CanAffordOptions): boolean {
    return player.stock.plants >= 4 ||
    this.microbeCards(player).length > 0 ||
    this.animalCards(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const template = '${0} spent ${1} ${2} to gain 20 M€ and 1 corruption';

    const orOptions = new OrOptions().setTitle('Select a resource to spend.');

    if (player.plants >= 4) {
      orOptions.options.push(new SelectOption('Spend 4 plants').andThen(() => {
        player.stock.deduct(Resource.PLANTS, 4);
        player.stock.add(Resource.MEGACREDITS, 20);
        UnderworldExpansion.gainCorruption(player, 1);
        player.game.log(template, (b) => b.player(player).number(4).string('plants'));
        return undefined;
      }));
    }
    const microbeCards = this.microbeCards(player);
    if (microbeCards.length > 0) {
      orOptions.options.push(new SelectOption('Spend 3 microbes').andThen(() => {
        player.game.defer(
          new RemoveResourcesFromCard(player, CardResource.MICROBE, 3, {source: 'self', log: true, blockable: false})
            .andThen((response) => {
              if (response.proceed) {
                player.stock.add(Resource.MEGACREDITS, 20);
                UnderworldExpansion.gainCorruption(player, 1);
                player.game.log(template, (b) => b.player(player).number(3).string('microbes'));
              }
            }));
        return undefined;
      }));
    }

    const animalCards = this.animalCards(player);
    if (animalCards.length > 0) {
      orOptions.options.push(new SelectOption('Spend 2 animals').andThen(() => {
        player.game.defer(
          new RemoveResourcesFromCard(player, CardResource.ANIMAL, 2, {source: 'self', log: true, blockable: false})
            .andThen((response) => {
              if (response.proceed) {
                player.stock.add(Resource.MEGACREDITS, 20);
                UnderworldExpansion.gainCorruption(player, 1);
                player.game.log(template, (b) => b.player(player).number(2).string('animals'));
              }
            }));
        return undefined;
      }));
    }

    // 0 will not happen.
    if (orOptions.options.length === 0) {
      return undefined;
    }
    if (orOptions.options.length === 1) {
      orOptions.options[0].cb();
      return undefined;
    }
    return orOptions;
  }
}
