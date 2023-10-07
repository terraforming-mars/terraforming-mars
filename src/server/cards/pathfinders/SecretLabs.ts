import {IProjectCard} from '../IProjectCard';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {TRSource} from '../../../common/cards/TRSource';
import {digit} from '../Options';
import {MAX_OCEAN_TILES} from '../../../common/constants';

export class SecretLabs extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SECRET_LABS,
      cost: 21,
      tags: [Tag.JOVIAN, Tag.BUILDING, Tag.SPACE],
      requirements: [{tag: Tag.SCIENCE}, {tag: Tag.JOVIAN}],
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf26',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).microbes(2, {digit}).asterix().or().temperature(1).br;
          b.plants(3, {digit}).or().oxygen(1).floaters(2, {digit}).asterix().br;
        }),
        description: 'Requires 1 science tag and 1 Jovian tag. ' +
          'Place an ocean tile. Add 2 microbes to ANY card. ' +
          'OR Raise temperature 1 step. Gain 3 plants. ' +
          'OR Raise oxygen level 1 step. Add 2 floaters to ANY card.',
      },
    });
  }

  private adjustedOptions(options: CanAffordOptions, trSource: TRSource, cost?: number): CanAffordOptions {
    const newOptions = {...options};
    newOptions.tr = trSource;
    if (cost !== undefined) {
      newOptions.cost = cost;
    }
    return newOptions;
  }

  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions) {
    return (
      player.canAfford(this.adjustedOptions(canAffordOptions, {oceans: 1})) ||
      player.canAfford(this.adjustedOptions(canAffordOptions, {temperature: 1})) ||
      player.canAfford(this.adjustedOptions(canAffordOptions, {oxygen: 1}))
    );
  }

  public override bespokePlay(player: IPlayer) {
    const options = new OrOptions();

    if (player.canAfford({cost: 0, tr: {oceans: 1}})) {
      const oceanPlacementAvailable = player.game.board.getOceanSpaces().length < MAX_OCEAN_TILES;
      const optionTitle = oceanPlacementAvailable ? 'Place an ocean tile. Add 2 microbes to ANY card.': 'Add 2 microbes to ANY card.';
      options.options.push(new SelectOption(optionTitle).andThen(() => {
        if (oceanPlacementAvailable) player.game.defer(new PlaceOceanTile(player));
        player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
        return undefined;
      }));
    }
    if (player.canAfford({cost: 0, tr: {temperature: 1}})) {
      options.options.push(new SelectOption('Raise temperature 1 step. Gain 3 plants.').andThen(() => {
        player.game.increaseTemperature(player, 1);
        player.stock.add(Resource.PLANTS, 3, {log: true});
        return undefined;
      }));
    }
    if (player.canAfford({cost: 0, tr: {oxygen: 1}})) {
      options.options.push(new SelectOption('Raise oxygen level 1 step. Add 2 floaters to ANY card.').andThen(() => {
        player.game.increaseOxygenLevel(player, 1);
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));
        return undefined;
      }));
    }

    return options;
  }
}
