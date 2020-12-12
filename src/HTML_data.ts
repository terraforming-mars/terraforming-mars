import {CardName} from './CardName';

/* eslint-disable no-irregular-whitespace */
export const HTML_DATA: Map<string, string> =
  new Map([
    [CardName.SEARCH_FOR_LIFE, ` 
        <div class="content ">
            <div class="points points-big"><div class="resource science"></div>*:3</div>
            <div class="requirements requirements-max ">max 6% O2</div>
            <div class=" "><span class=" money resource ">1</span> <span class="red-arrow "></span> <span class="microbe resource "></span>*  :  <div class="resource science"></div> </div>
            <div class="description ">
                (Action: Spend 1 MC to reveal the top card of the draw deck. If that card has a Microbe tag, add a Science resource here.)
                <br><br>
                (3 VPs if you have one or more Science resources here.)
            </div>
        </div>
`],
    [CardName.SPACE_ELEVATOR, ` 
        <div class="content ">
            <div class="points points-big ">2</div>
            <span class=" steel resource "></span> <span class="red-arrow "></span> <span class="money resource ">5</span>
            <div class="description ">
                (Action: Spend 1 steel to gain 5 MC.)
            </div><br>
            <div class="production-box "><div class="titanium production "></div></div>
            <div class="description ">
                (Increase your titanium production 1 step.)
            </div>
        </div>
`],
    [CardName.NOCTIS_CITY, ` 
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix minus"></div><div class="energy production "></div>
                <div class="production-prefix plus"></div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div><br>
            <div class="description ">
                (Decrease your Energy production 1 step and increase your MC production 3 steps. Place a City ON THE RESERVED AREA, disregarding normal placement restrictions.)
            </div>
        </div>
`],
    [CardName.RESEARCH_OUTPOST, ` 
        <div class="content ">
            : <span class="money resource ">-1</span>
            <div class="description ">
                (Effect: When you play a card, you pay 1 MC less for it.)
            </div><br><br>
            <div class="tile city-tile "></div>
            <div class="description ">
                (Place a city tile NEXT TO NO OTHER TILE.)
            </div>
        </div>
`],
    [CardName.PHOBOS_SPACE_HAVEN, ` 
        <div class="content ">
            <div class="points points-big ">3</div>
            <div class="production-box "><div class="titanium production "></div></div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Increase your titanium production 1 step and place a City tile ON THE RESERVED AREA.)
            </div>
        </div>
`],
    [CardName.PREDATORS, ` 
        <div class="content ">
            <div class="points ">1/<div class="animal resource "></div></div>
            <div class="requirements">11% O2</div>
            <div class="resource animal red-outline "></div> <span class="red-arrow "></span> <div class="animal resource "></div>
            <div class="description ">
                (Action: Remove 1 Animal from any card and add it to this card.)
            </div><br>
            <div class="description ">
                (Requires 11% oxygen. 1 VP per Animal on this card.)
            </div>
        </div>
`],
    [CardName.SPACE_STATION, ` 
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
        </div>
`],
    [CardName.SECURITY_FLEET, ` 
        <div class="content ">
            <div class="points ">1/<div class="resource fighter"></div></div>
            <div class="resource titanium "></div> <span class="red-arrow "></span> <div class="resource fighter"></div>
            <div class="description ">
                (Action: Spend 1 titanium to add 1 fighter resource to this card.)
            </div>
            <div class="description ">
                (1 VP for each fighter resource on this card.)
            </div>
        </div>
`],
    [CardName.REGOLITH_EATERS, ` 
        <div class="content ">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile oxygen-tile "></div>
            <div class="description ">
                (Action: Add 1 Microbe to this card, or remove 2 Microbes from this card to raise oxygen level 1 step.)
            </div>
        </div>
`],
    [CardName.RELEASE_OF_INERT_GASES, ` 
        <div class="content ">
            <div class="tile rating "></div>  <div class="tile rating "></div>
            <div class="description ">
                (Raise your terraform rating 2 steps.)
            </div>
        </div>
`],
    [CardName.NITROGEN_RICH_ASTEROID, ` 
        <div class="content ">
            <div class="production-box production-box-size3">
      <div class="production plant" style="margin-left:37px"></div> OR <br> 3 <div class="tag-plant resource-tag"></div> : 4<div class="plant production"></div>
    </div><br>
    <div class="tile rating"></div>
    <div class="tile rating"></div>
    <div class="tile temperature-tile"></div><br>
    <div class="description">
      (Raise your terraforming rating 2 steps and temperature 1 step. Increase your Plant production 1 step, or 4 steps if you have 3 Plant tags.)
    </div>
    </div>
`],
    [CardName.ROVER_CONSTRUCTION, ` 
    <div class="content">
      <div class="points points-big">1</div>
      <div class="tile city-tile-small red-outline"></div> :
      <div class="money resource">2</div>
      <div class="description">
        (Effect: When any City tile is placed, gain 2 MC.)
      </div>
    </div>
`],
    [CardName.NATURAL_PRESERVE, ` 
    <div class="content">
      <div class="points points-big">1</div>
      <div class="requirements requirements-max">max 4% O2</div>
      <div class="production-box">
        <div class="money production">1</div>
      </div>
      <div class="tile special-tile"><div class="special-tile-symbol special-tile--natural_preserve"></div></div>*
      <div class="description">
        (Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your MC production 1 step.)
      </div>
    </div>
`],
    [CardName.NUCLEAR_POWER, ` 
    <div class="content">
      <div class="production-box production-box-size3a">
        <div class="production-prefix minus"></div><div class="money production">2</div><br>
        <div class="production-prefix plus"></div><div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
      </div>
      <div class="description">
        (Decrease your MC production 2 steps and increase your Energy production 3 steps.)
      </div>
    </div>
`],
    [CardName.SMALL_ANIMALS, ` 
      <div class="content hover-hide-res">
        <div class="points">1/2<div class="animal resource"></div>
        </div>
        <div class="requirements">6% O2</div>
        <span class="red-arrow"></span>
        <div class="animal resource"></div>
        <div class="description" style="margin-bottom:5px;">
          (Action: Add 1 Animal to this card.)
        </div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix minus"></div><div class="plant production red-outline"></div>
        </div>
        <div class="description" style="text-align:left;">
          (Requires 6% oxygen. Decrease any Plant production 1 step. 1 VP per 2 Animals on this card.)
        </div>
      </div>
`],
    [CardName.SPONSORS, ` 
      <div class="content">
        <div class="production-box">
          <div class="money production">2</div>
        </div>
        <div class="description">
          (Increase your MC production 2 steps.)
        </div>
      </div>
`],
    [CardName.SPACE_MIRRORS, ` 
        <div class="content ">
            <div class="resource money">7</div>
                          <div class="red-arrow"></div>
            <div class="production-box ">
                <div class="energy production "></div>
            </div>
            <div class="description ">
                (Action: Spend 7 MC to increase your energy production 1 step.)
            </div>
        </div>
`],
    [CardName.SOLAR_WIND_POWER, ` 
        <div class="content ">
            <div class="production-box ">
                <div class="energy production "></div>
            </div> <br>
            <div class="resource titanium"></div><div class="resource titanium"></div>
            <div class="description ">
                (Increase your energy production 1 step and gain 2 titanium.)
            </div>
        </div>
`],
    [CardName.QUANTUM_EXTRACTOR, ` 
        <div class="content ">
          <div class="requirements">4 Science</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
            <div class="production-box production-box-size1a" style="margin-top:10px">
                4 <div class="energy production"></div>
            </div>
            <div class="description ">
                (Requires 4 science tags. Increase your energy production 4 steps.)
            </div>
        </div>
`],
    [CardName.ROBOTIC_WORKFORCE, ` 
        <div class="content ">
          COPY A &nbsp; <div class="production-box"><div  class="resource-tag tag-building"></div></div>
          <div class="description">
          (Duplicate only the production box of one of your building cards.)
          </div>
        </div>
`],
    [CardName.PEROXIDE_POWER, ` 
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix minus"></div><div class="money production">1</div><br>
          <div class="production-prefix plus"></div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Decrease your MC production 1 step and increase your Energy production 2 steps.)
        </div>
      </div>
`],
    [CardName.RESEARCH, ` 
        <div class="content ">
          <div class="points points-big">1</div>
          <div class="resource card"></div> <div class="resource card"></div>
          <div class="description">
          (Counts as playing 2 science cards. Draw 2 cards.)
          </div>
        </div>
`],
    [CardName.PHYSICS_COMPLEX, ` 
        <div class="content ">
          <div class="points points-big">2/<div class="science resource"></div></div>
            6 <div class="energy resource "></div> <div class="red-arrow "></div> <div class="resource science"></div>
            <div class="description ">
                (Action: Spend 6 Energy to add a science resource to this card.)
            </div><br><br><br>
            <div class="description ">
                (2 VP for each science resource on this card.)
            </div>
        </div>
`],
    [CardName.NUCLEAR_ZONE, ` 
      <div class="content">
        <div class="points points-big">-2</div>
        <div class="tile special-tile"><div class="special-tile-symbol special-tile--nuclear-zone"></div></div><br>
          <div class="tile temperature-tile"></div> <div class="tile temperature-tile"></div>
        <div class="description">
          (Place this tile and raise temperature 2 steps.)
        </div>
      </div>
`],
    [CardName.POWER_GRID, ` 
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="energy production"></div> / <div class="resource-tag tag-power"></div>
        </div>
        <div class="description">
          (Increase your Energy production step for each Power tag you have, including this.)
        </div>
      </div>
`],
    [CardName.STEELWORKS, ` 
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="steel resource "></div><div class="resource steel"></div> <div class="tile oxygen-tile" style="margin-left:0px;"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 2 steel and increase oxygen 1 step.)
            </div>
        </div>
`],
    [CardName.ORE_PROCESSOR, ` 
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="titanium resource "></div><div class="tile oxygen-tile"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 1 titanium and increase oxygen 1 step.)
            </div>
        </div>
`],
    [CardName.OPEN_CITY, ` 
        <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">12% O2</div>
            <div class="production-box production-box-size1a">
                <div class="production-prefix minus"></div><div class="energy production "></div>
                <div class="production-prefix plus"></div><div class="money production ">4</div>
            </div>
            <div class="tile city-tile"></div>
            <div class="plant resource"></div><div class="plant resource"></div>
            <div class="description">
                Requires 12% oxygen. Gain 2 plants. Place a City tile. Decrease your Energy production 1 step and increase your MC production 4 steps.
            </div>
        </div>
`],
    [CardName.SOLAR_POWER, ` 
        <div class="content ">
          <div class="points points-big">1</div>
            <div class="production-box ">
                <div class="energy production "></div>
            </div>
            <div class="description ">
                (Increase your energy production 1 step.)
            </div>
        </div>
`],
    [CardName.SABOTAGE, ` 
      <div class="content">
        -3<div class="resource titanium red-outline"></div> OR -4<div class="resource steel red-outline"></div> OR - <div class="resource money red-outline">7</div>
        <div class="description">
          (Remove up to 3 titanium from any player, or 4 steel, or 7 MC.)
        </div>
      </div>
`],
    [CardName.SUBTERRANEAN_RESERVOIR, ` 
        <div class="content ">
            <div class="tile ocean-tile "></div>
            <div class="description ">
                (Place 1 ocean tile.)
            </div>
        </div>
`],
    [CardName.SYMBIOTIC_FUNGUS, ` 
        <div class="content ">
            <div class="requirements ">-14 C</div>
            <div class="red-arrow "></div> <div class="microbe resource "></div>*
            <div class="description ">
                (Action: Add a microbe to ANOTHER card.)
                <br><br>
                (Requires -14 C or warmer.)
            </div>
        </div>
`],
    [CardName.STRIP_MINE, ` 
        <div class="content ">
            <div class="production-box production-box-size3a ">
                <div class="production-prefix minus"></div><div class="energy production "></div><div class="energy production "></div><br>
                <div class="production-prefix plus"></div><div class="steel production "></div><div class="steel production "></div><div class="titanium production "></div>
            </div><br>
            <div class="tile oxygen-tile "></div><div class="tile oxygen-tile "></div>
            <div class="description ">
              (Decrease your Energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.)
            </div>
        </div>
`],
    [CardName.POWER_PLANT, ` 
      <div class="content">
        <div class="production-box "><div class="energy production"></div>
        </div>
        <div class="description">
          (Increase your Energy production 1 step.)
        </div>
      </div>
`],
    [CardName.NITROPHILIC_MOSS, ` 
      <div class="content">
        <div class="requirements">3 Oceans</div>
        <div class="production-box production-box-size2">
          <div class="plant production"></div><div class="plant production"></div>
        </div>
      &nbsp;&nbsp; -  <div class="plant resource"></div><div class="plant resource"></div>
        <div class="description">
          (Requires 3 ocean tiles and that you lose 2 plants. Increase your plant production 2 steps.)
        </div>
      </div>
`],
    [CardName.STANDARD_TECHNOLOGY, ` 
      <div class="content">
        <div class="card-content-requirements">
          <div class="globals-box">Standard projects</div> : <div class="money resource">3</div>
        </div>
        <div class="description">
          (Effect: After you pay for a standard project, except selling patents, you gain 3 MC.)
        </div>
      </div>
`],
    [CardName.NITRITE_REDUCING_BACTERIA, ` 
        <div class="content hover-hide-res">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR 3 <div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile rating "></div>
            <div class="description ">
              (Action: Add 1 Microbe to this card, or remove 3 Microbes to increase your TR 1 step.)
            </div><br><br>
            <div class="microbe resource "></div><div class="microbe resource "></div><div class="microbe resource "></div>
            <div class="description ">
              (Add 3 Microbes to this card.)
            </div>
        </div>
`],
    [CardName.POWER_SUPPLY_CONSORTIUM, ` 
        <div class="content">
          <div class="requirements">2 Power</div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix minus"></div><div class="energy production red-outline"></div>
              <div class="production-prefix plus"></div><div class="energy production"></div>
          </div>
          <div class="description">
            (Requires 2 Power tags. Decrease any Energy production 1 step and increase your own 1 step.)
          </div>
        </div>
`],
    [CardName.SHUTTLES, ` 
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">5% O2</div>
              <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
              <div class="description ">
                  (Effect: When you play a Space card, you pay 2 MC less for it.)
              </div>
              <div class="production-box production-box-size1a" style="margin-top:10px;margin-right:130px;">
                 <div class="production-prefix minus"></div><div class="energy production"></div>
                   <div class="production-prefix plus"></div><div class="money production">2</div>
              </div>
              <div class="description " style="position:absolute;margin-top:-90px;text-align:left;margin-left:86px;">
                (Requires 5% oxygen. Decrease your Energy production 1 step and increase your MC production 2 steps.)
              </div>
          </div>
`],
    [CardName.PETS, ` 
        <div class="content hover-hide-res">
          <div class="points">1/2<div class="animal resource"></div>
          </div>
          <div class="tile city-tile-small red-outline"></div> : <div class="animal resource"></div> <br>
          <span style="font-size:12px">ANIMALS MAY NOT BE REMOVED FROM THIS CARD</span>
          <div class="description" >
            (Effect: When any City tile is placed, add an Animal to this card.)
          </div><br>
          <div class="animal resource"></div>
          <div class="description description-half" style="text-align:left; width: 135px;" >
            (Add 1 Animal to this card. 1 VP per 2 Animals here.)
          </div>
        </div>
`],
    [CardName.PROTECTED_HABITATS, ` 
          <div class="content ">
          <span style="font-size:12px; ">OPPONENTS MAY NOT REMOVE YOUR</span><br>
          <div class="plant resource"></div> <div class="animal resource"></div> <div class="microbe resource"></div>
          </div>
`],
    [CardName.PROTECTED_VALLEY, ` 
          <div class="content ">
              <div class="production-box production-box ">
                  <div class="money production ">2</div>
              </div> <div class="tile greenery-tile" style="margin-left:30px;"></div>*
              <div class="description ">
                (Increase your MC production 2 steps. Place a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.)
              </div>
          </div>
`],
    [CardName.SATELLITES, ` 
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production money">1</div> / <div class="resource-tag tag-space"></div>
          </div>
          <div class="description">
            (Increase your MC production 1 step for each space tag you have, including this one.)
          </div>
        </div>
`],
    [CardName.NOCTIS_FARMING, ` 
        <div class="content">
          <div class="points points-big">1</div>
          <div class="requirements">-20 C</div>
          <div class="production-box">
            <div class="money production">1</div>
          </div> <div class="resource plant" style="margin-left:20px;"></div><div class="resource plant"></div>
          <div class="description">
            (Requires -20 C or warmer. Increase your MC production 1 step and gain 2 Plants.)
          </div>
        </div>
`],
    [CardName.SOIL_FACTORY, ` 
          <div class="content ">
            <div class="points points-big ">1</div>
              <div class="production-box production-box-size1a">
                <div class="production-prefix minus"></div><div class="energy production  "></div>
                  <div class="production-prefix plus"></div><div class="plant production "></div>
              </div>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your Plant production 1 step.)
              </div>
          </div>
`],
    [CardName.OLYMPUS_CONFERENCE, ` 
          <div class="content ">
            <div class="points points-big">1</div>
              <div class="resource-tag tag-science"></div> : <div class="resource science"></div> OR -<div class="resource science"></div>+<div class="card resource "></div>
              <div class="description ">
                (When you play a Science tag, including this, either add a Science resource to this card, or remove a Science resource from this card to draw a card.)
              </div>
          </div>
`],
    [CardName.RAD_SUITS, ` 
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">2 Cities</div>
            <div class="production-box"><div  class="production money">1</div></div>
            <div class="description">
              (Requires two cities in play. Increase your MC up 1 step.)
            </div>
          </div>
`],
    [CardName.PERMAFROST_EXTRACTION, ` 
          <div class="content ">
            <div class="requirements">-8 C</div>
              <div class="tile ocean-tile "></div>
              <div class="description ">
                (Requires -8 C or warmer. Place 1 ocean tile.)
              </div>
          </div>
`],
    [CardName.PLANTATION, ` 
        <div class="content">
          <div class="requirements">2 Science</div>
          <div class="tile greenery-tile"></div>
          <div class="description">
            (Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.)
          </div>
        </div>
`],
    [CardName.POWER_INFRASTRUCTURE, ` 
          <div class="content ">
              X<div class="energy resource "></div> <div class="red-arrow "></div> <div class="money resource ">X</div>
              <div class="description ">
                (Action: Spend any amount of Energy and gain that amount of MC.)
              </div>
          </div>
`],
    [CardName.RESTRICTED_AREA, ` 
          <div class="content ">
              <div class="money resource ">2</div> <div class="red-arrow "></div> <div class="card resource "></div>
              <div class="description ">
                  (Action: Spend 2 MC to draw a card.)
              </div><br>
              <div class="tile special-tile"><div class="special-tile-symbol special-tile--restricted-area"></div></div>
              <div class="description ">
                (Place this tile.)
              </div>
          </div>
`],
    [CardName.SOLETTA, ` 
          <div class="content ">
            <div class="production-box production-box-size1a">
                7 <div class="heat production"></div>
            </div>
            <div class="description">
              (Increase your heat production 7 steps.)
            </div>
          </div>
`],
    [CardName.RAD_CHEM_FACTORY, ` 
        <div class="content">
          <div class="production-box production-box-size1a">
            <div class="production-prefix minus"></div><div class="energy production"></div><br>
          </div>
          <div class="nowrap">
            <div class="tile rating"></div><div class="tile rating"></div>
          </div>
          <div class="description">
            (Decrease your Energy production 1 step. Raise your TR 2 steps.)
          </div>
        </div>
`],
    [CardName.SPECIAL_DESIGN, ` 
        <div class="content">
          <div class="card-content-requirements">
            <div class="globals-box">Global requirements</div>: +/- 2
          </div>
          <div class="description">
            (The next card you play this generation is +2 or -2 steps in global requirements, your choice.)
          </div>
        </div>
`],
    [CardName.SELF_REPLICATING_ROBOTS, ` 
          <div class="content ">
            <div class="requirements">2 Science</div>
            <div class="nowrap">
              <div class="red-arrow "></div>
              <div class="resource card"><div class="cards-count">2</div><div class="card-icon card-icon-space">&#x2734;</div><div class="card-icon card-icon-building" style="margin-left:37px">&#x2617;</div></div>
              &nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;
              <div class="red-arrow "></div>
              <div class="production" style="background:white;color:black;vertical-align:middle">X</div> x2
            </div>
            <div class="description">
              (Action: Reveal and place a SPACE OR BUILDING card here from hand, and place 2 resources on it, OR double the resources on a card here.)
              <br>
              (Effect: Card here may be played as if from hand with its cost reduced by the number of resources on it.)
              <br>
              (Requires 2 Science tags.)
            </div>
          </div>
`],
    [CardName.PENGUINS, ` 
            <div class="content ">
                <div class="points ">1/<div class="animal resource "></div></div>
                <div class="requirements ">8 Oceans</div>
                <span class="red-arrow "></span> <div class="animal resource "></div>
                <div class="description ">
                    (Action: Add 1 animal to this card.)
                </div><br><br>
                <div class="description ">
                    (Requires 8 oceans. 1 VP for each animal on this card.)
                </div>
            </div>
`],
    [CardName.NEUTRALIZER_FACTORY, ` 
            <div class="content ">
              <div class="requirements"> 10% Venus</div>
              <div class="tile venus-tile">V</div>
              <div class="description">
                (Requires Venus 10%. Increase the Venus track 1 step)
              </div>
            </div>
`],
    [CardName.OMNICOURT, ` 
            <div class="content ">
              <div class="requirements">Venus Earth Jovian</div>
              <div class="tile rating"></div>  <div class="tile rating"></div>
              <div class="description">
                (Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.)
              </div>
            </div>
`],
    [CardName.ORBITAL_REFLECTORS, ` 
            <div class="content ">
              <div class="tile venus-tile">V</div>  <div class="tile venus-tile">V</div><br>
              <div class="production-box production-box-size2">
                  <div class="heat production"></div><div class="heat production"></div>
              </div>
              <div class="description">
                (Raise Venus 2 steps. Increase your heat production 2 steps)
              </div>
            </div>
`],
    [CardName.ROTATOR_IMPACTS, ` 
            <div class="content hover-hide-res">
                <div class="requirements requirements-max">max 14% Venus</div>
                <div class=" money resource ">6</div> (<span class="resource titanium"></span>)
                <span class="red-arrow "></span><div class="asteroid resource"></div><br>
                OR <div class="asteroid resource"></div> <span class="red-arrow "></span> <div class="tile venus-tile">V</div>
                <div class="description ">
                  (Action: spend 6 MC to add an asteroid resource to this card (TITANIUM MAY BE USED), or spend 1 resource from this card to increase Venus 1 step)
                  <br>(Venus must be 14% or lower)
                </div>
            </div>
`],
    [CardName.SISTER_PLANET_SUPPORT, ` 
            <div class="content ">
              <div class="requirements">Venus Earth</div>
              <div class="production-box">
                  <div class="money production">3</div>
              </div>
              <div class="description">
                (Requires Venus and Earth tags. Increase your MC production 3 steps)
              </div>
            </div>
`],
    [CardName.SOLARNET, ` 
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements"> Venus Earth Jovian</div>
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description">
                (Requires Venus, Earth and Jovian tags. Draw 2 cards)
              </div>
            </div>
`],
    [CardName.SPIN_INDUCING_ASTEROID, ` 
            <div class="content ">
              <div class="requirements requirements-max">max 10% Venus</div>
              <div class="tile venus-tile">V</div> <div class="tile venus-tile">V</div>
                <div class="description">
                  (Venus must be 10% or lower. Raise Venus 2 steps)
                </div>
            </div>
`],
    [CardName.SPONSORED_ACADEMIES, ` 
            <div class="content ">
              <div class="points points-big">1</div>
              - <div class="resource card"></div><br>
              + <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>* + <div class="resource card red-outline"></div>*
              <div class="description">
                (Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card)
              </div>
            </div>
`],
    [CardName.STRATOPOLIS, ` 
            <div class="content hover-hide-res">
              <div class="points">1/3<div class="resource floater"></div></div>
              <div class="requirements" style="margin-bottom:15px;">2 Science</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon tag-venus"></div></div>
                <div class="resource floater"><div class="card-icon tag-venus"></div></div>
                <div class="description " style="margin-top:-5px">
                  (Action: Add 2 floaters to ANY VENUS CARD.)
                </div>
              <div class="production-box" style="margin-left:85px">
                <div class="money production">2</div>
              </div>
              &nbsp;<div class="tile city-tile"></div>*
                <div class="description " style="text-align:left;margin-top:-58px; width: 92px;">
                  Requires 2 science tags. Increase your MC production 2 steps.
                </div>
                <div class="description" style="text-align:left; width: 117px; margin-left: 19px;">
                  Place a City tile ON THE RESERVED AREA. 1 VP for every 3rd Floater on this card.
                </div>
            </div>
`],
    [CardName.STRATOSPHERIC_BIRDS, ` 
            <div class="content ">
              <div class="points">1/<div class="resource animal"></div></div>
              <div class="requirements">12% Venus</div>
                <div class="red-arrow "></div>
                <div class="resource animal"></div>
                <div class="description " style="margin-top:-5px">
                  (Action: Add 1 animal to this card.)
                </div>
                - <div class="resource floater"></div>
                <div class="description " >
                  (Requires Venus 12% and that you spend 1 Floater from any card. 1 VP for each Animal on this card.)
                </div>
            </div>
`],
    [CardName.SULPHUR_EXPORTS, ` 
            <div class="content ">
              <div class="tile venus-tile">V</div><br>
                <div class="production-box production-box-size2a">
                    <div class="money production">1</div> / <div class="resource-tag tag-venus"></div>
                </div>
               <div class="description">
                 (Increase Venus 1 step. Increase your MC production1 step for each Venus tag you have, including this.)
            </div>
          </div>
`],
    [CardName.SULPHUR_EATING_BACTERIA, ` 
            <div class="content hover-hide-res">
              <div class="requirements">6% Venus</div>
                <div class="red-arrow " style="margin-left:76px;"></div> <div class="microbe resource "></div><br>
              OR X<div class="microbe resource "></div> <div class="red-arrow "></div> <div class="resource money ">3X</div>
                <div class="description ">
                  (Action: add 1 Microbe to this card, or spend any number of Microbes here to gain triple amount of MC)
                  <br><br>
                  (Requires Venus 6%)
                </div>
            </div>
`],
    [CardName.PSYCHROPHILES, ` 
              <div class="content hover-hide-res">
                <div class="requirements requirements-max ">max -20 C</div>
                <div class="red-arrow "></div> <div class="microbe resource "></div><br>
                <div class="resource-tag tag-plant"></div>  : <div class="microbe resource "></div> = <div class="money resource ">2</div>
                  <div class="description">
                  (Action: Add 1 microbe to this card.)
                  (Effect: When paying for a plant card, microbes here may be used as 2 MC each.)
                  <br><br>
                  (Temperature must be -20 C or lower.)
                </div>
              </div>
`],
    [CardName.RESEARCH_COORDINATION, ` 
              <div class="content ">
                After being played, when you perform an action, the wild tag counts as any tag of your choice.
              </div>
`],
    [CardName.SF_MEMORIAL, ` 
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="resource card"></div>
                <div class="description">
                  (Draw 1 card.)
                </div>
              </div>
`],
    [CardName.SPACE_HOTELS, ` 
              <div class="content ">
                <div class="requirements">2 Earth</div>
                <div class="production-box">
                  <div class="production money">4</div>
                </div><br>
                <div class="description">
                  (Requires 2 Earth tags. Increase MC production 4 steps.)
                </div>
              </div>
`],
    [CardName.NITROGEN_FROM_TITAN, ` 
              <div class="content ">
                <div class="points points-big ">1</div>
                  <div class="tile rating"></div><div class="tile rating"></div>
                  <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                  <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                  <div class="description ">
                      (Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.)
                  </div>
              </div>
`],
    [CardName.PIONEER_SETTLEMENT, ` 
            <div class="content ">
              <div class="points points-big ">2</div>
              <div class="requirements requirements-max">max 1 Colony</div>
              <div class="production-box">
                <div class="production money">-2</div>
              </div>
              <div class="tile colony"></div>
              <div class="description" >
                (Requires that you have no more than 1 colony. Decrease your MC production 2 steps. Place a colony.)
              </div>
            </div>
`],
    [CardName.PRODUCTIVE_OUTPOST, ` 
            <div class="content ">
              GAIN ALL YOUR COLONY BONUSES
            </div>
`],
    [CardName.QUANTUM_COMMUNICATIONS, ` 
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="requirements">4 Science</div>
              <div class="production-box production-box-size2a">
                <div class="money production">1</div> / <div class="colony colony-icon-small red-outline"></div>
              </div><br>
              <div class="description">
                (Requires 4 Science tags. Increase your MC production 1 step for each colony in play.)
              </div>
            </div>
`],
    [CardName.RED_SPOT_OBSERVATORY, `
              <div class="content ">
                <div class="points points-big">2</div>
                <div class="requirements">3 Science</div>
                <div class="red-arrow "></div> <div class="resource floater"></div> OR
                <div class="resource floater"></div> <div class="red-arrow "></div>  <div class="resource card"></div>
                <div class="description ">
                  (Action: Add 1 floater to this card, or spend 1 floater here to draw a card.)
                </div>
                <div class="resource card"></div><div class="resource card"></div>
                <div class="description bottom">(Requires 3 Science tags.</div>
                <div class="description bottom">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Draw 2 cards.)</div>
              </div>
`],
    [CardName.REFUGEE_CAMP, ` 
              <div class="content ">
                  <div class="points points-big">1/<div class="resource camp" style="vertical-align:middle;"></div></div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix minus"></div><div class="money production ">1</div>
                  </div>
                  <span class="red-arrow " style="margin-left:5px; "></span>
                  <div class="resource camp"></div>
                  <div class="description ">
                      (Action: Decrease your MC production 1 step to add a camp resource to this card.)
                      <br><br>
                      (1 VP for each camp resource on this card.)
                  </div>
              </div>
`],
    [CardName.RESEARCH_COLONY, ` 
            <div class="content ">
              <div class="tile colony"></div>* <div class="resource card first"></div><div class="resource card"></div>
              <div class="description mt-10" >
                (Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.)
              </div>
            </div>
`],
    [CardName.RIM_FREIGHTERS, ` 
              <div class="content ">
                  <div class="tile trade"></div> : <div class="resource resource--white">-1</div>
                  <div class="description ">
                      (Effect: When you trade, you pay 1 less resource for it.)
                  </div>
              </div>
`],
    [CardName.SKY_DOCKS, ` 
              <div class="content ">
                <div class="points points-big">2</div>
                <div class="requirements">2 Earth</div>
                  : <span class="money resource ">-1</span>
                  <div class="description ">
                      (Effect: When you play a card, you pay 1 MC less for it.)
                  </div>
                  <div class="tile fleet"></div>
                  <div class="description ">
                      (Requires 2 Earth tags. Gain 1 Trade Fleet.)
                  </div>
              </div>
`],
    [CardName.SOLAR_PROBE, ` 
              <div class="content ">
                <div class="points points-big">1</div>
                  <div class="resource card"></div> /
                    <div class="resource-tag tag-science"></div><div class="resource-tag tag-science" style="margin-left:-10px"></div><div class="resource-tag tag-science" style="margin-left:-10px"></div>
                  <div class="description ">
                      (Draw 1 card for every 3 science tags you have, including this.)
                  </div>
              </div>
`],
    [CardName.SOLAR_REFLECTORS, ` 
              <div class="content ">
                <div class="production-box production-box-size1a">
                    5 <div class="heat production"></div>
                </div>
                <div class="description">
                  (Increase your heat production 5 steps.)
                </div>
              </div>
`],
    [CardName.SPACE_PORT, ` 
              <div class="content ">
                <div class="requirements">Colony</div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix minus"></div><div class="energy production "></div>
                      <div class="production-prefix plus"></div><div class="money production ">4</div>
                  </div>
                  <div class="tile city-tile "></div> <div class="tile fleet"></div>
                  <div class="description mt-10">
                      (Requires 1 colony. Decrease your Energy production 1 step and increase your MC production 4 steps. Place a City tile. Gain 1 Trade Fleet.)
                  </div>
              </div>
`],
    [CardName.SPACE_PORT_COLONY, ` 
              <div class="content ">
                <div class="points">1/2<div class="tile colony red-outline"></div></div>
                <div class="requirements">Colony</div>
                  <div class="tile colony"></div>* <div class="tile fleet"></div>
                  <div class="description mt-10">
                      (Requires a colony. Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. Gain 1 Trade Fleet. 1VP per 2 colonies in play.)
                  </div>
              </div>
`],
    [CardName.SPINOFF_DEPARTMENT, ` 
            <div class="content ">
              <div class="resource money">20</div>* : <div class="resource card"></div>
              <div class="description" >
                (Effect: WHEN PLAYING A CARD WITH A BASIC COST OF 20MC OR MORE, draw a card.)
              </div><br>
              <div class="production-box"><div class="production money">2</div></div>
              <div class="description" >
                (Increase your MC production 2 steps.)
              </div>
            </div>
`],
    [CardName.SUBZERO_SALT_FISH, ` 
            <div class="content hover-hide-res">
              <div class="points">1/2<div class="animal resource"></div>
              </div>
              <div class="requirements">-6 C</div>
              <span class="red-arrow"></span>
              <div class="animal resource"></div>
              <div class="description" style="margin-bottom:5px;">
                (Action: Add 1 Animal to this card.)
              </div>
              <div class="production-box production-box-size1a">
                <div class="production-prefix minus"></div><div class="plant production red-outline"></div>
              </div>
              <div class="description" style="text-align:left;">
                (Requires -6 C. Decrease any Plant production 1 step. 1 VP per 2 Animals on this card.)
              </div>
            </div>
`],
    [CardName.CREDICOR, `
      
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              -<div class="resource money ">20</div> : <div class="resource money ">4</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: After you pay for a card or standard project with a basic cost of 20MC or more, you gain 4MC.)
              </div>
          </div>
          <span style="font-size:40px; color: white; font-family: 'Times New Roman'; font-weight:normal;line-height:60px; border:2px solid purple; padding-left:5px; padding-bottom:5px; margin-left:10px; box-shadow: 6px 6px 10px grey; text-shadow:
      -1px 0 purple, 0 1px purple, 1px 0 purple, 0 -1px purple, 6px 6px 10px grey; ">
              credicor
          </span><br><br>
          <div class="description " style="text-align:center ">
          <div class="resource money" style="margin-top:-10px;">57</div><br>
              (You start with 57 MC.)
          </div>
      </div>
`],
    [CardName.ECOLINE, `
     
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        7<div class="resource plant"></div> <span class="red-arrow"></span>
        <div class="greenery-tile tile"></div><br>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: You may always pay 7 plants, instead of 8, to place greenery.)
        </div>
      </div>
      <span style="font-size:50px;
                      font-weight:normal;
                      color:rgb(0,180,0);
                      letter-spacing:2px;
                      margin-left:5px;
                      text-shadow: -1px 0 #404040, 0 1px #404040, 1px 0 #404040, 0 -1px #404040, 5px 5px 5px grey;
                      ">
                  ecoline
              </span><br>
      <div class="production-box production-box-size2" style="margin-top:5px;margin-right:10px;">
        <div class="production plant"></div><div class="production plant"></div>
      </div>
       <div class="resource money">36</div> 3<div class="resource plant"></div>
      <div class="description" style="margin-top:-3px;text-align:center;">(You start with 2 plant production, 3 plants, and 36MC)</div>
    </div>
`],
    [CardName.HELION, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        X<div class="resource heat"></div> :
        <div class="resource money">X</div>
        <div class="description helion-effect">
          (Effect: You may use heat as MC. You may not use MC as heat.)
        </div>
      </div>
      <div class="helion">helion</div><br>
      <div class="production-box production-box-size3 helion-production">
        <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
      </div>
        <div class="resource money helion-mc">42</div>
      <div class="description helion-resource-description">
        (You start with 3 heat production and 42 MC.)
      </div>
    </div>
`],
    [CardName.MINING_GUILD, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource steel"></div> /
        <div class="resource titanium"></div> :
        <div class="production-box">
          <div class="production steel"></div>
        </div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Each time you get any steel or titanium as a placement bonus on the map, increase your steel production 1 step.)
        </div>
      </div>
      <span class=" mining guild" style="font-size:24px;
              margin-left:20px;
                      color:#c9380e;
                      text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333, 0 -1px #333333, 2px 2px 2px  black;
                      display:inline-block;
                      -webkit-transform:scale(1.5,1); /* Safari and Chrome */
                      -moz-transform:scale(1.5,1); /* Firefox */
                      -ms-transform:scale(1.5,1); /* IE 9 */
                      -o-transform:scale(1.5,1); /* Opera */
                      transform:scale(1.5,1); /* W3C */
                      ">
                  MINING<br>GUILD
              </span><br>
      <div class="resource money" style="margin-left:35px;">30</div>&nbsp;&nbsp;
      5<div class="resource steel"></div>
      <div class="production-box" style="margin-top:5px;margin-left:20px;">
        <div class="production steel"></div>
      </div>
      <div class="description" style="margin-top:-5px;text-align:center;">
        (You start with 30 MC, 5 steel, and 1 steel production)
      </div>
    </div>
`],
    [CardName.INTERPLANETARY_CINEMATICS, ` 
      
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              <div class="resource-tag tag-event"></div> : <div class="resource money">2</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: Each time you play an event, you gain 2 MC.)
              </div>
          </div>
          <div class="INTERPLANETARY CINEMATICS" style="color: #020202;font-size:17px">
            INTERPLANETARY
          </div>
          <div style="height:5px;margin-top:-2px;width:143px;background:linear-gradient(to right, yellow,black,yellow,black,yellow);border:5px solid #cc3333;box-shadow:3px 3px 6px grey;">
          </div>
          <div class="INTERPLANETARY CINEMATICS" style="color: #020202;font-size:24px;margin-left:3px;margin-top:-5px;
          display:inline-block;
          -webkit-transform:scale(0.5,1); /* Safari and Chrome */
          -moz-transform:scale(0.5,1); /* Firefox */
          -ms-transform:scale(0.5,1); /* IE 9 */
          -o-transform:scale(0.5,1); /* Opera */
          transform:scale(1,0.5); /* W3C */
          margin-bottom:15px;">CINEMATICS
        </div><br>
          <div class="resource money " style="margin-left:40px;">30</div>&nbsp;&nbsp;&nbsp;&nbsp; 20<div class="resource steel"></div>
          <div class="description " style="text-align:center ">
              (You start with 20 steel and 30 MC.)
          </div>
      </div>
`],
    [CardName.INVENTRIX, ` 
      
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel">EFFECT</div>
              
              <div class="corporation-ability">
                <div class="globals-box">Global requirements</div>: +/- 2
              </div>
              
              <div class="description ">
                  (Effect: Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.)
              </div>
          </div>
          <span style="color: #020202;
          font-size:24px;
          padding-left:5px;
          padding-bottom:5px;
          text-shadow: 6px 6px 5px grey;
          ;">
            <span style="color: #020202;background-color:#6bb5c7;padding-left:4px;padding-right:4px;font-size:26px;box-shadow: 6px 6px 10px grey;">X</span> INVENTRIX
          </span>
          <div class="description " style="text-align:center ">
            <div class="resource money " style="margin-left:20px;">45</div> <div class="resource card" style="margin-left:20px"></div><div class="resource card"></div><div class="resource card"></div><br>
              (As you first action in the game, draw 3 cards. Start with 45MC.)
          </div>
      </div>
`],
    [CardName.PHOBOLOG, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource titanium"></div> : +
        <div class="resource money">1</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Your titanium resources are each worth 1 MC extra.)
        </div>
      </div>
      <span style="font-size:24px;
                      margin-left:15px;
                      color:white;
                      line-height:40px;
                      background: #32004d;
                      padding-left:5px;
                      padding-right:5px;
                      border:1px solid #444;
                      border-radius:10px;
                      font-family: 'Times New Roman';
                      display:inline-block;
                      -webkit-transform:scale(1.2,1); /* Safari and Chrome */
                      -moz-transform:scale(1.2,1); /* Firefox */
                      -ms-transform:scale(1.2,1); /* IE 9 */
                      -o-transform:scale(1.2,1); /* Opera */
                      transform:scale(1.2,1); /* W3C */
                      box-shadow:  6px 6px 5px  grey;">
                  PHOBOLOG
              </span><br><br>
      <div class="resource money" style="margin-left:45px;">23</div>
      10<div class="resource titanium"></div>
      <div class="description" style="text-align:center;">
        (You start with 10 titanium and 23 MC.)
      </div>
    </div>
`],
    [CardName.THARSIS_REPUBLIC, ` 
      
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              <div class="tile city-tile-small red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>&nbsp;&nbsp;
                <div class="tile city-tile-small"></div>:<div class="resource money">3</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: When any city tile is placed ON MARS, increase your MC production 1 step. When you place a city tile, gain 3 MC.)
              </div>
          </div>
          <div style="color: #020202;font-size:24px;text-shadow:6px 6px 6px grey;">
            <div style="text-shadow:none;box-shadow:3px 3px 6px grey;margin-right:2px;border: 1px solid red;display:inline-block;background-color:#ff5f00;">&#x25b2;<span style="color: #020202;font-size:14px;padding:0px;border:none;margin-left:-5px;">&#x25b2;</span>
            </div>THARSIS<br>&nbsp; REPUBLIC</div>
          <div class="description " style="text-align:center ">
          <div class="resource money " style="margin-left:60px;">40</div> <div class="tile city-tile" style="margin-left:40px;margin-top:-20px;"> </div><br>
              (You start with 40 MC. As your first action in the game,place a city tile.)
          </div>
      </div>
`],
    [CardName.THORGATE, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource-tag tag-power"></div> * :
        <div class="resource money">-3</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 MC less for it.)
        </div>
      </div>
      <span style="color: #020202;
                      font-size:32px;
                      font-family: 'Arial Narrow','Verdana';
                      font-weight:normal;
                      text-shadow: 6px 3px 5px  grey;">
                  THORGATE
              </span><br><br>
      <div class="production-box" style="margin-left:45px;margin-top:-10px;">
        <div class="production energy"></div>
      </div>
      <div class="resource money" style="margin-left:20px;">48</div>
      <div class="description" style="text-align:center;">
        (You start with 1 energy production and 48 MC.)
      </div>
    </div>
`],
    [CardName.UNITED_NATIONS_MARS_INITIATIVE, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">ACTION</div>
        <div class="resource money">3</div> <span class="red-arrow"></span>
        <div class="tile rating"></div>*
        <div class="description" style="text-align:center;margin-top:0px;">
          (Action:If your Terraform Rating was raised this generation, you may pay 3 MC to raise it 1 step more.)
        </div>
      </div>
      <div class="background-color-active" style="font-size:16px;
                      width:100px;
                      color: white;
                      margin-left:19px;
                      margin-bottom:8px;
                      padding:5px;
                      padding-top:5px;
                      padding-bottom:5px;
                      text-align:center;
                      font-weight:normal;
                      box-shadow:3px 3px 6px grey;
                      ">
                  UNITED NATIONS MARS INITIATIVE
              </div>
      <div class="description" style="text-align:center;margin-left:50px;">
        <div class="resource money">40</div> &nbsp;&nbsp;&nbsp;(You start with 40 MC.)
      </div>
    </div>
`],
    [CardName.TERACTOR, ` 
    
    <div class="corporate-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource-tag tag-earth"></div> :
        <div class="resource money">-3</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: When you play an Earth tag, you pay 3 MC less for it.)
        </div>
      </div>
      <span style="font-size:34px;
                      color: orangered;
                      font-family: 'Times New Roman';
                      font-weight:normal;
                      text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333,0px -1px #333333, 6px 3px 5px  grey;">
                  TERACTOR
              </span><br><br>
      <div class="description" style="text-align:center;">
        <div class="resource money">60</div><br> (You start with 60 MC.)
      </div>
    </div>
`],
    [CardName.SATURN_SYSTEMS, ` 
    
    <div class="corporate-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <span class="resource-tag tag-jovian red-outline"></span>&nbsp;:
        <div class="production-box">
          <div class="production money">1</div>
        </div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Each time any Jovian tag is put into play, including this, increase your MC production 1 step.)
        </div>
      </div>
      <span style="font-size:14px;
                      color:white;
                      line-height:40px;
                      background: #32004d;
                      padding-top:8px;
                      padding-bottom:8px;
                      padding-left:20px;
                      padding-right:20px;
                      border-radius:50%;
                      font-weight:normal;
                      border:2px solid white;
                      box-shadow:  6px 6px 5px  grey;">
                  SATURN <span style="font-size:20px;display:inline-block;">&#x25CF;</span> SYSTEMS
      </span><br><br>
      <div class="production-box" style="margin-left:45px;margin-top:-10px;">
        <div class="production titanium"></div>
      </div>
      <div class="resource money" style="margin-left:20px;">42</div>
      <div class="description" style="text-align:center;margin-top:0px;">
        (You start with 1 titanium production and 42 MC.)
      </div>
    </div>
`],
    [CardName.APHRODITE, ` 
    
    <div class="venus-icon corporation-icon"></div>
    <div class="contentCorporation">
    <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="tile venus-tile red-outline">V</div> : <div class="resource money">2</div>
        <div class="description description-effect">
          (Effect: Whenever Venus is terraformed 1 step, you gain 2MC.)
    </div>
    </div>
    <div class="corporation-logo">APHRODITE</div><br>
    <div class="starting-resources">
        <div class="production-box"><div class="production plant"></div></div>
        <div class="resource money">47</div>
    </div>
    <div class="description description-starting-resource">(You start with 1 plant production and 47 MC)</div>
    </div>
`],
    [CardName.CELESTIC, ` 
      
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="pointsCorporation">1/3<div class="resource floater"></div></div>
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater"></div>*
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Add a floater to ANY card.)
          </div><br>
          <div class="description" style="margin-top:17px;margin-left:17px; width: 120px; text-align:left;">
          (1 VP per 3 floaters
          <br>
          on this card.)
          </div>
        </div>
        <div class="celestic" style="font-size:24px;box-shadow:6px 6px 6px grey;margin-left: 9px;margin-bottom:2px">
          <span style="background:linear-gradient(to right, rgb(251,192,137),rgb(251,192,137),rgb(23,185,236));padding-left:5px;">CEL</span><span
          style="background:linear-gradient(to right,rgb(23,185,236),rgb(251,192,137))">ES</span><span style="background:rgb(251,192,137);padding-right:5px;">TIC</span>
        </div>
      </div><br>
        <div class="celestic-fix">
          <div class="resource money" style="margin-left:30px;">42</div>
          <div class="resource card"><div class="card-icon-box floater"></div></div>
          <div class="resource card"><div class="card-icon-box floater"></div></div>
          <div class="description" style="text-align:center;margin-top:-3px;font-size:10px;">
          (You start with 42 MC. As your first action, reveal cards from the deck until you have revealed 2 cards with a floater icon on it. Take those 2 cards into hand and discard the rest.)
        </div>
        </div>
`],
    [CardName.MANUTECH, ` 
      
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box">
          <div class="production wild"></div>
          </div> :
          <div class="resource wild"></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: For each step you increase the production of a resource, including this, you also gain that resource.)
          </div>
        </div>
        <span class="manutech" style="font-size:30px;
                        color: #e63900;
                        text-shadow:  6px 3px 5px  grey;">
                    <span style="color:white;background:#e63900;text-shadow:none;padding-left:2px;">MA</span>NUTECH
                </span><br>
        <div class="production-box" style="margin-top:15px;margin-left:50px;">
          <div class="production steel"></div>
        </div>
        <div class="resource money" style="margin-left:20px;">35</div>
        <div class="description" style="text-align:center;">
          (You start with 1 steel production, and 35 MC)
        </div>
      </div>
`],
    [CardName.MORNING_STAR_INC, ` 
      
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tile venus-tile">V</div> : +/- 2
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: Your Venus requirements are +/- 2 steps, your choice in each case.)
          </div>
        </div>
        <div  style="font-size:18px; color:white;margin-top:5px;margin-bottom:-10px;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 6px 3px 5px  grey;
                        ">
                    MORNING STAR INC.
                </div><br>
        <div class="resource money" style="margin-left:10px;">50</div>
        <div class="resource card"><div class="card-icon tag-venus"></div></div>
        <div class="resource card"><div class="card-icon tag-venus"></div></div>
        <div class="resource card"><div class="card-icon tag-venus"></div></div>
        <div class="description" style="text-align:center;margin-top:-4px;">
          (You start with 50 MC. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.)
        </div>
      </div>
`],
    [CardName.VIRON, ` 
      
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="red-arrow" style="font-size:30px;"></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Use a blue card action that has already been used this generation.)
          </div>
        </div>
        <div  style="font-size:50px; font-family: Prototype;margin-left: 15px;
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white, 6px 3px 5px  grey;
                        ">
                    VIRON
                </div>
        <div class="resource money" style="margin-left:65px;">48</div>
        <div class="description" style="text-align:center;">
          (You start with 48 MC.)
        </div>
      </div>
`],
    [CardName.CHEUNG_SHING_MARS, ` 
      
      <div class="prelude-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource-tag tag-building"></div> :
          <div class="resource money">-2</div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When you play a building tag, you pay 2 MC less for it.)
          </div>
        </div>
        <div style="margin-top:20px;width:50px;display:inline-block;"><span style="color:red;border:4px solid red;border-radius:50%;padding:3px 5px 3px 5px;font-size:30px;line-height:14px;box-shadow: 3px 3px 3px grey, inset 0 0 3px 3px grey;text-shadow: 3px 3px 3px grey;">㨐</span></div>
        <div style="display: inline-block; width:140px; font-size:19px; line-height: 22px; vertical-align: middle; margin-bottom: 15px;
                        font-family: 'Prototype';
                        font-weight:normal;
                        ">
                    &nbsp;Cheung Shing <br><div style="margin-left:10px"> ■■MARS■■ </div>
                </div>
        <div class="production-box" style="margin-left:45px;margin-top:-10px;">
          <div class="production money">3</div>
        </div>
        <div class="resource money" style="margin-left:20px;">44</div>
        <div class="description" style="text-align:center;">
          (You start with 3 MC production and 44 MC.)
        </div>
      </div>
`],
    [CardName.POINT_LUNA, ` 
        
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource-tag tag-earth"></div> : <div class="resource card"></div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play an Earth tag, including this, draw a card.)
                </div>
            </div>
            <div class="luna-fix">POINT<span>&nbsp;</span>LUNA</div>
            </div>
            <div class="description " style="text-align:center;margin-top:0px ">
            <div class="production-box" style="margin-left:-30px;margin-top:-5px;margin-bottom:-5px;"><div class="production titanium"></div></div>
            <div class="resource money" style="margin-left:60px;margin-bottom:15px">38</div><br>
              (You start with 1 titanium production<br> and 38 MC.)
            </div>
`],
    [CardName.ROBINSON_INDUSTRIES, `
      
      <div class="prelude-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource money">4</div>
          <div class="red-arrow"></div>
          <div class="production-box">
          <div class="production wild"></div>
          </div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Spend 4 MC to increase (one of) your LOWEST PRODUCTION 1 step.)
          </div>
        </div>
        <div class="robinson" style="letter-spacing:4px;border-bottom:3px solid #ccc;margin-top:5px;">ROBINSON</div>
        <div class="robinson" style="border-bottom:3px solid #ccc;">•—•—•—•—•—•—•&nbsp;</div>
        <div class="robinson" style="letter-spacing:2px;">INDUSTRIES</div>
        <div class="resource money" style="margin-left:59px;margin-top:10px;">47</div>
        <div class="description" style="text-align:center;">
          (You start with 47 MC.)
        </div>
`],
    [CardName.VALLEY_TRUST, ` 
        
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource-tag science"></div> : <div class="resource money">-2</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play an Science tag, you pay 2MC less for it.)
                </div>
            </div>
            <div style="color:rgb(2,125,195);background:linear-gradient(to right,rgb(2,125,195) 10%,white,white,white, white,white,white, white);box-shadow:3px 3px 10px 1px rgb(58,58,58);width:135px;line-height:24px;border-radius:10px 0px 0px 10px">
              <div style="display:inline-block;margin-left:25px;margin-top: 3px;margin-bottom:15px;font-size:26px;text-shadow: 2px 2px #ccc;text-align:center">VALLEY TRUST</div>
            </div>
            <div class="description" style="text-align:center;">
            <div class="resource money" style="margin-left:12px;margin-top:10px;">37</div> <div class="resource card-corporation" style="margin-left:50px"><span style="background:linear-gradient(to right, rgb(235,118,171), #e64d91);padding-left:4px;padding-right:4px;border-radius:2px;">PREL</span></div>
            <div class="description" style="margin-top:-2px;">
              (You start with 37 MC. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.)
            </div>
        </div>
`],
    [CardName.VITOR, ` 
        
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource points-big"
                style="background: linear-gradient(#cc8b00, rgb(128, 87, 0),rgb(128, 87, 0));
                width: 40px;
                height: 34px;
                font-weight: normal;
                line-height: 31px;
                font-size: 28px;
                text-align: center;
                border-radius: 12px;
                border-style: outset;
                background-color: rgb(205,162,130);
                background: linear-gradient(#cc8b00, rgb(128, 87, 0),rgb(128, 87, 0));
                box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3);
                ">?</div> : <div class="resource money">3</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play a card with a NON-NEGATIVE VP icon, including this, gain 3MC.)
                </div>
            </div>
            <div class="vitor" style="font-size:24px;
            margin-top:10px;
            margin-left:50px;
            margin-bottom:35px;
            display:inline-block;
            box-shadow:6px 6px 6px grey;
            -webkit-transform:scale(2,1); /* Safari and Chrome */
            -moz-transform:scale(2,1); /* Firefox */
            -ms-transform:scale(2,1); /* IE 9 */
            -o-transform:scale(2,1); /* Opera */
            transform:scale(2,1); /* W3C */
            ;">
            <span style="color:white;background:orangered;padding-left:3px;">VIT</span>
            <span style="background:linear-gradient(to right, orangered,white);margin-left:-8px;">O</span>
            <span style="margin-left:-7px;background:white;padding-right:3px;">R</span>
            </div>
            <div class="description " style="text-align:center;margin-top:-5px ">
            <div class="resource money">45</div><span
            style="background:orange;padding:2px;padding-left:25px;padding-right:25px;
            font-size:14px;font-weight:bold;margin-left:20px;border-radius:3px;box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3);">AWARDS</span> <br>
              (You start with 45 MC. As your first action, fund an award for free.)
            </div>
        </div>
`],
    [CardName.ARIDOR, ` 
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <span class="resource-tag" style="background:linear-gradient(to bottom right, green, yellow, red)">&nbsp;</span>&nbsp;:
          <div class="production-box">
            <div class="production money">1</div>
          </div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (When you get a new type of tag in play (event cards do not count), increase your MC production 1 step.)
          </div>
        </div>
        <div class="aridor">ARIDOR</div>
        <div class="resource money" style="margin-left:20px;">40</div>
        <span style="background:#444;color:#eee;padding:4px;padding-left: 8px;padding-right: 8px; border-radius:20px;font-weight:normal;margin-left:20px;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3); border:1px solid #eee;">COLONY</span>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 40MC. As your first action add a colony tile.)
        </div>
      </div>
`],
    [CardName.MONS_INSURANCE, ` 
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box corp-effect-box">
          -<div class="resource wild corp-effect"></div>
          </div>
          OR - <div class="resource wild red-outline"></div>:
          PAY<div class="resource money" style="margin-right:-2px">3</div>
          <div class="description" style="text-align:center;margin-top:-2px;">
            (Effect: When a player causes another player to decrease production or lose resources, pay 3MC to the victim, or as much as possible.)
          </div>
        </div>
        <div class="mons" style="margin-top:18px">
          <div class="mons0">&#x25b2;</div>
          <div class="mons1">mons</div>
          <div class="mons2">INSURANCE</div>
        </div>
        <div class="resource money" style="margin-left: 145px;
              margin-right: 20px;
              margin-top: -80px;
              position: absolute;">48</div>
        <div class="production-box production-box-size2a" style="
              position: absolute;
              margin-top: -46px;
              margin-left: 92px;">
          <div class="production money">4</div> <div class="production money red-outline">-2</div>*
        </div>
        <div class="description" style="margin-top:11px;text-align:center;">
          (You start with 48 MC. Increase your MC production 4 steps. ALL OPPONENTS DECREASE THEIR MC PRODUCTION 2 STEPS. THIS DOES NOT TRIGGER THE EFFECT BELOW.)
        </div>
      </div>
`],
    [CardName.ARKLIGHT, ` 
      
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
         <div class="pointsCorporation">1/2<div class="resource animal"></div></div>
        <div class="corporationEffectBox" style="margin-top: 143px; height: 144px">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource-tag tag-animal"></div> / <div class="resource-tag tag-plant"></div> : <div class="resource animal"></div>
          <div class="description" style="margin-top:0px;text-align:left;margin-left:10px;">
            (Effect: When you play an animal or plant tag, including this, add 1 animal to this card.)
          </div>
        </div>
        <div  class= "arklight" style="font-size:19px;
          font-family: Prototype;
          margin-left: 74px;
          letter-spacing: 1px;
          background: linear-gradient(to right,#000089, dodgerblue, deepskyblue);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-transform:scale(2,1); /* Safari and Chrome */
          -moz-transform:scale(2,1); /* Firefox */
          -ms-transform:scale(2,1); /* IE 9 */
          -o-transform:scale(2,1); /* Opera */
          transform:scale(2,1); /* W3C */
          margin-top: 3px;
          margin-bottom: -12px;
          "> ARKLIGHT
        </div><br>
        <div class="resource money" style="margin-right:30px;margin-left:30px;">45</div>
        <div class="production-box ">
            <div class="money production ">2</div>
        </div>
        <div class="description" style="text-align:center;">
          (You start with 45 MC. Increase your MC production 2 steps. 1 VP per 2 animals on this card.)
        </div>
`],
    [CardName.PRISTAR, ` 
            <div class="turmoil-icon corporation-icon"></div>
            <div class="contentCorporation ">
               <div class="pointsCorporation" >1/<div class="resource pristar"></div></div>
                <div class="corporationEffectBox hover-hide-res" style="height:140px;margin-top:150px">
                    <div class="corporationEffectBoxLabel" style="margin-bottom:5px;">EFFECT</div>

                      <div class="tile rating"><div class="left-line"></div><div class="right-line"></div></div> : <div class="resource pristar"></div> <div class="resource money">6</div>
                    <div class="description " style="text-align:center;margin-top:-3px; text-align:left;">
                        (Effect: During production phase, if you did not get TR so far this <br> generation, add one <br> preservation resource<br> here and gain 6 MC.)
                    </div>
                </div>
                <div style="color:#ff5d21;text-shadow: 3px 3px 3px black;font-size:30px;transform:scaleX(0.8);letter-spacing:1px;">
                  PRISTAR
                  </div>
                <div class="resource money " style="margin-left:10px;margin-right:20px;">53</div> - <div class="tile rating"></div><div class="tile rating"></div>
                <div class="description " style="text-align:center;">
                    (You start with 53 MC. Decrease your TR 2 steps.
                    <br>
                    1 VP per preservation resource here.)
                </div>
            </div>
`],
    [CardName.POLYPHEMOS, ` 
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource card"></div>* &nbsp;: <div class="resource money">5</div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When you buy a card to hand, pay 5MC instead of 3, including the starting hand.)
          </div>
        </div>
        <div class="polyphemos"><span class="polyphemos2">POL</span>YPHEMOS</div>
        <div class="resource money" style="margin-left:20px;">50</div> <div  style="margin-left:15px;margin-right:15px" class="production-box"><div class="production money">5</div></div> 5<div class="resource titanium"></div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 50MC. Increase your MC production 5 steps. Gain 5 titanium.)
        </div>
      </div>
`],
    [CardName.UTOPIA_INVEST, ` 

<div class="turmoil-icon corporation-icon"></div>
<div class="contentCorporation">
  <div class="corporationEffectBox">
    <div class="corporationEffectBoxLabel">ACTION</div>
    <div class="production-box">
      <div class="resource wild"></div>
    </div>
    <div class="red-arrow"></div>
    4<div class="production wild"></div>
    <div class="description utopia-ability-description">
      (Action: Decrease any production to gain 4 resources of that kind.)
    </div>
  </div>
  <div class="utopia-corp-name">
    <div class="utopia-corp-name-1">UTOPIA</div>
    <div class="utopia-corp-name-2">INVEST</div>
  </div>
  <div class="utopia-starting-resources">
    <div class="resource money">40</div>
  </div>
  <div class="production-box production-box-size2 utopia-production-box">
    <div class="production steel"></div><div class="production titanium"></div>
  </div>
  <div class="description utopia-description-box">
    (You start with 40 MC. Increase your steel and titanium production 1 step each.)
  </div>
</div>
`],
    [CardName.POSEIDON, `
      
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tile colony red-outline"></div>: <div class="production-box"><div class="production money">1</div></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When any colony is placed, including this, raise your MC production 1 step.)
          </div>
        </div>
        <div class="poseidon">POSEIDON</div>
        <div class="resource money" style="margin-left:70px;">45</div> <div class="tile colony"></div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 45MC. As your first action, place a colony.)
        </div>
      </div>
`],
    [CardName.STORMCRAFT_INCORPORATED, ` 
      
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox hover-hide-res" style="margin-top: 136px; height: 149px">
          <div class="corporationEffectBoxLabel" style="margin-bottom:5px;" >ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater" style="margin-bottom:5px;"></div>* <br>
          <div class="resource floater"></div> = <div class="resource heat"></div><div class="resource heat"></div>
          <div class="description" style="text-align:center;margin-top:-5px;">
            (Action: Add a floater to ANY card.<br> Effect: Floaters on this card may be used as 2 heat each.)
          </div><br>
        </div>
        <div class="stormcraft1">STORM</div><div class="stormcraft2">CRAFT</div>
        <div class="stormcraft3">INCOR</div><div class="stormcraft4">PORATED</div>
        <div class="resource money" style="margin-left:60px;">48</div>
        <div class="description" style="margin-left: 20px">
          (You start with 48 MC.)
        </div>
      </div>
`],
    [CardName.ARCADIAN_COMMUNITIES, `
      
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="corporation-action-text"><span class="red-arrow"></span>ACTION: PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA ADJACENT TO ONE OF YOUR TILES OR MARKED AREAS</div>
          <div class="corporationEffectBoxLabel">EFFECT</div>
            <div class="corporation-effect-text">EFFECT: MARKED AREAS ARE RESERVED FOR YOU. WHEN YOU PLACE A TILE THERE, GAIN 3 MC</div>
        </div>
        <div class="corporation-logo">ARCADIAN COMMUNITIES</div>

        <div class="corporation-startswith nowrap">
          <div class="resource money">40</div>
          10<div class="resource steel"></div>
          <div class="resource special">&nbsp;</div>*
        </div>
        <div class="description" >(You start with 40 MC and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA.)</div>
      </div>
`],
    [CardName.BEGINNER_CORPORATION, `
      
      <div class="contentCorporation">
        <div class="corporation-frame">BEGINNER CORPORATION</div>
        <div class="resource money">42</div>
        <div class="description">
          You start with 42 MC. Instead of choosing from 10 cards during setup, you get 10 cards for free.)
        </div>
      </div>
`],
    [CardName.PHILARES, ` 
      
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tile empty-tile-small red-outline"></div><div class="tile empty-tile-small"></div>
          : <div class="resource wild"></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: Each new adjacency between your tile and an opponent's tile gives you a standard resource of your choice (regardless of who just placed a tile).)
          </div>
        </div>
        <div class="philares">
          PHIL<span style="color:#ff5858">A</span>RES
        </div>
        <div class="resource money" style="margin-left:35px;margin-right:20px;margin-top:20px;">47</div>
        <div class="tile greenery-tile">
        </div>
        <div class="description" style="margin-top:-3px;text-align:center;">
          (You start with 47 MC. As your first action, place a greenery tile and raise the oxygen 1 step.)
        </div>
      </div>
`],
    [CardName.RECYCLON, ` 
      
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox hover-hide-res">
          <div class="corporationEffectBoxLabel" style="margin-bottom:10px">EFFECT</div>
          <div class="resource-tag tag-building"></div> :<div class="resource microbe"></div> OR
          2<div class="resource microbe"></div>:<div class="production-box" style="margin-left:5px;"><div class="production plant"></div></div><br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.)
        </div>
        </div>
        <div class="recyclon-fix"> RECYCLON</div>
      </div>
      <div class="recyclon-fix-2">
        <div class="resource money" style="margin-left:60px;margin-right:25px;">38</div>
        <div class="production-box" style="margin-left:20px;"><div class="production steel"></div></div>
        <div class="description" style="margin-top:0px;text-align:center;">(You start with 38 MC and 1 steel production.)</div>
      </div>
`],
    [CardName.SPLICE, `
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:2px">EFFECT</div>
          <div class="resource-tag tag-microbe red-outline"></div> : <div class="resource money red-outline">2</div> * OR <div class="resource microbe red-outline"></div> *<br>
          <div class="resource-tag tag-microbe red-outline" style="margin-top:-4px;"></div> : <div class="resource money" style="margin-right:91px;margin-left:5px;margin-top:-4px;">2</div> <br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: when a microbe tag is played, incl. this, THAT PLAYER gains 2 MC, or adds a microbe to THAT card, and you gain 2 MC.)
        </div>
        </div>
        <div class="splice"><div style="margin-left:2px"> SPLI<span style="color:red">C</span>E</div>
                    <div STYLE="height:3px;background:red;margin-top:-3px;"></div>
                    <div STYLE="font-size:10px">TACTICAL GENOMICS</div>
                </div>
                <div class="resource money" style="margin-left:60px;margin-right:25px;">44</div>
        <div class="resource card"><div class="card-icon tag-microbe"></div></div>
        <div class="description" style="margin-top:-2px;margin-left:-7px;margin-right:-7px;text-align:center;">(You start with 44 MC. As your first action, reveal cards until you have revealed a microbe tag. Take that card into hand and discard the rest.)</div>
      </div>
`],
    [CardName.LAKEFRONT_RESORTS, `
            <div class="turmoil-icon corporation-icon"></div>
            <div class="contentCorporation ">
                <div class="corporationEffectBox" style="height:140px;margin-top:150px">
                    <div class="corporationEffectBoxLabel" style="margin-bottom:4px;">EFFECT</div>
                    <div class="nowrap">
                      <div class="resource ocean-resource red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>
                      <div class="tile empty-tile-small"></div>
                      <div class="resource ocean-resource" style="margin-left:-3px;"></div>:<div class="resource money">3</div>
                    </div>
                    <div class="description " style="text-align:center;margin-top:0px; ">
                        (Effect: When any ocean tile is placed, increase your MC production 1 step. Your bonus for placing adjacent to oceans is 3MC instead of 2MC.)
                    </div>
                </div>
                <div style="font-size:22px;margin-top:10px;margin-left:10px;font-family:Times;color:white;
                text-shadow:0 1px 0px #444, 0px -1px 0px #444, -1px 0px 0px #444, 1px 0px 0px #444;letter-spacing:4px;">
                  LAKEFRONT <br> &nbsp;&nbsp;RESORTS
                  </div>
                <div class="resource money " style="margin-left:75px;margin-top:10px;">54</div>
                <div class="description " style="text-align:center;margin-left:15px;">
                    (You start with 54 MC.)
                </div>
            </div>
`],
    [CardName.TERRALABS_RESEARCH, `
  <div class="turmoil-icon corporation-icon"></div>
  <div class="contentCorporation ">
      <div class="corporationEffectBox ">
          <div class="corporationEffectBoxLabel">EFFECT</div>
            <div class="resource card"></div> : <div class="resource money">1</div>
          <div class="description " style="text-align:center;margin-top:0px; ">
              (Effect: Buying cards to hand costs 1MC.)
          </div>
      </div>
      <div style="font-size:16px;margin-top:33px;margin-left:75px;margin-bottom:5px; font-family:Prototype;color:#222;transform:scale(2,1)">
        TERRALABS
        </div>
        <div style="font-size:8px;letter-spacing:2px;font-family:Prototype;margin-left:100px;margin-top:-5px;margin-bottom:10px;transform:scale(2,1)">RESEARCH</div>
      <div class="resource money " style="margin-left:25px;margin-right:20px;">14</div> - <div class="tile rating"></div>
      <div class="description " style="text-align:center;">
          (You start with 14 MC. Lower your TR 1 step.)
      </div>
  </div>
`],
    [CardName.FACTORUM, `
          <div class="promo-icon corporation-icon"></div>
          <div class="contentCorporation">
            <div class="corporationEffectBox">
              <div class="corporationEffectBoxLabel">ACTION</div>

              <div class="corporation-action-icons nowrap">
                <div class="red-arrow"></div><div class="production-box">
                  <div class="production energy"></div>
                </div> * OR
                <div class="resource money">3</div><div class="red-arrow"></div>
                <div class="resource card"><div class="card-icon tag-building"></div></div>
              </div>

              <div class="description">
                (Action: Increase your energy production 1 step IF YOU HAVE NO ENERGY RESOURCES, or spend 3MC to draw a building card.)
              </div>
            </div>

            <div class="factorum">FACTORUM</div>
            <div class="corporation-starts-with">
              <div class="resource money">37</div>
              <div class="production-box">
                <div class="production steel"></div>
              </div>
            </div>
            <div class="description">
              (You start with 37 MC. Increase your steel production 1 step.)
            </div>
          </div>
          `],
    [CardName.SEPTUM_TRIBUS, `
      <div class="turmoil-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:15px;" >ACTION</div>
          <div class="red-arrow"></div> <div class="resource money">2</div> / <div class="delegate"></div> *
          <div class="description" style="text-align:center;margin-top:5px;">
            (Action: Gain 2 MC for each party where you have at least 1 delegate.)
          </div><br>
        </div>
        <div class="septem">Septem Tribus</div>
        <div class="resource money" style="margin-left:60px;margin-top:10px">36</div>
        <div class="description" style="text-align:center;margin-top:10px">
          (You start with 36 MC. When you perform an action, the wild tag counts as any tag of your choice.)
        </div>
      </div>
`],
    [CardName.ASTRODRILL, `
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox hover-hide-res" style="height:165px;margin-top:127px">
          <div class="corporationEffectBoxLabel" >ACTION</div>
          <div class="red-arrow"></div> <div class="asteroid resource"></div> * / <div class="resource wild"></div> OR <br>
          <div class="asteroid resource"></div><div class="red-arrow"></div> 3 <div class="resource titanium"></div>
          <div class="description" style="text-align:center;">
            (Action: Add an asteroid resource to ANY card OR gain any standard resource, OR remove an asteroid resource from this card to gain 3 titanium.)
          </div><br>
        </div>
        <div class="astrodrill">Astrodrill</div>
        <div class="resource money" style="margin:3px 40px 0px 50px">38</div>
        3 <div class="asteroid resource"></div>
        <div class="description" style="text-align:center">
          (You start with 38 MC and 3 asteroid resources.)
        </div>
      </div>
`],
    [CardName.PENGUINS, ` 
    <div class="content ">
        <div class="points">1/<div class="animal resource"></div></div>
        <div class="requirements">8 Oceans</div>
        <span class="red-arrow"></span> <div class="animal resource"></div>
        <div class="description">
            (Action: Add 1 Animal to this card.)
        </div><br/>
        <div class="description">
            (Requires 8 oceans. 1 VP for each animal on this card.)
        </div>
    </div>
`],
    [CardName.SMALL_ASTEROID, ` 
    <div class="content ">
        <div class="tile temperature-tile"></div><br/>
        - <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>
        <div class="description ">
            (Increase temperature 1 step. Remove up to 2 plants from any player.)
        </div>
    </div>
`],
    [CardName.SNOW_ALGAE, ` 
    <div class="content">
        <div class="requirements">2 Oceans</div>
        <div class="production-box production-box-size2">
            <div class="plant production"></div><div class="heat production"></div>
        </div>
        <div class="description">
            (Requires 2 oceans. Increase your Plant production and your heat production 1 step each.)
        </div>
    </div>
`],
    [CardName.PHARMACY_UNION, `
    <div class="promo-icon corporation-icon"></div>
    <div class="contentCorporation">

      <div class="corp-logo">Pharmacy Union</div>

      <div class="card-effect-icons">
        <div class="resource money startmc">54</div>
        <div class="resource card"><div class="card-icon tag-science"></div></div>
      </div>

      <div class="description card-effect-text">
        (You start with 54 MC. When this corporation is revealed, draw a Science card.)
      </div>

      <div class="corporationEffectBox hover-hide-res">
        <div class="corporationEffectBoxLabel">Effect</div>
        <div class="resource-tag tag-microbe red-outline"></div> : <div class="resource disease">D</div><div class="resource money">-4</div>
        <div class="corp-effectrow2">
          <div class="resource-tag tag-science"></div> : - <div class="resource disease">D</div><div class="rating tile"></div> / 3 <div class="rating tile"></div>
        </div>
        <div class="description">
          (Effect: When ANY microbe tag is played, add a disease here and lose 4 MC. When you play a science tag, remove a disease here and gain 1 TR OR if there are no diseases here, you may turn this card face down to gain 3 TR)
        </div>
      </div>
    </div>

`],
    [CardName.SUB_CRUST_MEASUREMENTS, ` 
    <div class="content">
      <div class="points points-big">2</div>
      <div class="requirements">2 Science</div>
      <span class="red-arrow"></span> <span class="card resource"></span>
      <div class="description">
        (Action: Draw a card.)
      </div>
      <br>
      <div class="description">
        (Requires 2 Science tags.)
      </div>
    </div>
`],
    [CardName.POTATOES, ` 
      <div class="content">
        -  <div class="plant resource"></div><div class="plant resource"></div>
        &nbsp;&nbsp;
        <div class="production-box">
          <div class="money production">2</div>
        </div>
        <div class="description">
          (Requires that you lose 2 plants. Increase your MC production 2 steps.)
        </div>
      </div>
`],
    [CardName.REGO_PLASTICS, ` 
    <div class="content ">
        <div class="points points-big">1</div>
        <div class="resource steel"></div> : + <div class="resource money">1</div>
        <div class="description">
            (Effect: Your steel resources are worth 1 MC extra.)
        </div>
    </div>
`],
    [CardName.PROJECT_INSPECTION, ` 
    <div class="content">
        USE A CARD ACTION THAT HAS BEEN USED THIS GENERATION
    </div>
`],
    [CardName.ORBITAL_CLEANUP, ` 
    <div class="content">
        <div class="points points-big">2</div>
        <span class="red-arrow"></span> <div class="money resource">1</div> / <div class="resource-tag tag-science"></div>
        <div class="description " style="margin-bottom:10px;">
            (Action: Gain 1 MC per Science tag you have.)
        </div>
        <div class="production-box"><div class="money production ">-2</div></div>
        <div class="description">
            (Decrease your MC production 2 steps.)
        </div>
    </div>
`],
    [CardName.PARLIAMENT_HALL, ` 
  <div class="content ">
    <div class="points points-big">1</div>
    <div class="requirements"><span class="party">Mars First</span></div>
      <div class="production-box production-box-size4a">
        <div class="money production">1</div> /
        <div class="resource-tag tag-building"></div>
        <div class="resource-tag tag-building"></div>
        <div class="resource-tag tag-building"></div>
      </div>
      <div class="description ">
        (Requires that Mars First are ruling or that you have 2 delegates there. Increase your MC production 1 step for every 3 Building tag you have, including this.)
      </div>
  </div>
`],
    [CardName.POLITICAL_ALLIANCE, ` 
  <div class="content">
    <div class="requirements">2 Party Leaders</div>
      <div class="tile rating"></div>
      <br>
      <div class="description">
        (Requires that you have 2 party leaders. Gain 1 TR.)
      </div>
  </div>
`],
    [CardName.PR_OFFICE, ` 
  <div class="content ">
    <div class="requirements"><span class="party">Unity</span></div>
      <div class="tile rating"></div>
      <br>
      <div class="resource money">1</div> / <div class="resource-tag tag-earth"></div>
      <div class="description ">
        (Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 MC for each Earth tag you have, including this.)
      </div>
  </div>
`],
    [CardName.RECRUITMENT, ` 
  <div class="content ">
    <div class="minus"></div> <div class="delegate delegate-red"></div>* &nbsp;&nbsp; <div class="plus"></div> <div class="delegate"></div>
      <div class="description ">
        (Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.)
      </div>
  </div>
`],
    [CardName.RED_TOURISM_WAVE, ` 
  <div class="content ">
    <div class="requirements"><span class="party">Reds</span></div>
    <div class="resource money">1</div> / <div class="tile empty-tile-small"></div>*

      <div class="description ">
        (Requires that Reds are ruling or that you have 2 delegates there. Gain 1 MC from each EMPTY AREA ADJACENT TO YOUR TILES.)
      </div>
  </div>
`],
    [CardName.SPONSORED_MOHOLE, ` 
  <div class="content ">
    <div class="requirements"><span class="party">Kelvinists</span></div>
      <div class="production-box production-box-size2">
        <div class="heat production"></div><div class="heat production"></div>
      </div>
      <div class="description ">
        (Requires that Kelvinists are ruling or that you have 2 delegates there. Increase your heat production 2 steps.)
      </div>
  </div>
`],
    [CardName.SUPPORTED_RESEARCH, ` 
  <div class="content ">
    <div class="requirements"><span class="party">Scientists</span></div>
      <div class="resource card"></div> <div class="resource card"></div>
      <div class="description ">
        (Requires that Scientists are ruling or that you have 2 delegates there. Draw 2 cards.)
      </div>
  </div>
`],
    [CardName.STANFORD_TORUS, ` 
    <div class="content">
        <div class="points points-big">2</div>
        <div class="tile city-tile"></div> *
        <div class="description ">
            (Place a city tile IN SPACE, outside and separate from the planet.)
        </div>
    </div>
`],
    [CardName.SATURN_SURFING, ` 
    <div class="content">
        <div class="points points-big">1</div>
        <div class="nowrap">
          <div class="floater resource"></div>
          <span class="red-arrow"></span>
          <div class="money resource">1</div> / <div class="resource floater"></div> * max 5
        </div>
        <div class="description" style="margin-bottom:10px;">
          (Action: Spend 1 floater from here to gain 1 MC from each floater here, INCLUDING THE PAID FLOATER. Max 5.)
        </div>
        <div class="floater resource"></div> / <div class="resource-tag tag-earth"></div>
        <div class="description">
            (Add 1 floater here for every Earth tag you have, including this.)
        </div>
    </div>
`],
    [CardName.AGRICOLA_INC, ` 
      <div class="community-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="pointsCorporation">?</div>
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>

          <div class="description effect">
            (Effect: At game end, score -2 / 0 / 1 / 2 VP PER TAG TYPE for 0 / 1-2 / 3-4 / 5+ tags.)
          </div>
        </div>
      </div>

      <div class="agricola">Agricola Inc</div>
      <div class="resource money">40</div>

      <div class="production-box production-box-size2">
        <div class="money production ">1</div>
        <div class="production plant"></div>
      </div>
      
      <div class="description">
        (You start with 1 plant production, 1 MC production and 40 MC.)
      </div>
`],
    [CardName.PROJECT_WORKSHOP, `
      <div class="community-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>

          <div style="margin-top:-2px">
            FLIP <div class="resource card card-small"><div class="card-icon card-icon-blue"></div></div>
            <div class="red-arrow "></div>
            ? <div class="tile rating"></div>
            <div class="resource card card-small"></div>
            <div class="resource card card-small"></div>
          </div>

          <div>
            OR <div class="money production">3</div>
            <div class="red-arrow "></div>
            <div class="resource card card-small"><div class="card-icon card-icon-blue"></div></div>
          </div>

          <div class="effect description">
            (Action: Flip and discard a played blue card to convert any VP on it into TR and draw 2 cards, or spend 3 MC to draw a blue card.)
          </div>
        </div>
      </div>

      <div class="project_workshop">PROJECT WORKSHOP</div>
      <div class="resource money">39</div>
      <div class="resource steel"></div>
      <div class="resource titanium"></div>
      <div class="resource card card-medium"><div class="card-icon card-icon-blue"></div></div>
      
      <div class="description">
        (You start with 39 MC, 1 steel and 1 titanium.
        <br>
        As your first action, draw a blue card.)
      </div>
`],
    [CardName.INCITE, `
      <div class="community-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          + <div class="influence"></div>
          <br>
          <div class="delegate effect"></div> : <div class="money resource effect-money">-2</div>
          <div class="description effect">
            (Effect: You have influence +1. When you send a delegate using the lobbying action, you pay 2 MC less for it.)
          </div>
        </div>
      </div>

      <div class="incite">INCITE</div>
      <div class="resource money">32</div>
      <div class="delegate"></div><div class="delegate"></div>
      
      <div class="description start-text">
        (You start with 32 MC. As your first action, place two delegates in one party.)
      </div>
`],
    [CardName.PLAYWRIGHTS, `
      <div class="community-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="resource money effect-money">?</div>
          <div class="red-arrow"></div>
          REPLAY &nbsp;<div class="resource card red-outline"><div class="card-icon tag-event"></div></div>&nbsp;*
          
          <div class="description effect">
            (Action: Replay a played event from any player by paying its cost ONLY in MC (discounts and rebates apply), then REMOVE IT FROM PLAY.)
          </div>
        </div>
      </div>

      <div class="playwrights">Playwrights</div>
      <div class="resource money">38</div>
      <div class="production-box">
        <div class="production energy"></div>
      </div>
      
      <div class="description start-text">
        (You start with 38 MC and 1 Energy production.)
      </div>
`],
    [CardName.MIDAS, `
      <div class="community-icon corporation-icon"></div>

      <div class="midas">Midas</div>
      <div class="resource money">120</div>
      <span class="start-tr-text">-7</span>
      <div class="tile rating"></div>

      <div class="description">
        (You start with 120 MC. Lower your TR 7 steps.)
      </div>
`],
    [CardName.OCEAN_CITY, `
    <div class="card-number">A09</div>
    <div class="content ">
        <div class="requirements ">6 Oceans</div>
        <div class="ares-tile board-space-tile--ocean_city"></div>
        
        <div class="production-box production-box-size2 ">
            <div class="production-prefix minus"></div><div class="energy production "></div><br>
            <div class="production-prefix plus"></div><div class="money production ">3</div>
        </div>

        <div class="description " style="text-align:left;">
          (Requires 6 ocean tiles. Decrease your Energy production 1 step and increase your MC production 3 steps. Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES. The tile counts as a city as well as an ocean.)
     </div>
    </div>
`],
    [CardName.OCEAN_FARM, `
    <div class="card-number">A10</div>
    <div class="content ">
        <div class="ares-tile board-space-tile--ocean_farm"></div>
        <div class="requirements ">4 Oceans</div>
        <div class="production-box production-box-size2 ">
            <div class="production-prefix plus"></div><div class="heat production "></div>
            <div class="production-prefix plus"></div><div class="plant production "></div>
        </div>
        <div class="description " style="text-align:left;">
            (Requires 4 ocean tiles. Increase your heat production 1 step and increase your plant production 1 step. Place this tile on top of an existing ocean tile.  The tile grants an <b>adjacency bonus</b> of 1 plant.)
        </div>
    </div>
`],
    [CardName.OCEAN_SANCTUARY, `
    <div class="card-number">A13</div>
    <div class="content ">
        <div class="points big">1/<div class="resource animal"></div></div>
        <div class="requirements ">5 Oceans</div>
        <div class="ares-tile board-space-tile--ocean_sanctuary"></div>
        <div class="resource animal "></div>
        <div class="description " style="text-align:left;">
            (Requires 5 ocean tiles. Place this tile on top of an existing ocean tile. The tile grants an <b>adjacency bonus</b> of 1 animal.
            <br/>
            Add 1 animal to this card. 1 VP per animal on this card.)
        </div>
    </div>
`],
    [CardName.SOLAR_FARM, `
    <div class="card-number">A14</div>
    <div class="content ">
        <div class="production-box production-box-size2a">
          <div class="energy production"></div> / <div class="resource-tag tag-plant"></div>
        </div>
        <div class="ares-tile board-space-tile--solar_farm"></div>
        <div class="description " style="text-align:left;">
            Place this tile which grants an <b>adjacency bonus</b> of 2 power. Increase your power production 1 step for each plant tag on the area where you place the tile.
        </div>
    </div>
`],
    [CardName.NATURAL_PRESERVE_ARES, `
    <div class="card-number">A21</div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="requirements requirements-max">max 4% O2</div>
      <div class="production-box">
        <div class="money production">1</div>
      </div>
      <div class="ares-tile board-space-tile--natural_preserve_ares"></div>
      <div class="description">
        (Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. The tile grants an <b>adjacency bonus</b> of  of 1M€. Increase your MC production 1 step.)
      </div>
    </div>
`],
    [CardName.NUCLEAR_ZONE_ARES, `
    <div class="card-number">A22</div>
    <div class="content">
      <div class="points points-big">-2</div>
      <div class="ares-tile board-space-tile--nuclear_zone_ares"></div>
      <div class="tile temperature-tile"></div> <div class="tile temperature-tile"></div>
      <div class="description">
        (Raise the temperature two steps. Place this tile. Players must pay an additional 2M€ when they place a tile with their player marker on it adjacent to the Nuclear Zone.)
      </div>
    </div>
`],
    [CardName.RESTRICTED_AREA_ARES, `
    <div class="card-number">A23</div>
    <div class="content ">
        <div class="money resource ">2</div> <div class="red-arrow "></div> <div class="card resource "></div>
        <div class="description ">
            (Action: Spend 2 M€ to draw a card.)
        </div><br>
        <div class="ares-tile board-space-tile--restricted_area_ares"></div>
        <div class="description ">
          (Place this tile which grants an <b>adjacency bonus</b> of 1 card.)
        </div>
    </div>
`],
  ]);
