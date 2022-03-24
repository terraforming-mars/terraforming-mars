import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Resources} from '../../common/Resources';
import {ResourceType} from '../../common/ResourceType';
import {TRSource} from '../ICard';
import {digit} from '../Options';

export class SecretLabs extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SECRET_LABS,
      cost: 21,
      tags: [Tags.JOVIAN, Tags.BUILDING, Tags.SPACE],
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE).tag(Tags.JOVIAN)),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf26',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).microbes(2).or().temperature(1).br;
          b.plants(3, {digit}).or().oxygen(1).floaters(2).br;
        }),
        description: 'Requires 1 Science tag and 1 Jovian tag. ' +
          'Place an ocean tile. Add 2 microbes on any card. ' +
          'OR Raise temperature 1 step. Gain 3 plants. ' +
          'OR Raise oxygen level 1 step. Add 2 floaters on any card.',
      },
    });
  }

  private canAfford(player: Player, tr: TRSource, megacrdits: number = this.cost): boolean {
    return player.canAfford(megacrdits, {steel: true, titanium: true, tr});
  }

  public override canPlay(player: Player) {
    return this.canAfford(player, {oceans: 1}) || this.canAfford(player, {temperature: 1}) || this.canAfford(player, {oxygen: 1});
  }

  public play(player: Player) {
    const options = new OrOptions();

    if (this.canAfford(player, {oceans: 1}, 0)) {
      options.options.push(new SelectOption('Place an ocean tile. Add 2 microbes on any card.', 'select', () => {
        player.game.defer(new PlaceOceanTile(player));
        player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 2}));
        return undefined;
      }));
    }
    if (this.canAfford(player, {temperature: 1}, 0)) {
      options.options.push(new SelectOption('Raise temperature 1 step. Gain 3 plants.', 'select', () => {
        player.game.increaseTemperature(player, 1);
        player.addResource(Resources.PLANTS, 3, {log: true});
        return undefined;
      }));
    }
    if (this.canAfford(player, {oxygen: 1}, 0)) {
      options.options.push(new SelectOption('Raise oxygen level 1 step. Add 2 floaters on any card.', 'select', () => {
        player.game.increaseOxygenLevel(player, 1);
        player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
        return undefined;
      }));
    }

    return options;
  }
}
