import { CardName } from "./CardName";

export const HTML_DATA: Map<string, string> =
  new Map ([
    [CardName.COLONIZER_TRAINING_CAMP,`
        <div class="title background-color-automated ">Colonizer Training Camp</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="card-number">001</div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <div class="requirements requirements-max ">max 5% O2</div>
            <div class="description ">
                (Oxygen must be 5% or less.)
            </div>
        </div>
`],
[CardName.ASTEROID_MINING_CONSORTIUM,`
        <div class="title background-color-automated ">Asteroid Mining Consortium</div>
        <div class="price">13</div>
        <div class="tag tag1 tag-jovian"></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">002</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements ">Titanium production</div>
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="titanium production red-outline "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="titanium production "></div>
            </div>
            <div class="description " style="margin-top:0px;">
                (Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.)
            </div>
        </div>
`],
[CardName.DEEP_WELL_HEATING,`
        <div class="title background-color-automated ">Deep Well Heating</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-power "></div>
        <div class="card-number">003</div>
        <div class="content">
            <div class="production-box ">
                <div class="energy production "></div>
            </div>
            <div class="tile temperature-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Increase your Energy production 1 step. Increase temperature 1 step.)
            </div>
        </div>
`],
[CardName.CLOUD_SEEDING,`
        <div class="title background-color-automated ">Cloud Seeding</div>
        <div class="price ">11</div>
        <div class="card-number">004</div>
        <div class="content ">
            <div class="requirements ">3 Oceans</div>
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">1</div><div class="heat production red-outline "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="plant production "></div><div class="plant production "></div>
            </div>
            <div class="description ">
              (Requires 3 ocean tiles. Decrease your MC production 1 step and any heat production 1 step. Increase your Plant production 2 steps.)
            </div>
        </div>
`],
[CardName.SEARCH_FOR_LIFE,`
        <div class="title background-color-active ">Search for Life</div>
        <div class="price ">3</div>
        <div class="tag tag1 tag-science "></div>
        <div class="card-number">005</div>
        <div class="content ">
            <div class="points points-big">3/<div class="resource science"></div></div>
            <div class="requirements requirements-max ">max 6% O2</div>
            <div class=" "><span class=" money resource ">1</span> <span class="red-arrow "></span> <span class="microbe resource "></span>*  :  <div class="resource science"></div> </div>
            <div class="description ">
                (Action: Spend 1 MC to reveal the top card of the draw deck. If that card has a Microbe tag, add a Science resource here.)<br><br>
                (3 VPs if you have one or more Science resources here.)
            </div>
        </div>
`],
[CardName.INVENTORS_GUILD,`
        <div class="title background-color-active ">Inventors' Guild</div>
        <div class="price ">9</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-science "></div>
        <div class="card-number">006</div>
        <div class="content ">
            <span class="red-arrow "></span> <span style="font-size:14px; ">ACTION: LOOK AT THE TOP CARD AND EITHER BUY IT OR DISCARD IT</span>
        </div>
`],
[CardName.MARTIAN_RAILS,`
        <div class="title background-color-active ">Martian Rails</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-building "></div>
        <div class="card-number">007</div>
        <div class="content ">
            <span class="energy resource "></span> <span class="red-arrow "></span>
            <span class=" money resource ">1</span> / <span class="city-tile-small tile red-outline "></span>
            <div class="description ">
                (Action: Spend 1 Energy to gain 1 MC for each City tile ON MARS.)
            </div>
        </div>
`],
[CardName.CAPITAL,`
        <div class="title background-color-automated ">Capital</div>
        <div class="price ">26</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="card-number">008</div>
        <div class="content ">
            <div class="points ">1/<span class="resource ocean-resource "></span></div>
            <div class="requirements ">4 Oceans</div>
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">5</div>
            </div>
            <div class="special-tile tile capitol ">&#x2302;&#xFE0E;</div>
            <div class="description " style="text-align:left;">
                (Requires 4 ocean tiles. Place this tile. Decrease your Energy production 2 steps and increase your MC production 5 steps.<br>
                <div style="font-size:9px;line-height:12px;margin-top:10px; width: 140px;">
                    1 ADDITIONAL VP FOR EACH OCEAN TILE ADJACENT TO THIS CITY TILE.
                </div>
            </div>
        </div>
`],
[CardName.ASTEROID,`
        <div class="title background-color-events ">Asteroid</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="card-number">009</div>
        <div class="content ">
            <div class="tile temperature-tile "></div><br>
            <div class=" titanium resource "></div><div class=" titanium resource "></div><br>
            - <div class="resource plant red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.)
            </div>
        </div>
`],
[CardName.COMET,`
        <div class="title background-color-events ">Comet</div>
        <div class="price ">21</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="card-number">010</div>
        <div class="content ">
            <div class="tile temperature-tile "></div><div class="tile ocean-tile "></div>
            <br>
          - <div class="plant resource red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 1 step and place an ocean tile. Remove up to 3 Plants from any player.)
            </div>
        </div>
`],
[CardName.BIG_ASTEROID,`
        <div class="title background-color-events ">Big Asteroid</div>
        <div class="price ">27</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="card-number">011</div>
        <div class="content ">
            <div class="tile temperature-tile "></div>
            <div class="tile temperature-tile "></div><br>
            <div class="titanium resource "></div><div class="titanium resource "></div><div class="titanium resource "></div><div class="titanium resource "></div> <br>
          - <div class="plant resource red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div><div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 2 steps and gain 4 titanium. Remove up to 4 Plants from any player.)
            </div>
        </div>
`],
[CardName.WATER_IMPORT_FROM_EUROPA,`
        <div class="title background-color-active ">Water Import from Europa</div>
        <div class="price ">25</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="card-number">012</div>
        <div class="content ">
            <div class="points points-big">1/<span class="tag-jovian resource-tag"></span></div>
            <div class=" money resource ">12</div> (<span class="titanium " style="margin:0px;padding:1px;padding-top:3px;border-radius:5px; "></span>)
            <span class="red-arrow "></span> <div class="ocean-tile tile "></div>
            <div class="description ">
                (Action: Pay 12 MC to place an ocean tile. TITANIUM MAY BE USED as if playing a Space card.)<br><br>
                (1 VP for each Jovian tag you have.)
            </div>
        </div>
`],
[CardName.SPACE_ELEVATOR,`
        <div class="title background-color-active ">Space Elevator</div>
        <div class="price ">27</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-building "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">013</div>
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
[CardName.DEVELOPMENT_CENTER,`
        <div class="title background-color-active ">Development Center</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">014</div>
        <div class="content ">
            <span class="energy resource "></span> <span class="red-arrow "></span> <span class="card resource "></span>
            <div class="description ">
                (Action: Spend 1 Energy to draw a card.)
            </div>
        </div>
`],
[CardName.EQUATORIAL_MAGNETIZER,`
        <div class="title background-color-active ">Equatorial Magnetizer</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="card-number">015</div>
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
            </div>
            <span class="red-arrow " style="margin-left:5px; "></span>
            <div class="rating tile "></div>
            <div class="description ">
                (Action: Decrease your Energy production 1 step to increase your terraform rating 1 step.)
            </div>
        </div>
`],
[CardName.DOMED_CRATER,`
        <div class="title background-color-automated ">Domed Crater</div>
        <div class="price ">24</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="card-number">016</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements requirements-max ">max 7% O2</div>
            <div class="production-box production-box-size1a " style="margin-bottom:5px;">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px;margin-bottom:5px;"></div><br>
            <div class="plant resource "></div><div class="plant resource "></div><div class="plant resource "></div>
            <div class="description " style="margin-top:-5px;font-size:11px;text-align: left; line-height: 12px;">
                <div>Oxygen must be 7% or less.</div>
                <div style="width:140px;">Gain 3 plants. Place a City tile. Decrease your Energy production 1 step and increase your MC production 3 steps.</div>
            </div>
        </div>
`],
[CardName.NOCTIS_CITY,`
        <div class="title background-color-automated ">Noctis City</div>
        <div class="price ">18</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="card-number">017</div>
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div><br>
            <div class="description ">
                (Decrease your Energy production 1 step and increase your MC production 3 steps.
                Place a City ON THE RESERVED AREA, disregarding normal placement restrictions.)
            </div>
        </div>
`],
[CardName.METHANE_FROM_TITAN,`
        <div class="title background-color-automated ">Methane from Titan</div>
        <div class="price ">28</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="card-number">018</div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <div class="requirements ">2% O2</div>
            <div class="production-box production-box-size2 ">
                <div class="production heat "></div><div class="production heat "></div>
                <div class="production plant "></div><div class="production plant "></div>
            </div>
            <div class="description ">
                (Requires 2% oxygen. Increase your heat production 2 steps and your Plant production 2 steps.)
            </div>
        </div>
`],
[CardName.IMPORTED_HYDROGEN,`
        <div class="title background-color-events ">Imported Hydrogen</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-earth "></div>
        <div class="card-number">019</div>
        <div class="content ">
            <span>3</span><div class="resource plant "></div> OR <span>3</span><div class="resource microbe "></div>* OR <span>2</span><div class="resource animal "></div>*
            <br><div class="tile ocean-tile "></div>
            <div class="description ">
                (Gain 3 Plants, or add 3 Microbes or 2 Animals to ANOTHER card. Place an ocean tile.)
            </div>
        </div>
`],
[CardName.RESEARCH_OUTPOST,`
        <div class="title background-color-active ">Research Outpost</div>
        <div class="price ">18</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="tag tag3 tag-science "></div>
        <div class="card-number">020</div>
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
[CardName.PHOBOS_SPACE_HAVEN,`
        <div class="title background-color-automated ">Phobos Space Haven</div>
        <div class="price ">25</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="card-number">021</div>
        <div class="content ">
            <div class="points points-big ">3</div>
            <div class="production-box "><div class="titanium production "></div></div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Increase your titanium production 1 step and place a City tile ON THE RESERVED AREA.)
            </div>
        </div>
`],
[CardName.BLACK_POLAR_DUST,`
        <div class="title background-color-automated ">Black Polar Dust</div>
        <div class="price ">15</div>
        <div class="card-number">022</div>
        <div class="content ">
            <div class="production-box production-box-size3a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">2</div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="heat production "></div><div class="heat production "></div><div class="heat production "></div>
            </div>
            <div class="tile ocean-tile "></div>
            <div class="description ">
                (Place an ocean tile. Decrease your MC production 2 steps and increase your heat production 3 steps.)
            </div>
        </div>
`],
[CardName.ARCTIC_ALGAE,`
        <div class="title background-color-active ">Arctic Algae</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-plant "></div>
        <div class="card-number">023</div>
        <div class="content ">
            <div class="requirements requirements-max ">max -12 C </div>
            <div class="tile ocean-tile red-outline "></div> : <div class="resource plant "></div><div class="resource plant "></div><br>
            <div class="description ">
                (Effect: When anyone places an ocean tile, gain 2 Plants.)
            </div>
            <div class="resource plant "></div>
            <div class="description ">
                (It must be -12 C or colder to play. Gain 1 Plant.)
            </div>
        </div>
`],
[CardName.PREDATORS,`
        <div class="title background-color-active ">Predators</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-animal "></div>
        <div class="card-number">024</div>
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
[CardName.SPACE_STATION,`
        <div class="title background-color-active ">Space Station</div>
        <div class="price ">10</div>
        <div class="tag tag1 tag-space "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">025</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
        </div>
`],
[CardName.EOS_CHASMA_NATIONAL_PARK,`
        <div class="title background-color-automated ">Eos Chasma National Park</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-plant "></div>
        <div class="card-number">026</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements">-12 C</div>
            <div class="resource animal "></div>*<div class="resource plant " style="margin-left:15px "></div><div class="resource plant "></div><div class="resource plant "></div><br>
            <div class="production-box production-box ">
                <div class="money production ">2</div>
            </div>
            <div class="description ">
                (Requires -12 C or warmer. Add 1 Animal TO ANY ANIMAL CARD. Gain 3 Plants. Increase your MC production 2 steps.)
            </div>
        </div>
`],
[CardName.INTERSTELLAR_COLONY_SHIP,`
        <div class="title background-color-events ">Interstellar Colony Ship</div>
        <div class="price ">24</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-earth "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">027</div>
        <div class="content ">
            <div class="points points-big ">4</div>
            <div class="requirements ">5 Science</div>
        </div>
`],
[CardName.SECURITY_FLEET,`
        <div class="title background-color-active ">Security Fleet</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-space "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">028</div>
        <div class="content ">
            <div class="points ">1/<div class="resource " style="padding-bottom:2px;padding-top:2px;font-size:22px;background-color:rgb(230,230,230);font-weight:normal ">&#x1F680;&#xFE0E;</div></div>
            <div class="resource titanium "></div> <span class="red-arrow "></span> <div class="resource " style="padding-bottom:2px;padding-top:2px;font-size:22px;background-color:rgb(230,230,230);font-weight:normal ">&#x1F680;&#xFE0E;</div>
            <div class="description ">
                (Action: Spend 1 titanium to add 1 fighter resource to this card.)
            </div>
            <div class="description ">
                (1 VP for each fighter resource on this card.) <br>
            </div>
        </div>
`],
[CardName.CUPOLA_CITY,`
        <div class="title background-color-automated ">Cupola City</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="card-number">029</div>
        <div class="content ">
            <div class="requirements requirements-max ">max 9% O2</div>
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Oxygen must be 9% or less. Place a City tile. Decrease your Energy production 1 step and increase your MC production 3 steps.)
            </div>
        </div>
`],
[CardName.LUNAR_BEAM,`
        <div class="title background-color-automated ">Lunar Beam</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-power "></div>
        <div class="tag tag2 tag-earth "></div>
        <div class="card-number">030</div>
        <div class="content ">
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">2</div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="heat production "></div><div class="heat production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div>
            </div>
            <div class="description ">
                (Decrease your MC production 2 steps and increase your heat production and Energy production 2 steps each.)
            </div>
        </div>
`],
[CardName.OPTIMAL_AEROBRAKING,`
        <div class="title background-color-active ">Optimal Aerobraking</div>
        <div class="price ">7</div>
        <div class="tag tag1 tag-space "></div>
        <div class="card-number">031</div>
        <div class="content ">
            <div class="resource-tag tag-space "></div> <div class="resource-tag tag-event "></div> : <div class="resource money ">3</div><div class="resource heat "></div><div class="resource heat "></div><div class="resource heat "></div>
            <div class="description ">
                (Effect: When you play a Space Event, you gain 3 MC and 3 heat.)
            </div>
        </div>
`],
[CardName.UNDERGROUND_CITY,`
        <div class="title background-color-automated ">Underground City</div>
        <div class="price ">18</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
        <div class="card-number">032</div>
        <div class="content ">
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="steel production "></div><div class="steel production "></div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div>
            <div class="description ">
                (Place a City tile. Decrease your Energy production 2 steps and increase your steel production 2 steps.)
            </div>
        </div>
`],
[CardName.REGOLITH_EATERS,`
        <div class="title background-color-active ">Regolith Eaters</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-microbe "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="card-number">033</div>
        <div class="content ">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile oxygen-tile "></div>
            <div class="description ">
                (Action: Add 1 Microbe to this card, or remove 2 Microbes from this card to raise oxygen level 1 step.)
            </div>
        </div>
`],
[CardName.GHG_PRODUCING_BACTERIA,`
        <div class="title background-color-active ">GHG Producing Bacteria</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-microbe "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="card-number">034</div>
        <div class="content ">
            <div class="requirements ">4% O2</div>
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile temperature-tile "></div>
            <div class="description ">
                (Action: Add 1 Microbe to this card, or remove 2 Microbes to raise temperature 1 step.)<br><br>
                (Requires 4% oxygen.)
            </div>
        </div>
`],
[CardName.ANTS,`
        <div class="title background-color-active ">Ants</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-microbe "></div>
        <div class="card-number">035</div>
        <div class="content ">
            <div class="points ">1/2<div class="resource microbe "></div></div>
            <div class="requirements ">4% O2</div>
            <div class="microbe resource red-outline "></div> <div class="red-arrow "></div> <div class="microbe resource "></div>
            <div class="description ">
                (Action: Remove 1 Microbe from any card to add 1 to this card.)
                <br><br>
                (Requires 4% oxygen. 1 VP per 2 Microbes on this card.)
            </div>
        </div>
`],
[CardName.RELEASE_OF_INERT_GASES,`
        <div class="title background-color-events ">Release of Inert Gases</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-event "></div>
        <div class="card-number">036</div>
        <div class="content ">
            <div class="tile rating "></div>  <div class="tile rating "></div>
            <div class="description ">
                (Raise your terraform rating 2 steps.)
            </div>
        </div>
`],
[CardName.NITROGEN_RICH_ASTEROID,`
        <div class="title background-color-events ">Nitrogen-Rich Asteroid</div>
        <div class="price ">31</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="card-number">037</div>
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
[CardName.ROVER_CONSTRUCTION,`
    <div class="title background-color-active">Rover Construction</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-building"></div>
    <div class="card-number">038</div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="tile city-tile-small red-outline"></div> :
      <div class="money resource">2</div>
      <div class="description">
        (Effect: When any City tile is placed, gain 2 MC.)
      </div>
    </div>
`],
[CardName.DEIMOS_DOWN,`
    <div class="title background-color-events">Deimos Down</div>
    <div class="price">31</div>
    <div class="tag tag1 tag-event"></div>
    <div class="tag tag2 tag-space"></div>
    <div class="card-number">039</div>
    <div class="content">
      <div class="tile temperature-tile"></div>
      <div class="tile temperature-tile"></div>
      <div class="tile temperature-tile"></div><br>
      <div class=" steel resource"></div><div class=" steel resource"></div><div class=" steel resource"></div><div class=" steel resource"></div><br>
      -8 <div class="resource plant red-outline"></div>
      <div class="description">
        (Raise temperature 3 steps and gain 4 steel. Remove up to 8 Plants from any player.)
      </div>
    </div>
`],
[CardName.ASTEROID_MINING,`
    <div class="title background-color-automated">Asteroid Mining</div>
    <div class="price">30</div>
    <div class="tag tag1 tag-space"></div>
    <div class="tag tag2 tag-jovian"></div>
    <div class="card-number">040</div>
    <div class="content">
      <div class="points points-big">2</div>
      <div class="production-box production-box-size2">
        <div class="production titanium"></div><div class="production titanium"></div>
      </div>
      <div class="description">
        (Increase your titanium production 2 steps.)
      </div>
    </div>
`],
[CardName.FOOD_FACTORY,`
    <div class="title background-color-automated">Food Factory</div>
    <div class="price">12</div>
    <div class="tag tag1 tag-building"></div>
    <div class="card-number">041</div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="production-box production-box-size1a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production"></div>
        <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">4</div>
      </div>
      <div class="description">
        (Decrease your Plant production 1 step and increase your MC production 4 steps.)
      </div>
    </div>
`],
[CardName.ARCHAEBACTERIA,`
    <div class="title background-color-automated">Archaebacteria</div>
    <div class="price">6</div>
    <div class="tag tag1 tag-microbe"></div>
    <div class="card-number">042</div>
    <div class="content">
      <div class="requirements requirements-max">max -18 C</div>
      <div class="production-box">
        <div class="plant production"></div>
      </div>
      <div class="description">
        (It must be -18 C or colder. Increase your Plant production 1 step.)
      </div>
    </div>
`],
[CardName.CARBONATE_PROCESSING,`
    <div class="title background-color-automated">Carbonate Processing</div>
    <div class="price">6</div>
    <div class="tag tag1 tag-building"></div>
    <div class="card-number">043</div>
    <div class="content">
      <div class="production-box production-box-size3a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
        <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="heat production"></div><div class="heat production"></div><div class="heat production"></div>
      </div>
      <div class="description">
        (Decrease your Energy production 1 step and increase your heat production 3 steps.)
      </div>
    </div>
`],
[CardName.NATURAL_PRESERVE,`
    <div class="title background-color-automated">Natural Preserve</div>
    <div class="price">9</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-science"></div>
    <div class="card-number">044</div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="requirements requirements-max">max 4% O2</div>
      <div class="production-box">
        <div class="money production">1</div>
      </div>
      <div class="tile special-tile" style="font-size:30px;margin-left:20px;">&#x2642;</div>*
      <div class="description">
        (Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your MC production 1 step.)
      </div>
    </div>
`],
[CardName.NUCLEAR_POWER,`
    <div class="title background-color-automated">Nuclear Power</div>
    <div class="price">10</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-power"></div>
    <div class="card-number">045</div>
    <div class="content">
      <div class="production-box production-box-size3a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">2</div><br>
        <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
      </div>
      <div class="description">
        (Decrease your MC production 2 steps and increase your Energy production 3 steps.)
      </div>
    </div>
`],
[CardName.LIGHTNING_HARVEST,`
    <div class="title background-color-automated">Lightning Harvest</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-power"></div>
    <div class="corporate-icon project-icon"></div>
    <div class="card-number">046</div>
    <div class="content">
      <div class="points points-big">1</div>
      <div class="requirements">3 Science</div>
      <div class="production-box production-box-size2">
        <div class="energy production"></div><div class="money production">1</div>
      </div>
      <div class="description">
        (Requires 3 Science tags. Increase your Energy production and your MC production up one step each.)
      </div>
    </div>
`],
[CardName.ALGAE,`
    <div class="title background-color-automated">Algae</div>
    <div class="price">10</div>
    <div class="tag tag1 tag-plant"></div>
    <div class="card-number">047</div>
    <div class="content">
      <div class="requirements">5 Oceans</div>
      <div class="production-box production-box-size2">
        <div class="plant production"></div><div class="plant production"></div>
      </div>
      <div class="plant resource" style="margin-left:20px"></div>
      <div class="description">
        (Requires 5 ocean tiles. Gain 1 Plant and increase your Plant production 2 steps.)
      </div>
    </div>
`],
[CardName.ADAPTED_LICHEN,`
    <div class="title background-color-automated">Adapted Lichen</div>
    <div class="price">9</div>
    <div class="tag tag1 tag-plant"></div>
    <div class="card-number">048</div>
    <div class="content">
      <div class="production-box">
        <div class="plant production"></div>
      </div>
      <div class="description">
        (Increase your Plant production 1 step.)
      </div>
    </div>
`],
[CardName.TARDIGRADES,`
      <div class="title background-color-active">Tardigrades</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-microbe"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">049</div>
      <div class="content">
        <div class="points">1/4<div class="resource microbe"></div>
        </div>
        <div class="red-arrow"></div>
        <div class="microbe resource"></div><br>
        <div class="description">
          (Action: Add 1 Microbe to this card.)
          <br><br> (1 VP per 4 Microbes on this card.)
        </div>
      </div>
`],
[CardName.VIRUS,`
      <div class="title background-color-events">Virus</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-event"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">050</div>
      <div class="content">
        -2<div class="resource animal red-outline"></div> OR -5<div class="resource plant red-outline"></div>
        <div class="description">
          (Remove up to 2 Animals or 5 Plants from any player.)
        </div>
      </div>
`],
[CardName.MIRANDA_RESORT,`
      <div class="title background-color-automated">Miranda Resort</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-space"></div>
      <div class="tag tag2 tag-jovian"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">051</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="production-box production-box-size2a">
          <div class="production money">1</div> / <div class="resource-tag tag-earth"></div>
        </div>
        <div class="description">
          (Increase your MC production 1 step for each Earth tag you have.)
        </div>
      </div>
`],
[CardName.FISH,`
      <div class="title background-color-active">Fish</div>
      <div class="price">9</div>
      <div class="tag tag1 tag-animal"></div>
      <div class="card-number">052</div>
      <div class="content">
        <div class="points">1/<div class="animal resource"></div>
        </div>
        <div class="requirements">+2 C</div>
        <span class="red-arrow"></span>
        <div class="animal resource"></div>
        <div class="description">
          (Action: Add 1 Animal to this card.)
        </div><br>
        <div class="production-box production-box-size1a" style="margin-top:-10px;">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
        </div>
        <div class="description description-half">
          (Requires +2 C or warmer. Decrease any Plant production 1 step. 1 VP for each Animal on this card.)
        </div>
      </div>
`],
[CardName.LAKE_MARINERIS,`
      <div class="title background-color-automated">Lake Marineris</div>
      <div class="price">18</div>
      <div class="card-number">053</div>
      <div class="content">
        <div class="points points-big">2</div>
        <div class="requirements">0 C</div>
        <div class="tile ocean-tile"></div>
        <div class="tile ocean-tile"></div><br>
        <div class="description">
          (Requires 0 C or warmer. Place 2 ocean tiles.)
        </div>
      </div>
`],
[CardName.SMALL_ANIMALS,`
      <div class="title background-color-active">Small Animals</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-animal"></div>
      <div class="card-number">054</div>
      <div class="content">
        <div class="points">1/2<div class="animal resource"></div>
        </div>
        <div class="requirements">6% O2</div>
        <span class="red-arrow"></span>
        <div class="animal resource"></div>
        <div class="description" style="margin-bottom:5px;">
          (Action: Add 1 Animal to this card.)
        </div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
        </div>
        <div class="description" style="text-align:left;">
          <div>Requires 6% oxygen.</div>
          <div style="width: 135px;">Decrease any Plant production 1 step. 1 VP per 2 Animals on this card.</div>
        </div>
      </div>
`],
[CardName.KELP_FARMING,`
      <div class="title background-color-automated">Kelp Farming</div>
      <div class="price">17</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">055</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">6 Oceans</div>
        <div class="production-box production-box-size3">
          <div class="money production">2</div><br>
          <div class="plant production"></div><div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px"></div>
        <div class="plant resource"></div>
        <div class="description">
          (Requires 6 ocean tiles. Increase your MC production 2 steps and your Plant production 3 steps. Gain 2 Plants.)
        </div>
      </div>
`],
[CardName.MINE,`
      <div class="title background-color-automated">Mine</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">056</div>
      <div class="content">
        <div class="production-box">
          <div class="steel production"></div>
        </div>
        <div class="description">
          (Increase your steel production 1 step.)
        </div>
      </div>
`],
[CardName.VESTA_SHIPYARD,`
      <div class="title background-color-automated">Vesta Shipyard</div>
      <div class="price">15</div>
      <div class="tag tag1 tag-space"></div>
      <div class="tag tag2 tag-jovian"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">057</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="production-box">
          <div class="production titanium"></div>
        </div>
        <div class="description">
          (Increase your titanium production 1 step.)
        </div>
      </div>
`],
[CardName.BEAM_FROM_A_THORIUM_ASTEROID,`
      <div class="title background-color-automated">Beam from a Thorium Asteroid</div>
      <div class="price">32</div>
      <div class="tag tag1 tag-power"></div>
      <div class="tag tag2 tag-space"></div>
      <div class="tag tag3 tag-jovian"></div>
      <div class="card-number">058</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">Jovian</div>
        <div class="production-box production-box-size3">
          <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div><br>
          <div class="production energy"></div><div class="production energy"></div><div class="production energy"></div>
        </div>
        <div class="description">
          (Requires a Jovian tag. Increase your heat production and Energy production 3 steps each.)
        </div>
      </div>
`],
[CardName.MANGROVE,`
      <div class="title background-color-automated">Mangrove</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">059</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">+4 C</div>
        <div class="tile greenery-tile"></div>
        <div class="description">
          (Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.)
        </div>
      </div>
`],
[CardName.TREES,`
      <div class="title background-color-automated">Trees</div>
      <div class="price">13</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">060</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">-4 C</div>
        <div class="production-box production-box-size3">
          <div class="plant production"></div><div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px"></div>
        <div class="description">
          (Requires -4 C or warmer. Increase your Plant production 3 steps. Gain 1 Plant.)
        </div>
      </div>
`],
[CardName.GREAT_ESCARPMENT_CONSORTIUM,`
      <div class="title background-color-automated" style="font-size:14px;">Great Escarpment Consortium</div>
      <div class="price">6</div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">061</div>
      <div class="content">
        <div class="requirements">Steel production</div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="production steel red-outline"></div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="production steel"></div>
        </div>
        <div class="description">
          (Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.)
        </div>
      </div>
`],
[CardName.MINERAL_DEPOSIT,`
        <div class="title background-color-events ">Mineral Deposit</div>
        <div class="price ">5</div>
        <div class="tag tag1 tag-event "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">062</div>
        <div class="content ">
            5<div class="resource steel"></div>
            <div class="description ">
                (Gain 5 steel.)
            </div>
        </div>
`],
[CardName.MINING_EXPEDITION,`
        <div class="title background-color-events ">Mining Expedition</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-event "></div>
      <div class="card-number">063</div>
        <div class="content ">
          <div class="tile oxygen-tile"></div><br>
            <div class="resource steel"></div><div class="resource steel"></div>
            <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>
            <div class="description ">
                (Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.)
            </div>
        </div>
`],
[CardName.MINING_AREA,`
      <div class="title background-color-automated">Mining Area</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">064</div>
      <div class="content">
        <div class="tile special-tile" style="font-size:40px;color: rgb(73,54,40);">&#x2692;</div>*<br>
        <div class="production-box production-box-size3">
          <div class="steel production"></div> OR <div class="titanium production"></div>
        </div> *
        <div class="description">
          (Place this tile on an area with a steel or titanium placement bonus, adjacent to another of your tiles. Increase your production of that resource 1 step.)
        </div>
      </div>
`],
[CardName.BUILDING_INDUSTRIES,`
      <div class="title background-color-automated">Building Industries</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">065</div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="steel production"></div><div class="steel production"></div>
        </div>
        <div class="description">
          (Decrease your Energy production 1 step and increase your steel production 2 steps.)
        </div>
      </div>
`],
[CardName.LAND_CLAIM,`
        <div class="title background-color-events ">Land Claim</div>
        <div class="price ">1</div>
        <div class="tag tag1 tag-event"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">066</div>
        <div class="content " style="font-size:14px;">
            PLACE YOUR MARKER ON A NON-RESERVED AREA. ONLY YOU MAY PLACE A TILE HERE.
        </div>
`],
[CardName.MINING_RIGHTS,`
      <div class="title background-color-automated">Mining Rights</div>
      <div class="price">9</div>
      <div class="tag tag1 tag-building"></div>
      <div class="card-number">067</div>
      <div class="content">
        <div class="tile special-tile" style="font-size:40px;color: rgb(73,54,40);">&#x2692;</div>*<br>
        <div class="production-box production-box-size3">
          <div class="steel production"></div> OR <div class="titanium production"></div>
        </div> *
        <div class="description">
          (Place this tile on an area with a steel or titanium placement bonus. Increase that production 1 step.)
        </div>
      </div>
`],
[CardName.SPONSORS,`
      <div class="title background-color-automated">Sponsors</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">068</div>
      <div class="content">
        <div class="production-box">
          <div class="money production">2</div>
        </div>
        <div class="description">
          (Increase your MC production 2 steps.)
        </div>
      </div>
`],
[CardName.ELECTRO_CATAPULT,`
      <div class="title background-color-active">Electro Catapult</div>
      <div class="price">17</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">069</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements requirements-max">max 8% O2</div>
        <div class="resource plant"></div> / <div class="resource steel"></div> <div class="red-arrow"></div> <div class="resource money">7</div><br>
        <div class="description" style="margin-top:-5px;margin-bottom:2px;">
          (Action: Spend 1 plant or 1 steel to gain 7MC.)
        </div>
        <div class="production-box production-box-size1a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production"></div>
        </div>
        <div class="description" style="text-align:left;">
          (Oxygen must be 8% or less. Decrease your energy production 1 step.)
        </div>
      </div>
`],
[CardName.EARTH_CATAPULT,`
        <div class="title background-color-active ">Earth Catapult</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-earth"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">070</div>
        <div class="content ">
          <div class="points points-big">2</div>
            : <span class="money resource ">-2</span>
            <div class="description ">
                (Effect: When you play a card, you pay 2 MC less for it.)
            </div>
        </div>
`],
[CardName.ADVANCED_ALLOYS,`
        <div class="title background-color-active ">Advanced Alloys</div>
        <div class="price ">9</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-science "></div>
      <div class="card-number">071</div>
        <div class="content ">
          <div class="resource titanium"></div> : +<div class="resource money">1</div><br>
          <div class="resource steel"></div> : +<div class="resource money">1</div>
          <div class="description">
            (Effect: Each titanium you have is worth 1 MC extra. Each steel you have is worth 1 MC extra. )
          </div>
        </div>
`],
[CardName.BIRDS,`
        <div class="title background-color-active ">Birds</div>
        <div class="price ">10</div>
        <div class="tag tag1 tag-animal "></div>
      <div class="card-number">072</div>
        <div class="content ">
            <div class="points ">1/<div class="animal resource "></div></div>
            <div class="requirements" style="margin-bottom:5px;">13% O2</div>
            <span class="red-arrow "></span> <div class="animal resource "></div>
            <div class="description " style="margin-top:-5px;margin-bottom:5px;">
                (Action: Add an animal to this card.)
            </div>
            <div class="production-box production-box-size2a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div><div class="plant production red-outline"></div>
            </div>
            <div class="description"  style="margin-top:-5px;">
                (Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per Animal on this card.)
            </div>
        </div>
`],
[CardName.MARS_UNIVERSITY,`
        <div class="title background-color-active ">Mars University</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">073</div>
        <div class="content ">
          <div class="points points-big">1</div>
            <div class="resource-tag science"></div> : - <span class="card resource "></span> + <span class="card resource "></span>
            <div class="description ">
                (Effect: When you play a Science tag, including this, you may discard a card from hand to draw a card.)
            </div>
        </div>
`],
[CardName.VIRAL_ENHANCERS,`
        <div class="title background-color-active ">Viral Enhancers</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-microbe"></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">074</div>
        <div class="content ">
            <div class="resource-tag tag-plant"></div> / <div class="resource-tag tag-microbe"></div> / <div class="resource-tag tag-animal"></div> : <br><br>
            <div class="plant resource"></div> / <div class="microbe resource"></div>* / <div class="animal resource"></div>*
            <div class="description ">
                (Effect: When you play a plant, microbe, or an animal tag, including this, gain 1 plant or add 1 resource to THAT CARD.)
            </div>
        </div>
`],
[CardName.TOWING_A_COMET,`
        <div class="title background-color-events ">Towing a Comet</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
      <div class="card-number">075</div>
        <div class="content ">
            <div class="tile oxygen-tile "></div><div class="tile ocean-tile "></div>
            <br>
            <div class="plant resource"></div><div class="plant resource"></div>
            <div class="description ">
                (Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.)
            </div>
        </div>
`],
[CardName.SPACE_MIRRORS,`
        <div class="title background-color-active ">Space Mirrors</div>
        <div class="price ">3</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-power "></div>
      <div class="card-number">076</div>
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
[CardName.SOLAR_WIND_POWER,`
        <div class="title background-color-automated ">Solar Wind Power</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-power "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-science "></div>
      <div class="card-number">077</div>
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
[CardName.ICE_ASTEROID,`
        <div class="title background-color-events ">Ice Asteroid</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
      <div class="card-number">078</div>
        <div class="content ">
            <div class="tile ocean-tile "></div><div class="tile ocean-tile "></div>
            <div class="description ">
                (Place 2 ocean tiles.)
            </div>
        </div>
`],
[CardName.QUANTUM_EXTRACTOR,`
        <div class="title background-color-active ">Quantum Extractor</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-power"></div>
        <div class="tag tag2 tag-science"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">079</div>
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
[CardName.GIANT_ICE_ASTEROID,`
        <div class="title background-color-events ">Giant Ice Asteroid</div>
        <div class="price ">36</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
      <div class="card-number">080</div>
        <div class="content ">
            <div class="tile temperature-tile "></div><div class="tile temperature-tile "></div> <br>
            <div class="tile ocean-tile "></div><div class="tile ocean-tile "></div>
            <br>
            -6<div class="plant resource red-outline "></div>
            <div class="description ">
                (Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.)
            </div>
        </div>
`],
[CardName.GANYMEDE_COLONY,`
        <div class="title background-color-automated ">Ganymede Colony</div>
        <div class="price ">20</div>
        <div class="tag tag1 tag-city"></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-jovian "></div>
      <div class="card-number">081</div>
        <div class="content ">
            <div class="points points-big ">1/<span class="resource-tag tag-jovian"></span></div>
            <div class="tile city-tile"></div>*
            <div class="description ">
                (Place a city tile ON THE RESERVED AREA. 1 VP per Jovian tag you have.)
            </div>
        </div>
`],
[CardName.CALLISTO_PENAL_MINES,`
        <div class="title background-color-automated ">Callisto Penal Mines</div>
        <div class="price ">24</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">082</div>
        <div class="content ">
            <div class="points points-big">2</div>
            <div class="production-box"><div class="production money">3</div></div>
            <div class="description ">
                (Increase your MC production 3 steps.)
            </div>
        </div>
`],
[CardName.GIANT_SPACE_MIRROR,`
        <div class="title background-color-automated ">Giant Space Mirror</div>
        <div class="price ">17</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-power "></div>
      <div class="card-number">083</div>
        <div class="content ">
            <div class="production-box production-box-size3"><div class="production energy"></div><div class="production energy"></div><div class="production energy"></div></div>
            <div class="description ">
                (Increase your energy production 3 steps.)
            </div>
        </div>
`],
[CardName.TRANS_NEPTUNE_PROBE,`
        <div class="title background-color-automated ">Trans-Neptune Probe</div>
        <div class="price ">6</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">084</div>
        <div class="content ">
          <div class="points points-big">1</div>
        </div>
`],
[CardName.COMMERCIAL_DISTRICT,`
        <div class="title background-color-automated ">Commercial District</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-building "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">085</div>
        <div class="content ">
          <div class="points big">1/<div class="tile city-tile-small"></div></div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
              <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">4</div>
          </div>
          <div class="description" style="margin-top:-5px">
          (Decrease your energy production 1 step and increase your MC production 4 steps.)
          </div>
          <div class="tile special-tile">&#x20ac;</div>
          <div class="description" style="text-align:left; width: 140px;">
          (Place this tile. 1 VP PER ADJACENT CITY TILE.)
          </div>
        </div>
`],
[CardName.ROBOTIC_WORKFORCE,`
        <div class="title background-color-automated ">Robotic Workforce</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">086</div>
        <div class="content ">
          COPY A &nbsp; <div class="production-box"><div  class="resource-tag tag-building"></div></div>
          <div class="description">
          (Duplicate only the production box of one of your building cards.)
          </div>
        </div>
`],
[CardName.GRASS,`
      <div class="title background-color-automated">Grass</div>
      <div class="price">11</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">087</div>
      <div class="content">
        <div class="requirements">-16 C</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px;"></div><div class="plant resource"></div><div class="plant resource"></div>
        <div class="description">
          (Requires -16 C or warmer. Increase your plant production 1 step. Gain 3 plants.)
        </div>
      </div>
`],
[CardName.HEATHER,`
      <div class="title background-color-automated">Heather</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">088</div>
      <div class="content">
        <div class="requirements">-14 C</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px;"></div>
        <div class="description">
          (Requires -14 C or warmer. Increase your plant production 1 step. Gain 1 plant.)
        </div>
      </div>
`],
[CardName.PEROXIDE_POWER,`
      <div class="title background-color-automated">Peroxide Power</div>
      <div class="price">7</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="card-number">089</div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">1</div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Decrease your MC production 1 step and increase your Energy production 2 steps.)
        </div>
      </div>
`],
[CardName.RESEARCH,`
        <div class="title background-color-automated ">Research</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-science "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">090</div>
        <div class="content ">
          <div class="points points-big">1</div>
          <div class="resource card"></div> <div class="resource card"></div>
          <div class="description">
          (Counts as playing 2 science cards. Draw 2 cards.)
          </div>
        </div>
`],
[CardName.GENE_REPAIR,`
        <div class="title background-color-automated ">Gene Repair</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">091</div>
        <div class="content ">
          <div class="points points-big">2</div>
          <div class="requirements">3 Science</div>
          <div class="production-box"><div  class="production money">2</div></div>
          <div class="description">
          (Requires 3 science tags. Increase your MC production 2 steps.)
          </div>
        </div>
`],
[CardName.IO_MINING_INDUSTRIES,`
        <div class="title background-color-automated ">IO Mining Industries </div>
        <div class="price ">41</div>
        <div class="tag tag1 tag-space "></div>
        <div class="tag tag2 tag-jovian "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">092</div>
        <div class="content ">
            <div class="points points-big">1/<span class="tag-jovian resource-tag "></span></div>
            <div class="production-box production-box-size3">
            <div class="production titanium"></div><div class="production titanium"></div><div class="production money">2</div>
            </div>
            <div class="description ">
                (Increase your titanium production 2 steps and your MC production 2 steps. 1 VP per Jovian tag you have.)
            </div>
        </div>
`],
[CardName.BUSHES,`
      <div class="title background-color-automated">Bushes</div>
      <div class="price">10</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">093</div>
      <div class="content">
        <div class="requirements">-10 C</div>
        <div class="production-box production-box-size2">
          <div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px;"></div><div class="plant resource"></div>
        <div class="description">
          (Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants.)
        </div>
      </div>
`],
[CardName.MASS_CONVERTER,`
        <div class="title background-color-active ">Mass Converter</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-power "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">094</div>
        <div class="content ">
          <div class="requirements">5 Science</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
            <div class="production-box production-box-size1a" style="margin-top:10px">
              6 <div class="energy production"></div>
            </div>
            <div class="description ">
                (Requires 5 science tags. Increase your energy production 6 steps.)
            </div>
        </div>
`],
[CardName.PHYSICS_COMPLEX,`
        <div class="title background-color-active ">Physics Complex</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-science "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">095</div>
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
[CardName.GREENHOUSES,`
        <div class="title background-color-automated ">Greenhouses</div>
        <div class="price ">6</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-plant "></div>
        <div class="card-number">096</div>
        <div class="content ">
            <div class="resource plant"></div> / <div class="tile city-tile red-outline"></div>
            <div class="description ">
                (Gain 1 plant for each city tile in play.)
            </div>
        </div>
`],
[CardName.NUCLEAR_ZONE,`
      <div class="title background-color-automated">Nuclear Zone</div>
      <div class="price">10</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="card-number">097</div>
      <div class="content">
        <div class="points points-big">-2</div>
          <div class="tile special-tile" style="font-size:40px;">&#x2622;</div><br>
          <div class="tile temperature-tile"></div> <div class="tile temperature-tile"></div>
        <div class="description">
          (Place this tile and raise temperature 2 steps.)
        </div>
      </div>
`],
[CardName.TROPICAL_RESORT,`
      <div class="title background-color-automated">Tropical Resort</div>
      <div class="price">13</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">098</div>
      <div class="content">
        <div class="points points-big">2</div>
        <div class="production-box production-box-size2a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="heat production"></div><div class="heat production"></div><br>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production">3</div>
        </div>
        <div class="description">
          (Reduce your heat production 2 steps and increase your MC production 3 steps.)
        </div>
      </div>
`],
[CardName.TOLL_STATION,`
      <div class="title background-color-automated">Toll Station</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-space"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">099</div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production money">1</div> / <div class="resource-tag tag-space red-outline"></div>
        </div>
        <div class="description">
          (Increase your MC production 1 step for each space tag your OPPONENTS have.)
        </div>
      </div>
`],
[CardName.FUELED_GENERATORS,`
      <div class="title background-color-automated">Fueled Generators</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="card-number">100</div>
      <div class="content">
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">1</div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
        </div>
        <div class="description">
          (Decrease your MC production 1 step and increase your Energy production 1 steps.)
        </div>
      </div>
`],
[CardName.IRONWORKS,`
        <div class="title background-color-active ">Ironworks</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
      <div class="card-number">101</div>
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="steel resource "></div><div class="tile oxygen-tile"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 1 steel and raise oxygen 1 step.)
            </div>
        </div>
`],
[CardName.POWER_GRID,`
      <div class="title background-color-automated">Power Grid</div>
      <div class="price">18</div>
      <div class="tag tag1 tag-power"></div>
      <div class="card-number">102</div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="energy production"></div> / <div class="resource-tag tag-power"></div>
        </div>
        <div class="description">
          (Increase your Energy production step for each Power tag you have, including this.)
        </div>
      </div>
`],
[CardName.STEELWORKS,`
        <div class="title background-color-active ">Steelworks</div>
        <div class="price ">15</div>
        <div class="tag tag1 tag-building "></div>
      <div class="card-number">103</div>
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="steel resource "></div><div class="resource steel"></div> <div class="tile oxygen-tile" style="margin-left:0px;"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 2 steel and increase oxygen 1 step.)
            </div>
        </div>
`],
[CardName.ORE_PROCESSOR,`
        <div class="title background-color-active ">Ore Processor</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-building "></div>
      <div class="card-number">104</div>
        <div class="content ">
            4 <span class="energy resource "></span> <span class="red-arrow "></span>
            <div class="titanium resource "></div><div class="tile oxygen-tile"></div>
            <div class="description ">
                (Action: Spend 4 energy to gain 1 titanium and increase oxygen 1 step.)
            </div>
        </div>
`],
[CardName.EARTH_OFFICE,`
        <div class="title background-color-active ">Earth Office</div>
        <div class="price ">1</div>
        <div class="tag tag1 tag-earth "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">105</div>
        <div class="content ">
            <div class="resource-tag tag-earth"></div> : <div class="money resource ">-3</div>
            <div class="description ">
                (Effect: When you play an Earth card, you pay 3 MC less for it.)
            </div>
        </div>
`],
[CardName.ACQUIRED_COMPANY,`
      <div class="title background-color-automated">Acquired Company</div>
      <div class="price">10</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">106</div>
      <div class="content">
        <div class="production-box">
          <div class="money production">3</div>
        </div>
        <div class="description">
          (Increase your MC production 3 steps.)
        </div>
      </div>
`],
[CardName.MEDIA_ARCHIVES,`
      <div class="title background-color-automated">Media Archives</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">107</div>
      <div class="content">
          <div class="money resource">1</div> / <div class="resource-tag tag-event red-outline"></div>
        <div class="description">
          (Gain 1 MC for each event EVER PLAYED by all players.)
        </div>
      </div>
`],
[CardName.OPEN_CITY,`
        <div class="title background-color-automated ">Open City</div>
        <div class="price ">23</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
      <div class="card-number">108</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements">12% O2</div>
            <div class="production-box production-box-size1a " style="margin-bottom:5px;">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">4</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px;margin-bottom:5px; "></div><br>
            <div class="plant resource "></div><div class="plant resource "></div>
            <div class="description " style="margin-top:-8px;font-size:11px;text-align: left">
                <div>Requires 12% oxygen. Gain 2 plants. Place a City tile.</div>
                <div style="width: 135px">Decrease your Energy production 1 step and increase your MC production 4 steps.</div>
            </div>
        </div>
`],
[CardName.MEDIA_GROUP,`
        <div class="title background-color-active ">Media Group</div>
        <div class="price ">6</div>
        <div class="tag tag1 tag-earth "></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">109</div>
        <div class="content ">
            <div class="resource-tag tag-event"></div> : <div class="money resource ">3</div>
            <div class="description ">
                (Effect: After you play an event card, you gain 3MC.)
            </div>
        </div>
`],
[CardName.BUSINESS_NETWORK,`
        <div class="title background-color-active ">Business Network</div>
        <div class="price ">4</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-earth "></div>
      <div class="card-number">110</div>
        <div class="content ">
            <span class="red-arrow "></span> <span style="font-size:14px; ">ACTION: LOOK AT THE TOP CARD AND EITHER BUY IT OR DISCARD IT</span>
            <br><br>
            <div class="production-box"><div class="production money">-1</div></div>
            <div class="description " >
                (Decrease your MC production 1 step.)
            </div>
        </div>
`],
[CardName.BUSINESS_CONTACTS,`
        <div class="title background-color-events ">Business Contacts</div>
        <div class="price ">7</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-earth "></div>
      <div class="card-number">111</div>
        <div class="content ">
            <span style="font-size:14px; ">LOOK AT THE TOP 4 CARDS FROM THE DECK. TAKE 2 OF THEM INTO HAND AND DISCARD THE OTHER 2</span>
        </div>
`],
[CardName.BRIBED_COMMITTEE,`
        <div class="title background-color-events ">Bribed Committee</div>
        <div class="price ">7</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-earth "></div>
      <div class="card-number">112</div>
        <div class="content ">
          <div class="points points-big">-2</div>
          <div class="tile rating"></div> <div class="tile rating"></div>
          <div class="description ">
              (Raise your TR 2 steps.)
          </div>
        </div>
`],
[CardName.SOLAR_POWER,`
        <div class="title background-color-automated ">Solar Power</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-power "></div>
      <div class="card-number">113</div>
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
[CardName.BREATHING_FILTERS,`
        <div class="title background-color-automated ">Breathing Filters</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-science "></div>
      <div class="card-number">114</div>
        <div class="content ">
            <div class="points points-big ">2</div>
            <div class="requirements">7% O2</div>
            <div class="description ">
                (Requires 7% oxygen.)
            </div>
        </div>
`],
[CardName.ARTIFICIAL_PHOTOSYNTHESIS,`
        <div class="title background-color-automated ">Artificial Photosynthesis</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-science "></div>
      <div class="card-number">115</div>
        <div class="content ">
          <div class="production-box production-box-size4">
            <div class="production plant"></div> OR <div class="production energy"></div><div class="production energy"></div>
          </div>
            <div class="description ">
                (Increase your plant production 1 step or your energy production 2 steps.)
            </div>
        </div>
`],
[CardName.ARTIFICIAL_LAKE,`
      <div class="title background-color-automated">Artificial Lake</div>
      <div class="price">15</div>
      <div class="tag tag1 tag-building "></div>
      <div class="card-number">116</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">-6 C</div>
        <div class="tile ocean-tile"></div>*
        <div class="description">
          (Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.)
        </div>
      </div>
`],
[CardName.GEOTHERMAL_POWER,`
        <div class="title background-color-automated ">Geothermal Power</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-power "></div>
      <div class="card-number">117</div>
        <div class="content ">
            <div class="production-box production-box-size2">
                <div class="energy production "></div><div class="energy production "></div>
            </div>
            <div class="description ">
                (Increase your energy production 2 step.)
            </div>
        </div>
`],
[CardName.FARMING,`
      <div class="title background-color-automated">Farming</div>
      <div class="price">16</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">118</div>
      <div class="content">
        <div class="points points-big">2</div>
        <div class="requirements">+4 C</div>
        <div class="production-box production-box-size2">
          <div class="money production">2</div><br>
          <div class="plant production"></div><div class="plant production"></div>
        </div>
        <div class="plant resource" style="margin-left:20px"></div>
        <div class="plant resource"></div>
        <div class="description">
          (Requires +4 C or warmer. Increase your MC production 2 steps and your plant production 2 steps. Gain 2 Plants.)
        </div>
      </div>
`],
[CardName.DUST_SEALS,`
        <div class="title background-color-automated ">Dust Seals</div>
        <div class="price ">2</div>
      <div class="card-number">119</div>
        <div class="content ">
            <div class="points points-big ">1</div>
            <div class="requirements requirements-max ">max 3 Oceans</div>
            <div class="description ">
                (Requires 3 or less ocean tiles.)
            </div>
        </div>
`],
[CardName.URBANIZED_AREA,`
        <div class="title background-color-automated ">Urbanized Area</div>
        <div class="price ">10</div>
        <div class="tag tag1 tag-building "></div>
        <div class="tag tag2 tag-city "></div>
      <div class="card-number">120</div>
        <div class="content ">
            <div class="production-box production-box-size1a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">2</div>
            </div>
            <div class="tile city-tile " style="margin-left:20px "></div>*<br>
            <div class="description ">
                (Decrease your energy production 1 step and increase your MC production 2 steps.
                Place a city tile ADJACENT TO AT LEAST 2 OTHER CITY TILES.)
            </div>
        </div>
`],
[CardName.SABOTAGE,`
      <div class="title background-color-events">Sabotage</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-event"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">121</div>
      <div class="content">
        -3<div class="resource titanium red-outline"></div> OR -4<div class="resource steel red-outline"></div> OR -<div class="resource money red-outline">7</div>
        <div class="description">
          (Remove up to 3 titanium from any player, or 4 steel, or 7 MC.)
        </div>
      </div>
`],
[CardName.MOSS,`
      <div class="title background-color-automated">Moss</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">122</div>
      <div class="content">
        <div class="requirements">3 Oceans</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        &nbsp;&nbsp; -  <div class="plant resource"></div>
        <div class="description">
          (Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step.)
        </div>
      </div>
`],
[CardName.INDUSTRIAL_CENTER,`
        <div class="title background-color-active ">Industrial Center</div>
        <div class="price ">4</div>
        <div class="tag tag1 tag-building "></div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">123</div>
        <div class="content ">
            <div class="money resource ">7</div> <div class="red-arrow "></div> <div class="production-box"><div class="steel production "></div></div>
            <div class="description ">
                (Action: Spend 7 MC to increase your steel production 1 step.)
            </div><br>
            <div class="tile special-tile">&#x1f3ed;</div>*
            <div class="description ">
                (Place this tile adjacent to a city tile.)
            </div>
        </div>
`],
[CardName.HIRED_RAIDERS,`
      <div class="title background-color-events">Hired Raiders</div>
      <div class="price">1</div>
      <div class="tag tag1 tag-event"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">124</div>
      <div class="content">
        STEAL 2<div class="resource steel red-outline"></div> <br>OR STEAL <div class="resource money red-outline">3</div>
        <div class="description">
          (Steal up to 2 steel, or 3 MC from any player.)
        </div>
      </div>
`],
[CardName.HACKERS,`
        <div class="title background-color-automated ">Hackers</div>
        <div class="price ">3</div>
        <div class="corporate-icon project-icon"></div>
        <div class="card-number">125</div>
        <div class="content ">
          <div class="points points-big">-1</div>
            <div class="production-box production-box-size2a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="money production red-outline">2</div>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">2</div>
            </div>
            <div class="description ">
                (Decrease your energy production 1 step and any MC production 2 steps. increase your MC production 2 steps.
            </div>
        </div>
`],
[CardName.GHG_FACTORIES,`
      <div class="title background-color-automated">GHG Factories</div>
      <div class="price">11</div>
      <div class="tag tag1 tag-building"></div>
      <div class="card-number">126</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production-prefix">&#x2796;&#xFE0E;</div>&nbsp;&nbsp;<div class="energy production"></div><br>
          <div class="production-prefix">&#x2795;&#xFE0E;</div>4 <div class="heat production"></div>
        </div>
        <div class="description">
          (Decrease your Energy production 1 step and increase your heat production 4 steps.)
        </div>
      </div>
`],
[CardName.SUBTERRANEAN_RESERVOIR,`
        <div class="title background-color-events ">Subterranean Reservoir</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-event "></div>
        <div class="card-number">127</div>
        <div class="content ">
            <div class="tile ocean-tile "></div>
            <div class="description ">
                (Place 1 ocean tile.)
            </div>
        </div>
`],
[CardName.ECOLOGICAL_ZONE,`
      <div class="title background-color-active">Ecological Zone</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="tag tag2 tag-animal"></div>
      <div class="card-number">128</div>
      <div class="content">
        <div class="points">1/2<div class="resource animal"></div></div>
        <div class="requirements">Forest</div>
        <div class="tag-animal resource-tag"></div> / <div class="tag-plant resource-tag"></div> : <div class="animal resource"></div>
        <div class="description">
          (Effect: When you play an animal or plant tag (including these), add an animal to this card.)
        </div>
        <div class="tile special-tile" style="margin-left:143px;">&#x1F43e;&#xFE0E;</div>
        <div class="description" style="text-align:left;margin-top:-65px;width: 135px;">
          (Requires that you have a greenery tile. Place this tile adjacent to any greenery tile. 1 VP per 2 Animals on this card.)
        </div>
      </div>
`],
[CardName.ZEPPELINS,`
        <div class="title background-color-automated ">Zeppelins</div>
        <div class="price ">13</div>
      <div class="card-number">129</div>
        <div class="content ">
          <div class="points points-big">1</div>
            <div class="requirements ">5% O2</div>
            <div class="production-box production-box-size2a ">
                <div class="money production ">1</div> / <div class="tile city-tile-small red-outline " style="margin-bottom:0px;"></div><br>
            </div>
            <div class="description ">
              (Requires 5% oxygen. Increase your MC production 1 step for each City tile ON MARS.)
            </div>
        </div>
`],
[CardName.WORMS,`
        <div class="title background-color-automated ">Worms</div>
        <div class="price ">8</div>
        <div class="tag tag1 tag-microbe"></div>
      <div class="card-number">130</div>
        <div class="content ">
            <div class="requirements ">4% O2</div>
            <div class="production-box production-box-size2a ">
                <div class="plant production "></div> / 2 <div class="resource-tag tag-microbe "></div><br>
            </div>
            <div class="description ">
              (Requires 4% oxygen. Increase your Plant production 1 step for every 2 Microbe tags you have, including this.)
            </div>
        </div>
`],
[CardName.DECOMPOSERS,`
      <div class="title background-color-active">Decomposers</div>
      <div class="price">5</div>
      <div class="tag tag1 tag-microbe"></div>
      <div class="card-number">131</div>
      <div class="content">
        <div class="points">1/3<div class="resource microbe"></div></div>
        <div class="requirements">3% O2</div>
        <div class="tag-animal resource-tag"></div> / <div class="tag-plant resource-tag"></div> / <div class="tag-microbe resource-tag"></div> : <div class="microbe resource"></div>
        <div class="description">
          (Effect: When you play an Animal, Plant, or Microbe tag, including this, add a Microbe to this card.)
        </div>
        <div class="description">
          (Requires 3% oxygen. 1 VP per 3 Microbes on this card.)
        </div>
      </div>
`],
[CardName.FUSION_POWER,`
      <div class="title background-color-automated">Fusion Power</div>
      <div class="price">14</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="tag tag3 tag-science"></div>
      <div class="card-number">132</div>
      <div class="content">
        <div class="requirements">2 Power</div>
        <div class="production-box production-box-size3">
          <div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 2 Power tags. Increase your Energy production 3 steps.)
        </div>
      </div>
`],
[CardName.SYMBIOTIC_FUNGUS,`
        <div class="title background-color-active ">Symbiotic Fungus</div>
        <div class="price ">4</div>
        <div class="tag tag1 tag-microbe "></div>
      <div class="card-number">133</div>
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
[CardName.EXTREME_COLD_FUNGUS,`
        <div class="title background-color-active ">Extreme-Cold Fungus</div>
        <div class="price ">13</div>
        <div class="tag tag1 tag-microbe "></div>
      <div class="card-number">134</div>
        <div class="content ">
            <div class="requirements requirements-max">max -10 C</div>
            <div class="red-arrow " style="margin-left:-9px"></div> <div class="plant resource " ></div><br>
            OR <div class="red-arrow "></div> <div class="microbe resource "></div><div class="microbe resource "></div>*
            <div class="description ">
                (Action: Gain 1 plant or add 2 microbes to ANOTHER card.)
                <br><br>
                (It must be -10 C or colder.)
            </div>
        </div>
`],
[CardName.ADVANCED_ECOSYSTEMS,`
      <div class="title background-color-automated">Advanced Ecosystems</div>
      <div class="price">11</div>
      <div class="tag tag1 tag-animal"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="tag tag3 tag-plant"></div>
      <div class="card-number">135</div>
      <div class="content">
        <div class="points points-big">3</div>
        <div class="requirements">Plant Microbe Animal</div>
        <div class="description">
          (Requires a Plant tag, a Microbe tag, and an Animal tag.)
        </div>
      </div>
`],
[CardName.GREAT_DAM,`
      <div class="title background-color-automated">Great Dam</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="card-number">136</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">4 Oceans</div>
        <div class="production-box production-box-size2">
          <div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 4 ocean tiles. Increase your Energy production 2 steps.)
        </div>
      </div>
`],
[CardName.CARTEL,`
      <div class="title background-color-automated">Cartel</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">137</div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="money production">1</div> / <div class="tag-earth v resource-tag"></div>
        </div>
        <div class="description">
          (Increase your MC production 1 step for each Earth tag you have, including this.)
        </div>
      </div>
`],
[CardName.STRIP_MINE,`
        <div class="title background-color-automated ">Strip Mine</div>
        <div class="price ">25</div>
        <div class="tag tag1 tag-building "></div>
      <div class="card-number">138</div>
        <div class="content ">
            <div class="production-box production-box-size3a ">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><div class="energy production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="steel production "></div><div class="steel production "></div><div class="titanium production "></div>
            </div><br>
            <div class="tile oxygen-tile "></div><div class="tile oxygen-tile "></div>
            <div class="description ">
              (Decrease your Energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.)
            </div>
        </div>
`],
[CardName.WAVE_POWER,`
      <div class="title background-color-automated">Wave Power</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-power"></div>
      <div class="card-number">139</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">3 Oceans</div>
        <div class="production-box">
          <div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 3 ocean tiles. Increase your energy production 1 step.)
        </div>
      </div>
`],
[CardName.LAVA_FLOWS,`
                <div class="title background-color-events ">Lava Flows</div>
                <div class="price ">18</div>
                <div class="tag tag1 tag-event "></div>
      <div class="card-number">140</div>
                <div class="content ">
                    <div class="tile temperature-tile "></div><div class="tile temperature-tile "></div><br>
                    <div class="tile special-tile ">&#x1f30b;</div>*
                    <div class="description ">
                      (Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.)
                    </div>
                </div>
`],
[CardName.POWER_PLANT,`
      <div class="title background-color-automated">Power Plant</div>
      <div class="price">4</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="card-number">141</div>
      <div class="content">
        <div class="production-box "><div class="energy production"></div>
        </div>
        <div class="description">
          (Increase your Energy production 1 step.)
        </div>
      </div>
`],
[CardName.MOHOLE_AREA,`
      <div class="title background-color-automated">Mohole Area</div>
      <div class="price">20</div>
      <div class="tag tag1 tag-building"></div>
      <div class="card-number">142</div>
      <div class="content">
        <div class="production-box production-box-size1a">
          4 <div class="heat production"></div>
        </div><br>
          <div class="tile special-tile " style="font-size:40px;">&#x2668;</div>*
        <div class="description">
          (Increase your heat production 4 steps. Place this tile ON AN AREA RESERVED FOR OCEAN.)
        </div>
      </div>
`],
[CardName.LARGE_CONVOY,`
        <div class="title background-color-events ">Large Convoy</div>
        <div class="price ">36</div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-space "></div>
        <div class="tag tag3 tag-earth "></div>
      <div class="card-number">143</div>
        <div class="content ">
          <div class="points points-big">2</div>
            <div class="tile ocean-tile "></div> <div class="resource card "></div><div class="resource card"></div><br>
            5<div class="resource plant "></div> OR 4<div class="resource animal "></div>*
            <div class="description ">
              (Place an ocean tile and draw 2 cards. Gain 5 Plants or add 4 Animals to ANOTHER card.)
            </div>
        </div>
`],
[CardName.TITANIUM_MINE,`
      <div class="title background-color-automated">Titanium Mine</div>
      <div class="price">7</div>
      <div class="tag tag1 tag-building"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">144</div>
      <div class="content">
        <div class="production-box">
          <div class="titanium production"></div>
        </div>
        <div class="description">
          (Increase your titanium production 1 step.)
        </div>
      </div>
`],
[CardName.TECTONIC_STRESS_POWER,`
      <div class="title background-color-automated">Tectonic Stress Power</div>
      <div class="price">18</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="card-number">145</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">2 Science</div>
        <div class="production-box production-box-size3">
          <div class="energy production"></div><div class="energy production"></div><div class="energy production"></div>
        </div>
        <div class="description">
          (Requires 2 Science tags. Increase your Energy production 3 steps.)
        </div>
      </div>
`],
[CardName.NITROPHILIC_MOSS,`
      <div class="title background-color-automated"> Nitrophilic Moss</div>
      <div class="price">8</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">146</div>
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
[CardName.HERBIVORES,`
        <div class="title background-color-active ">Herbivores</div>
        <div class="price ">12</div>
        <div class="tag tag1 tag-animal "></div>
        <div class="card-number">147</div>
        <div class="content ">
            <div class="points ">1/2<div class="animal resource "></div></div>
            <div class="requirements">8% O2</div>
            <div class="tile greenery-tile" style="margin-top:-3px;"></div> : <div class="animal resource "></div>
            <div class="description " style="margin-top:-8px;">
              (Effect: When you place a greenery tile, add an Animal to this card.)
            </div>
            <div class="animal resource " style="margin-left:105px;"></div>
            <div class="production-box production-box-size1a" style="margin-top:2px;">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
            </div>
            <div class="description" style="position:absolute;text-align:left;margin-top:-25px; width: 130px;">
              (Requires 8% oxygen. Add 1 Animal to this card. Decrease any Plant production 1 step. 1 VP per 2 Animals on this card.)
            </div>
        </div>
`],
[CardName.INSECTS,`
        <div class="title background-color-automated ">Insects</div>
        <div class="price ">9</div>
        <div class="tag tag1 tag-microbe"></div>
      <div class="card-number">148</div>
        <div class="content ">
            <div class="requirements ">6% O2</div>
            <div class="production-box production-box-size2a ">
                <div class="plant production "></div> / <div class="resource-tag tag-plant "></div><br>
            </div>
            <div class="description ">
              (Requires 6% oxygen. Increase your Plant production 1 step for each plant tag you have.)
            </div>
        </div>
`],
[CardName.CEOS_FAVORITE_PROJECT,`
        <div class="title background-color-events ">CEO's Favorite Project</div>
        <div class="price ">1</div>
        <div class="tag tag1 tag-event"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">149</div>
        <div class="content " style="font-size:14px;">
          ADD 1 RESOURCE TO A CARD WITH AT LEAST 1 RESOURCE ON IT
        </div>
`],
[CardName.ANTI_GRAVITY_TECHNOLOGY,`
        <div class="title background-color-active ">Anti-Gravity Technology</div>
        <div class="price ">14</div>
        <div class="tag tag1 tag-science"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">150</div>
        <div class="content ">
          <div class="points points-big">3</div>
          <div class="requirements">7 Science</div>
            : <span class="money resource ">-2</span>
            <div class="description ">
                (Effect: When you play a card, you pay 2 MC less for it.)
            </div><br><br>
            <div class="description ">
                (Requires 7 science tags.)
            </div>
        </div>
`],
[CardName.INVESTMENT_LOAN,`
        <div class="title background-color-events ">Investment Loan</div>
        <div class="price ">3</div>
        <div class="corporate-icon project-icon"></div>
        <div class="tag tag1 tag-event "></div>
        <div class="tag tag2 tag-earth "></div>
      <div class="card-number">151</div>
        <div class="content ">
            <div class="production-box"><div class="production money">-1</div></div> <div class="resource money" style="margin-left:20px;">10</div>
            <div class="description ">
              (Decrease your MC production 1 step. Gain 10 MC.)
            </div>
        </div>
`],
[CardName.INSULATION,`
        <div class="title background-color-automated ">Insulation</div>
        <div class="price ">2</div>
      <div class="card-number">152</div>
        <div class="content ">
            <div class="production-box production-box-size3 ">
                -x<div class="heat production "></div> +<div class="money production ">X</div>
            </div>
            <div class="description ">
              (Decrease your heat production any number of steps and increase your MC production the same number of steps.)
            </div>
        </div>
`],
[CardName.ADAPTATION_TECHNOLOGY,`
      <div class="title background-color-active">Adaptation Technology</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-science"></div>
      <div class="card-number">153</div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="tile background-color-corporation" style="width:100px;text-shadow:none;color:black;font-size:11px;padding-top:5px;padding-bottom:5px;">Temp / O2 / Ocean</div>: +/- 2
        <div class="description">
          (Effect: Your global requirements are +2 or -2 steps, your choice in each case.)
        </div>
      </div>
`],
[CardName.CARETAKER_CONTRACT,`
        <div class="title background-color-active ">Caretaker Contract</div>
        <div class="price ">3</div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">154</div>
        <div class="content ">
          <div class="requirements">0 C</div>
          8  <span class="heat resource "></span> <span class="red-arrow "></span> <span class="rating tile "></span>
            <div class="description ">
              (Action: Spend 8 heat to increase your terraform rating 1 step.)
            </div><br>
            <div class="description ">
              (Requires 0 C or warmer.)
            </div>
        </div>
`],
[CardName.DESIGNED_MICRO_ORGANISMS,`
        <div class="title background-color-automated ">Designed Micro-organisms</div>
        <div class="price ">16</div>
        <div class="tag tag1 tag-microbe"></div>
        <div class="tag tag2 tag-science"></div>
      <div class="card-number">155</div>
        <div class="content ">
            <div class="requirements requirements-max">max -14 C</div>
            <div class="production-box production-box-size2 ">
                <div class="plant production "></div><div class="plant production "></div>
            </div>
            <div class="description ">
              (It must be -14 C or colder. Increase your Plant production 2 steps.)
            </div>
        </div>
`],
[CardName.STANDARD_TECHNOLOGY,`
      <div class="title background-color-active">Standard Technology</div>
      <div class="price">6</div>
      <div class="tag tag1 tag-science"></div>
      <div class="corporate-icon project-icon"></div>
      <div class="card-number">156</div>
      <div class="content">
        <div class="tile" style="width:100px;text-shadow:none;color:black;font-size:14px;line-height:17px;vertical-align:middle;background-color: rgb(255,204,100);padding:5px;">Standard projects</div> : <div class="money resource">3</div>
        <div class="description">
          (Effect: After you pay for a standard project, except selling patents, you gain 3 MC.)
        </div>
      </div>
`],
[CardName.NITRITE_REDUCING_BACTERIA,`
        <div class="title background-color-active ">Nitrite Reducing Bacteria</div>
        <div class="price ">11</div>
        <div class="tag tag1 tag-microbe "></div>
        <div class="card-number">157</div>
        <div class="content ">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR 3 <div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile rating "></div>
            <div class="description ">
              (Action: Add 1 Microbe to this card, or remove 3 Microbes to increase your TR 1 step.<br>
            </div><br>
            <div class="microbe resource "></div><div class="microbe resource "></div><div class="microbe resource "></div>
            <div class="description ">
              (Add 3 Microbes to this card.)
            </div>
        </div>
`],
[CardName.INDUSTRIAL_MICROBES,`
      <div class="title background-color-automated">Industrial Microbes</div>
      <div class="price">12</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="card-number">158</div>
      <div class="content">
        <div class="production-box">
          <div class="energy production"></div>
          <div class="steel production"></div>
        </div>
        <div class="description">
          (Increase your Energy production and your steel production 1 step each.)
        </div>
      </div>
`],
[CardName.LICHEN,`
      <div class="title background-color-automated">Lichen</div>
      <div class="price">7</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="card-number">159</div>
      <div class="content">
        <div class="requirements">-24 C</div>
        <div class="production-box">
          <div class="plant production"></div>
        </div>
        <div class="description">
          (Requires -24 C or warmer. Increase your Plant production 1 step.)
        </div>
      </div>
`],
[CardName.POWER_SUPPLY_CONSORTIUM,`
        <div class="title background-color-automated">Power Supply Consortium</div>
        <div class="price">5</div>
        <div class="tag tag1 tag-power"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">160</div>
        <div class="content">
          <div class="requirements">2 Power</div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production red-outline"></div>
              <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
          </div>
          <div class="description">
            (Requires 2 Power tags. Decrease any Energy production 1 step and increase your own 1 step.)
          </div>
        </div>
`],
[CardName.CONVOY_FROM_EUROPA,`
          <div class="title background-color-events ">Convoy From Europa</div>
          <div class="price ">15</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
      <div class="card-number">161</div>
          <div class="content ">
              <div class="tile ocean-tile "></div> <div class="resource card " style="margin-left:20px;"></div>
              <div class="description ">
                (Place 1 ocean tile and draw 1 card.)
              </div>
          </div>
`],
[CardName.IMPORTED_GHG,`
          <div class="title background-color-events ">Imported GHG</div>
          <div class="price ">7</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-earth "></div>
      <div class="card-number">162</div>
          <div class="content ">
            <div class="production-box ">
                <div class="heat production"></div>
            </div> <div class="heat resource" style="margin-left:20px;"></div><div class="heat resource"></div><div class="heat resource"></div>
              <div class="description ">
                (Increase your heat production 1 step and gain 3 heat.)
              </div>
          </div>
`],
[CardName.IMPORTED_NITROGEN,`
          <div class="title background-color-events ">Imported Nitrogen</div>
          <div class="price ">23</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-earth "></div>
      <div class="card-number">163</div>
          <div class="content ">
            <div class="rating tile"></div> 4<div class="plant resource"></div> 3<div class="microbe resource"></div>* 2<div class="animal resource"></div>*
              <div class="description ">
                (Raise your TR 1 step and gain 4 Plants. Add 3 Microbes to ANOTHER card and 2 Animals to ANOTHER card.)
              </div>
          </div>
`],
[CardName.MICRO_MILLS,`
        <div class="title background-color-automated">Micro-Mills</div>
        <div class="price">3</div>
      <div class="card-number">164</div>
        <div class="content">
          <div class="production-box">
          <div class="heat production"></div>
          </div><br>
          <div class="description">
            (Increase your heat production 1 step.)
          </div>
        </div>
`],
[CardName.MAGNETIC_FIELD_GENERATORS,`
        <div class="title background-color-automated">Magnetic Field Generators</div>
        <div class="price">20</div>
        <div class="tag tag1 tag-building"></div>
      <div class="card-number">165</div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div> 4 <div class="energy production"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production"></div><div class="plant production"></div>
          </div> <br>
           <div class="tile rating"></div> <div class="tile rating"></div> <div class="tile rating"></div>
          <div class="description">
            (Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.)
          </div>
        </div>
`],
[CardName.SHUTTLES,`
          <div class="title background-color-active ">Shuttles</div>
          <div class="price ">10</div>
          <div class="tag tag1 tag-space "></div>
      <div class="card-number">166</div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">5% O2</div>
              <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
              <div class="description ">
                  (Effect: When you play a Space card, you pay 2 MC less for it.)
              </div>
              <div class="production-box production-box-size1a" style="margin-top:10px;margin-right:130px;">
                 <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
                   <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
              </div>
              <div class="description " style="position:absolute;margin-top:-90px;text-align:left;margin-left:86px;">
                (Requires 5% oxygen. Decrease your Energy production 1 step and increase your MC production 2 steps.)
              </div>
          </div>
`],
[CardName.IMPORT_OF_ADVANCED_GHG,`
          <div class="title background-color-events ">Import of Advanced GHG</div>
          <div class="price ">9</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-earth "></div>
      <div class="card-number">167</div>
          <div class="content ">
            <div class="production-box production-box-size2">
                <div class="heat production"></div><div class="heat production"></div>
            </div>
              <div class="description ">
                (Increase your heat production 2 steps.)
              </div>
          </div>
`],
[CardName.WINDMILLS,`
          <div class="title background-color-automated ">Windmills</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-power "></div>
      <div class="card-number">168</div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">7% O2</div>
              <div class="production-box ">
                  <div class="energy production "></div>
              </div>
              <div class="description ">
                (Requires 7% oxygen. Increase your Energy production 1 step.)
              </div>
          </div>
`],
[CardName.TUNDRA_FARMING,`
        <div class="title background-color-automated">Tundra Farming</div>
        <div class="price">16</div>
        <div class="tag tag1 tag-plant"></div>
      <div class="card-number">169</div>
        <div class="content">
          <div class="points points-big">2</div>
          <div class="requirements">-6 C</div>
          <div class="production-box production-box-size2">
            <div class="plant production"></div><div class="money production">2</div><br>
          </div>
          <div class="plant resource" style="margin-left:20px"></div>
          <div class="description">
            (Requires -6 C or warmer. Increase your Plant production 1 step and your MC production 2 steps. Gain 1 Plant.)
          </div>
        </div>
`],
[CardName.AEROBRAKED_AMMONIA_ASTEROID,`
          <div class="title background-color-events " style="font-size:14px">Aerobraked Ammonia Asteroid</div>
          <div class="price ">26</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
      <div class="card-number">170</div>
          <div class="content ">
            <div class="production-box production-box-size3">
                <div class="heat production"></div><div class="heat production"></div><div class="heat production"></div>
                <div class="plant production"></div>
            </div><br>
             <div class="microbe resource"></div><div class="microbe resource"></div>*
              <div class="description ">
                (Add 2 Microbes to ANOTHER card. Increase your heat production 3 steps and your Plant productions 1 step.)
              </div>
          </div>
`],
[CardName.MAGNETIC_FIELD_DOME,`
        <div class="title background-color-automated">Magnetic Field Dome</div>
        <div class="price">5</div>
        <div class="tag tag1 tag-building"></div>
        <div class="card-number">171</div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production"></div>
          </div>
           &nbsp;&nbsp;&nbsp;<div class="tile rating"></div>
          <div class="description">
            (Decrease your Energy production 2 steps and increase your Plant production 1 step. Raise your TR 1 step.)
          </div>
        </div>
`],
[CardName.PETS,`
        <div class="title background-color-active">Pets</div>
        <div class="price">10</div>
        <div class="tag tag1 tag-animal"></div>
        <div class="tag tag2 tag-earth"></div>
        <div class="card-number">172</div>
        <div class="content">
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
[CardName.PROTECTED_HABITATS,`
          <div class="title background-color-active ">Protected Habitats</div>
          <div class="price ">5</div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">173</div>
          <div class="content ">
          <span style="font-size:12px; ">OPPONENTS MAY NOT REMOVE YOUR</span><br>
          <div class="plant resource"></div> <div class="animal resource"></div> <div class="microbe resource"></div>
          </div>
`],
[CardName.PROTECTED_VALLEY,`
          <div class="title background-color-automated ">Protected Valley</div>
          <div class="price ">23</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-plant "></div>
      <div class="card-number">174</div>
          <div class="content ">
              <div class="production-box production-box ">
                  <div class="money production ">2</div>
              </div> <div class="tile greenery-tile" style="margin-left:30px;"></div>*
              <div class="description ">
                (Increase your MC production 2 steps. Place on a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.)
              </div>
          </div>
`],
[CardName.SATELLITES,`
        <div class="title background-color-automated">Satellites</div>
        <div class="price">10</div>
        <div class="tag tag1 tag-space"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">175</div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production money">1</div> / <div class="resource-tag tag-space"></div>
          </div>
          <div class="description">
            (Increase your MC production 1 step for each space tag your have, including this one.)
          </div>
        </div>
`],
[CardName.NOCTIS_FARMING,`
        <div class="title background-color-automated">Noctis Farming</div>
        <div class="price">10</div>
        <div class="tag tag1 tag-plant"></div>
        <div class="tag tag2 tag-building"></div>
      <div class="card-number">176</div>
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
[CardName.WATER_SPLITTING_PLANT,`
          <div class="title background-color-active ">Water Splitting Plant</div>
          <div class="price ">12</div>
          <div class="tag tag1 tag-building "></div>
      <div class="card-number">177</div>
          <div class="content ">
            <div class="requirements">2 Oceans</div>
              <div class="energy resource "></div><div class="energy resource "></div><div class="energy resource "></div> <div class="red-arrow "></div>
              <div class="tile oxygen-tile"></div>
              <div class="description ">
                (Action: Spend 3 Energy to raise oxygen 1 step.)
                <br><br><br><br>
                (Requires 2 ocean tiles.)
               </div>
          </div>
`],
[CardName.HEAT_TRAPPERS,`
          <div class="title background-color-automated ">Heat Trappers</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-power "></div>
      <div class="card-number">178</div>
          <div class="content ">
            <div class="points points-big">-1</div>
              <div class="production-box production-box-size2a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="heat production red-outline "></div><div class="heat production red-outline "></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production "></div>
              </div>
              <div class="description ">
                (Decrease any heat production 2 steps and increase your Energy production 1 step.)
              </div>
          </div>
`],
[CardName.SOIL_FACTORY,`
          <div class="title background-color-automated ">Soil Factory</div>
          <div class="price ">9</div>
          <div class="tag tag1 tag-building "></div>
      <div class="card-number">179</div>
          <div class="content ">
            <div class="points points-big ">1</div>
              <div class="production-box production-box-size1a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production  "></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production "></div>
              </div>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your Plant production 1 step.)
              </div>
          </div>
`],
[CardName.FUEL_FACTORY,`
          <div class="title background-color-automated ">Fuel Factory</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">180</div>
          <div class="content ">
              <div class="production-box production-box-size2a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production  "></div><br>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="titanium production "></div><div class="money production ">1</div>
              </div>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your titanium and your MC production 1 step each.)
              </div>
          </div>
`],
[CardName.ICE_CAP_MELTING,`
          <div class="title background-color-events ">Ice Cap Melting</div>
          <div class="price ">5</div>
          <div class="tag tag1 tag-event "></div>
      <div class="card-number">181</div>
          <div class="content ">
            <div class="requirements">+2 C</div>
              <div class="tile ocean-tile "></div>
              <div class="description ">
                  (Requires +2 C or warmer. Place 1 ocean tile.)
              </div>
          </div>
`],
[CardName.CORPORATE_STRONGHOLD,`
          <div class="title background-color-automated ">Corporate Stronghold</div>
          <div class="price ">11</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-city "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">182</div>
          <div class="content ">
            <div class="points points-big">-2</div>
              <div class="production-box production-box-size1a ">
                  <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                  <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
              </div>
              <div class="tile city-tile " style="margin-left:20px "></div><br>
              <div class="description ">
                (Decrease your Energy production 1 step and increase your MC production 3 steps. Place a City tile.)
              </div>
          </div>
`],
[CardName.BIOMASS_COMBUSTORS,`
        <div class="title background-color-automated">Biomass Combustors</div>
        <div class="price">4</div>
        <div class="tag tag1 tag-building"></div>
        <div class="tag tag2 tag-power"></div>
      <div class="card-number">183</div>
        <div class="content">
          <div class="points points-big">-1</div>
          <div class="requirements">6% O2</div>
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div>
          </div>
          <div class="description">
            (Requires 6% oxygen. Decrease any Plant production 1 step and increase your Energy production 2 steps.)
          </div>
        </div>
`],
[CardName.LIVESTOCK,`
        <div class="title background-color-active">Livestock</div>
        <div class="price">13</div>
        <div class="tag tag1 tag-animal"></div>
        <div class="card-number">184</div>
        <div class="content">
          <div class="points">1/<div class="animal resource"></div>
          </div>
          <div class="requirements">9% O2</div>
          <span class="red-arrow"></span>
          <div class="animal resource"></div>
          <div class="description" style="margin-bottom:5px;">
            (Action: Add 1 Animal to this card.)
          </div>
          <div class="production-box production-box-size1a" style="margin-top:10px;margin-right:150px;">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production"></div>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
          </div>
          <div class="description" style="position:absolute;margin-top:-85px;text-align:left;margin-left:80px;font-size:10px;">
            (Requires 9% oxygen. Decrease your Plant production 1 step and increase your MC production 2 steps. 1 VP for each Animal on this card.
          </div>
        </div>
`],
[CardName.OLYMPUS_CONFERENCE,`
          <div class="title background-color-active ">Olympus Conference</div>
          <div class="price ">10</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-earth "></div>
          <div class="tag tag3 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
          <div class="card-number">185</div>
          <div class="content ">
            <div class="points points-big">1</div>
              <div class="resource-tag science"></div> : <div class="resource science"></div> OR -<div class="resource science"></div>+<div class="card resource "></div>
              <div class="description ">
                (When you play a Science tag, including this, either add a Science resource to this card, or remove a Science resource from this card to draw a card.)
              </div>
          </div>
`],
[CardName.RAD_SUITS,`
          <div class="title background-color-automated ">Rad-Suits</div>
          <div class="price ">6</div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">186</div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">2 Cities</div>
            <div class="production-box"><div  class="production money">1</div></div>
            <div class="description">
              (Requires two cities in play. Increase your MC up 1 step.)
            </div>
          </div>
`],
[CardName.AQUIFER_PUMPING,`
          <div class="title background-color-active ">Aquifer Pumping</div>
          <div class="price ">18</div>
          <div class="tag tag1 tag-building "></div>
      <div class="card-number">187</div>
          <div class="content ">
              <div class=" money resource ">8</div> (<span class="steel " style="margin:0px;padding:2px;padding-top:3px;border-radius:5px; "></span>)
              <span class="red-arrow "></span> <div class="ocean-tile tile "></div>
              <div class="description ">
                (Action: Spend 8 MC to place 1 ocean tile. STEEL MAY BE USED as if you were playing a Building card.)
              </div>
          </div>
`],
[CardName.FLOODING,`
          <div class="title background-color-events ">Flooding</div>
          <div class="price ">7</div>
          <div class="tag tag1 tag-event "></div>
      <div class="card-number">188</div>
          <div class="content ">
            <div class="points points-big">-1</div>
              <div class="tile ocean-tile " style="margin-right:20px"></div> - <div class="resource money red-outline" >4</div>*
              <div class="description ">
                (Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 MC FROM THE OWNER OF ONE OF THOSE TILES.)
              </div>
          </div>
`],
[CardName.ENERGY_SAVING,`
        <div class="title background-color-automated">Energy Saving</div>
        <div class="price">15</div>
        <div class="tag tag1 tag-power"></div>
      <div class="card-number">189</div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="energy production"></div> / <div class="tile city-tile-small red-outline" style="margin-bottom:3px;"></div>
          </div>
          <div class="description">
            (Increase your Energy production 1 step for each City tile in play.)
          </div>
        </div>
`],
[CardName.LOCAL_HEAT_TRAPPING,`
          <div class="title background-color-events ">Local Heat Trapping</div>
          <div class="price ">1</div>
          <div class="tag tag1 tag-event "></div>
      <div class="card-number">190</div>
          <div class="content ">
              -5<div class="resource heat" style="margin-right:15px;"></div> + &nbsp;&nbsp;&nbsp;4<div class="resource plant"></div> OR 2<div class="resource animal"></div>*
              <div class="description ">
                (Spend 5 heat to gain either 4 Plants, or to add 2 Animals to ANOTHER card.)
              </div>
          </div>
`],
[CardName.PERMAFROST_EXTRACTION,`
          <div class="title background-color-events ">Permafrost Extraction</div>
          <div class="price ">8</div>
          <div class="tag tag1 tag-event "></div>
      <div class="card-number">191</div>
          <div class="content ">
            <div class="requirements">-8 C</div>
              <div class="tile ocean-tile "></div>
              <div class="description ">
                (Requires -8 C or warmer. Place 1 ocean tile.)
              </div>
          </div>
`],
[CardName.INVENTION_CONTEST,`
          <div class="title background-color-events ">Invention Contest</div>
          <div class="price ">2</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">192</div>
          <div class="content " style="font-size:14px">
            LOOK AT THE TOP 3 CARDS FROM THE DECK. TAKE 1 OF THEM INTO HAND AND DISCARD THE OTHER 2
          </div>
`],
[CardName.PLANTATION,`
        <div class="title background-color-automated">Plantation</div>
        <div class="price">15</div>
        <div class="tag tag1 tag-plant"></div>
      <div class="card-number">193</div>
        <div class="content">
          <div class="requirements">2 Science</div>
          <div class="tile greenery-tile"></div>
          <div class="description">
            (Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.)
          </div>
        </div>
`],
[CardName.POWER_INFRASTRUCTURE,`
          <div class="title background-color-active ">Power Infrastructure</div>
          <div class="price ">4</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-power "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">194</div>
          <div class="content ">
              X<div class="energy resource "></div> <div class="red-arrow "></div> <div class="money resource ">X</div>
              <div class="description ">
                (Action: Spend any amount of Energy and gain that amount of MC.)
              </div>
          </div>
`],
[CardName.INDENTURED_WORKERS,`
          <div class="title background-color-events ">Indentured Workers</div>
          <div class="price ">0</div>
          <div class="tag tag1 tag-event "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">195</div>
          <div class="content ">
            <div class="points points-big">-1</div>
            <span style="font-size:14px;">NEXT CARD: </span> <div class="resource money">-8</div>
              <div class="description ">
                (The next card you play this generation costs 8 MC less.)
              </div>
          </div>
`],
[CardName.LAGRANGE_OBSERVATORY,`
          <div class="title background-color-automated ">Lagrange Observatory</div>
          <div class="price ">9</div>
          <div class="tag tag1 tag-space "></div>
          <div class="tag tag2 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">196</div>
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="resource card"></div>
            <div class="description">
              (Draw 1 card.)
            </div>
          </div>
`],
[CardName.TERRAFORMING_GANYMEDE,`
          <div class="title background-color-automated ">Terraforming Ganymede</div>
          <div class="price ">33</div>
          <div class="tag tag1 tag-space "></div>
          <div class="tag tag2 tag-jovian "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">197</div>
          <div class="content ">
              <div class="points points-big">2</div>
              <div class="tile rating"></div> / <div class="resource-tag tag-jovian"></div>
              <div class="description ">
                (Raise your TR 1 step for each Jovian tag you have, including this.)
              </div>
          </div>
`],
[CardName.IMMIGRATION_SHUTTLES,`
          <div class="title background-color-automated ">Immigration Shuttles</div>
          <div class="price ">31</div>
          <div class="tag tag1 tag-space"></div>
          <div class="tag tag2 tag-earth"></div>
      <div class="card-number">198</div>
          <div class="content ">
            <div class="points big" style="font-size:24px">1/3<div class="tile city-tile-small red-outline"></div></div>
            <div class="production-box ">
                <div class="money production">5</div>
            </div>
            <div class="description" style="margin-top:-5px">
              (Increase your MC production 5 steps. 1 VP for every 3rd City in play.)
            </div>
          </div>
`],
[CardName.RESTRICTED_AREA,`
          <div class="title background-color-active ">Restricted Area</div>
          <div class="price ">11</div>
          <div class="tag tag1 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">199</div>
          <div class="content ">
              <div class="money resource ">2</div> <div class="red-arrow "></div> <div class="card resource "></div>
              <div class="description ">
                  (Action: Spend 2 MC to draw a card.)
              </div><br>
              <div class="tile special-tile" style="font-size:38px;padding-top:15px;padding-bottom:15px;">&#x20e0;</div>
              <div class="description ">
                (Place this tile.)
              </div>
          </div>
`],
[CardName.IMMIGRANT_CITY,`
          <div class="title background-color-active ">Immigrant City</div>
          <div class="price ">13</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-city "></div>
      <div class="card-number">200</div>
          <div class="content ">
              <div class="tile city-tile red-outline"></div> :&nbsp; <div class="production-box"><div class="production money">1</div></div>
              <div class="description ">
                (Effect: When a City tile is placed, including this, increase your MC production 1 step.)
              </div><br>
              <div class="production-box production-box-size2a">
                  <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="production energy"></div><div class="production money">-2</div>
              </div> <div class="tile city-tile "></div>
              <div class="description ">
                (Decrease your Energy production 1 step and decrease your MC production 2 steps. Place a City tile.)
              </div>
          </div>
`],
[CardName.ENERGY_TAPPING,`
        <div class="title background-color-automated">Energy Tapping</div>
        <div class="price">3</div>
        <div class="tag tag1 tag-power"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">201</div>
        <div class="content">
          <div class="points points-big">-1</div>
          <div class="production-box production-box-size1a">
              <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production red-outline"></div>
              <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
          </div>
          <div class="description">
            (Decrease any Energy production 1 step and increase your own 1 step.)
          </div>
        </div>
`],
[CardName.UNDERGROUND_DETONATIONS,`
          <div class="title background-color-active ">Underground Detonations</div>
          <div class="price ">6</div>
          <div class="tag tag1 tag-building "></div>
      <div class="card-number">202</div>
          <div class="content ">
            <div class="money resource ">10</div><div class="red-arrow " style="margin-left:5px; "></div>&nbsp;
              <div class="production-box production-box-size2 ">
                  <div class="heat production "></div><div class="heat production "></div>
              </div>
              <div class="description ">
                  (Action: Spend 10MC to increase your heat production 2 steps.)
              </div>
          </div>
`],
[CardName.SOLETTA,`
          <div class="title background-color-automated ">Soletta</div>
          <div class="price ">35</div>
          <div class="tag tag1 tag-space"></div>
      <div class="card-number">203</div>
          <div class="content ">
            <div class="production-box production-box-size1a">
                7 <div class="heat production"></div>
            </div>
            <div class="description">
              (Increase your heat production 7 steps.)
            </div>
          </div>
`],
[CardName.TECHNOLOGY_DEMONSTRATION,`
          <div class="title background-color-events ">Technology Demonstration</div>
          <div class="price ">5</div>
          <div class="tag tag1 tag-event "></div>
          <div class="tag tag2 tag-space "></div>
          <div class="tag tag3 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">204</div>
          <div class="content ">
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description ">
                  (Draw two cards.)
              </div>
          </div>
`],
[CardName.RAD_CHEM_FACTORY,`
        <div class="title background-color-automated">Rad-Chem Factory</div>
        <div class="price">8</div>
        <div class="tag tag1 tag-building"></div>
      <div class="card-number">205</div>
        <div class="content">
          <div class="production-box production-box-size1a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
          </div><br> <div class="tile rating"></div><div class="tile rating"></div>
          <div class="description">
            (Decrease your Energy production 1 step. Raise your TR 2 steps.)
          </div>
        </div>
`],
[CardName.SPECIAL_DESIGN,`
        <div class="title background-color-events">Special Design</div>
        <div class="price">4</div>
        <div class="tag tag1 tag-event"></div>
        <div class="tag tag2 tag-science"></div>
      <div class="card-number">206</div>
        <div class="content">
          <div class="tile background-color-corporation" style="width:100px;text-shadow:none;color:black;font-size:11px;padding-top:5px;padding-bottom:5px;">Temp / O2 / Ocean</div>: +/- 2
          <div class="description">
            (The next card you play this generation is +2 or -2 steps in global requirements, your choice.)
          </div>
        </div>
`],
[CardName.MEDICAL_LAB,`
        <div class="title background-color-automated">Medical Lab</div>
        <div class="price">13</div>
        <div class="tag tag1 tag-building"></div>
        <div class="tag tag2 tag-science"></div>
        <div class="corporate-icon project-icon"></div>
      <div class="card-number">207</div>
        <div class="content">
          <div class="points points-big">1</div>
          <div class="production-box production-box-size3">
            <div class="money production">1</div> / 2 <div class="resource-tag tag-building"></div>
          </div>
          <div class="description">
            (Increase your MC production 1 step for every 2 Building tags you have, including this.)
          </div>
        </div>
`],
[CardName.AI_CENTRAL,`
          <div class="title background-color-active ">AI Central</div>
          <div class="price ">21</div>
          <div class="tag tag1 tag-building "></div>
          <div class="tag tag2 tag-science "></div>
          <div class="corporate-icon project-icon"></div>
      <div class="card-number">208</div>
          <div class="content ">
            <div class="points points-big">1</div>
              <div class="requirements">3 Science</div>
              <span class="red-arrow "></span> <span class="card resource "></span><span class="card resource "></span>
              <div class="description ">
                  (Action: Draw 2 cards.)
              </div>
              <div class="production-box production-box-size1a" style="margin-right:135px;margin-top:10px;">
                  <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
              </div>
              <div class="description" style="position:absolute;text-align:left;margin-top:-53px;margin-left:85px;">
                (Requires 3 Science tags to play. Decrease your Energy production 1 step.)
              </div>
          </div>
`],
[CardName.SELF_REPLICATING_ROBOTS,`
          <div class="title background-color-active ">Self-replicating robots</div>
          <div class="price ">7</div>
          <div class="promo-icon project-icon"></div>
          <div class="card-number">210</div>
          <div class="content ">
            <div class="requirements">2 Science</div>
            <div class="red-arrow "></div>
            <div class="resource card"><div class="production" style="position:absolute;background:white;color:black;margin-left:-4px;margin-top:7px;">2</div><div class="card-icon card-icon-space">&#x2734;</div><div class="card-icon card-icon-building" style="margin-left:37px">&#x2617;</div></div>
            &nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;
            <div class="red-arrow "></div>
            <div class="production" style="background:white;color:black;vertical-align:middle">X</div> x2
            <div class="description">
              (Action: Reveal and place a SPACE OR BUILDING card here from hand, and place 2 resources on it, OR double the resources on a card here.) <br>
              (Effect: Card here may be played as if from hand with its cost reduced by the number of resources on it.)<br>
              (Requires 2 Science tags.)
            </div>
          </div>
`],
[CardName.PENGUINS,`
            <div class="title background-color-active ">Penguins</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-animal "></div>
            <div class="promo-icon project-icon"></div>
            <div class="card-number">212</div>
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
[CardName.AERIAL_MAPPERS,`
          <div class="title background-color-active">Aerial Mappers</div>
          <div class="price">11</div>
          <div class="tag tag1 tag-venus"></div>
          <div class="venus-icon project-icon"></div>
          <div class="card-number">213</div>
          <div class="content">
            <div class="points points-big">1</div>
            <div class="red-arrow"></div>
            <div class="floater resource"></div>* OR <div class="floater resource"></div> <div class="red-arrow"></div> <div class="card resource"></div><br>
            <div class="description">
              (Action: Add 1 Floater to ANY card or spend 1 Floater here to draw 1 card)
            </div>
          </div>
`],
[CardName.AEROSPORT_TOURNAMENT,`
            <div class="title background-color-events ">Aerosport Tournament</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-event "></div>
            <div class="venus-icon project-icon"></div>
      <div class="card-number">214</div>
            <div class="content ">
                <div class="points points-big ">1</div>
                <div class="requirements ">5 Floaters</div>
                <div class="resource money">1</div> / <div class="tile city-tile-small red-outline"></div>
                <div class="description">
                  (Requires that you have 5 Floaters. Gain 1 MC per each City tile in play)
                </div>
            </div>
`],
[CardName.AIR_SCRAPPING_EXPEDITION,`
            <div class="title background-color-events ">Air-Scrapping Expedition</div>
            <div class="price ">13</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
      <div class="card-number">215</div>
            <div class="content ">
              <div class="tile venus-tile">V</div> &nbsp;&nbsp;
                <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                  <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                    <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                <div class="description">
                  (Raise Venus 1 step. Add 3 Floaters to ANY Venus CARD)
                </div>
            </div>
`],
[CardName.ATALANTA_PLANITIA_LAB,`
            <div class="title background-color-automated ">Atalanta Planitia Lab</div>
            <div class="price ">10</div>
            <div class="tag tag1 tag-science "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
      <div class="card-number">216</div>
            <div class="content ">
              <div class="points points-big">2</div>
              <div class="requirements">3 Science</div>
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description">
              (Requires 3 science tags. Draw 2 cards.)
              </div>
            </div>
`],
[CardName.ATMOSCOOP,`
            <div class="title background-color-automated ">Atmoscoop</div>
            <div class="price ">22</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-jovian "></div>
            <div class="venus-icon project-icon"></div>
      <div class="card-number">217</div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements">3 Science</div>
              <div class="tile temperature-tile" style="width:24px"></div><div class="tile temperature-tile" style="width:24px"></div> OR
              <div class="tile venus-tile" style="width:20px">V</div><div class="tile venus-tile" style="width:20px">V</div>
              <span>*</span><div class="resource floater" style="margin-left:8px;"></div><div class="resource floater"></div>
              <div class="description" style="text-align:left;position:absolute;margin-top:-8px;">
                (Requires 3 Science tags. Either raise the temperature 2 steps, or raise Venus 2 steps. Add 2 Floaters to ANY card)
              </div>
            </div>
`],
[CardName.COMET_FOR_VENUS,`
            <div class="title background-color-events ">Comet for Venus</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
      <div class="card-number">218</div>
            <div class="content ">
              <div class="tile venus-tile">V</div> &nbsp;&nbsp;
                - <div class="resource money red-outline">4<div class="card-icon card-icon-venus" style="color: white;margin-top: -39px;">V</div></div>
                <div class="description">
                  (Raise Venus 1 step. Remove up to 4MC from any player WITH A VENUS TAG IN PLAY.)
                </div>
            </div>
`],
[CardName.CORRODER_SUITS,`
            <div class="title background-color-automated ">Corroder Suits</div>
            <div class="price ">8</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
      <div class="card-number">219</div>
            <div class="content ">
              <div class="production-box"><div class="production money">2</div></div>
               <div class="resource" style="background:white;margin-left:20px;">?<div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;margin-left: 16px;">V</div></div>
              <div class="description">
                (Increase your MC production 2 steps. Add 1 resource to ANY Venus CARD)
              </div>
            </div>
`],
[CardName.DAWN_CITY,`
            <div class="title background-color-automated ">Dawn City</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">220</div>
            <div class="content ">
              <div class="points points-big">3</div>
                <div class="requirements">4 Science</div>
                  <div class="production-box production-box-size1a">
                      <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
                      <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="titanium production"></div>
                  </div> <div class="tile city-tile" style="margin-left:20px"></div>*
              <div class="description" style="margin-top:-5px;">
                (Requires 4 Science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a City tile on the RESERVED AREA)
              </div>
            </div>
`],
[CardName.DEUTERIUM_EXPORT,`
            <div class="title background-color-active ">Deuterium Export</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-power "></div>
            <div class="tag tag3 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">221</div>
            <div class="content ">
                <div class="red-arrow " style="margin-left:53px;"></div> <div class="floater resource "></div> <br> OR
                <div class="floater resource "></div> <div class="red-arrow "></div>   <div class="production-box "><div class="energy production "></div></div>
                <div class="description ">
                  (Action: add 1 Floater to this card OR spend 1 Floater here to increase your energy production 1 step)
                </div>
            </div>
`],
[CardName.DIRIGIBLES,`
            <div class="title background-color-active ">Dirigibles</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">222</div>
            <div class="content ">
                <div class="red-arrow "></div> <div class="floater resource "></div>* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
              <div class="resource-tag tag-venus"></div>  : <div class="floater resource "></div> = <div class="money resource ">3</div>
                <div class="description ">
                  (Action: add 1 Floater to ANY card.)<br><br>
                  (Effect: when playing a Venus tag, Floaters here may be used as payment, and are worth 3MC each)
                </div>
            </div>
`],
[CardName.EXTRACTOR_BALLOONS,`
            <div class="title background-color-active ">Extractor Balloons</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">223</div>
            <div class="content ">
                <div class="red-arrow " style="margin-left:95px"></div> <div class="floater resource "></div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
              OR <div class="floater resource "></div><div class="floater resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile ">V</div>
                <div class="description ">
                  (Action: add 1 Floater to this card, or remove 2 Floaters here to raise Venus 1 step)
                </div>
                <br>
                <div class="floater resource "></div><div class="floater resource "></div><div class="floater resource "></div>
                <div class="description ">
                  (Add 3 Floaters to this card)
                </div>
            </div>
`],
[CardName.EXTREMOPHILES,`
            <div class="title background-color-active ">Extremophiles</div>
            <div class="price ">3</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">224</div>
            <div class="content ">
              <div class="points">1/3<div class="resource microbe"></div></div>
              <div class="requirements">2 Science</div>
                <div class="red-arrow "></div> <div class="resource microbe"></div>*
                <div class="description ">
                  (Action: add 1 Microbe to ANY card)
                </div><br>
                <div class="description ">
                  (Requires 2 Science tags. 1 VP for every 3rd Microbe on this card)
                </div>
            </div>
`],
[CardName.FLOATING_HABS,`
            <div class="title background-color-active ">Floating Habs</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">225</div>
            <div class="content ">
              <div class="points">1/2<div class="resource floater"></div></div>
              <div class="requirements">2 Science</div>
                <div class="resource money">2</div> <div class="red-arrow "></div> <div class="resource floater"></div>*
                <div class="description ">
                  (Action: spend 2 MC to add 1 Floater to ANY card)
                </div><br>
                <div class="description ">
                  (Requires 2 Science tags. 1 VP for every 2nd Floater on this card)
                </div>
            </div>
`],
[CardName.FORCED_PRECIPITATION,`
            <div class="title background-color-active ">Forced Precipitation</div>
            <div class="price ">8</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">226</div>
            <div class="content ">
                <div class="money resource " style="margin-left: 60px;">2</div> <div class="red-arrow "></div> <div class="floater resource "></div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
              OR <div class="floater resource "></div><div class="floater resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile ">V</div>
                <div class="description ">
                  (Action: Spend 2 MC to add 1 Floater to this card, OR spend 2 Floaters here to increase Venus 1 step)
                </div>
            </div>
`],
[CardName.FREYJA_BIODOMES,`
            <div class="title background-color-automated ">Freyja Biodomes</div>
            <div class="price ">14</div>
            <div class="tag tag1 tag-plant "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">227</div>
            <div class="content ">
              <div class="points points-big">2</div>
                <div class="requirements">10% Venus</div>
               <div class="resource microbe"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div> <div class="resource microbe"><div class="card-icon card-icon-venus" style="font-weight:bold;color: white;margin-top: -36px;">V</div></div>
              &nbsp;&nbsp;  OR &nbsp;&nbsp;
               <div class="resource animal"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div> <div class="resource animal"><div class="card-icon card-icon-venus" style="font-weight:bold;color: white;margin-top: -36px;">V</div></div>
               <div class="production-box production-box-size1a" style="margin-left:135px;">
                   <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
                   <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
               </div>
               <div class="description" style="position:absolute;margin-top:-90px;margin-left:10px;text-align:left; width: 120px">
                 (Requires 10% Venus. Add 2 Microbes or 2 Animals to another Venus card. Decrease your energy production 1 step and increase your MC production 2 steps)
              </div>
            </div>
`],
[CardName.GHG_IMPORT_FROM_VENUS,`
            <div class="title background-color-events ">GHG Import From Venus</div>
            <div class="price ">23</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="tag tag3 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">228</div>
            <div class="content ">
              <div class="tile venus-tile">V</div> &nbsp;&nbsp;
              <div class="production-box production-box-size3">
                <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
              </div>
                <div class="description">
                  (Raise Venus 1 step. Increase your heat production 3 steps)
                </div>
            </div>
`],
[CardName.GIANT_SOLAR_SHADE,`
            <div class="title background-color-automated ">Giant Solar Shade</div>
            <div class="price ">27</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">229</div>
            <div class="content ">
            <div class="tile venus-tile">V</div><div class="tile venus-tile">V</div><div class="tile venus-tile">V</div>
               <div class="description">
                 (Raise Venus 3 steps)
            </div>
`],
[CardName.GYROPOLIS,`
            <div class="title background-color-automated ">Gyropolis</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-building "></div>
            <div class="tag tag2 tag-city "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">230</div>
            <div class="content ">
              <div class="production-box production-box-size3">
                  <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><div class="energy production"></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">1</div> / <div class="resource-tag tag-venus"></div>
                  <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">1</div> / <div class="resource-tag tag-earth"></div>
              </div>
              <div class="tile city-tile" style="margin-left:20px"></div>
               <div class="description">
                 (Decrease your energy production 2 steps. Increase your MC production 1 step for each Venus and Earth tag you have. Place a City tile)
            </div>
`],
[CardName.HYDROGEN_TO_VENUS,`
            <div class="title background-color-events ">Hydrogen to Venus</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">231</div>
            <div class="content ">
              <div class="tile venus-tile">V</div><br><br>
              <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div> / <div class="resource-tag tag-jovian"></div><br><br>
                <div class="description">
                  (Raise Venus 1 step. Add 1 Floater to A Venus CARD for each Jovian tag you have)
                </div>
            </div>
`],
[CardName.IO_SULPHUR_RESEARCH,`
            <div class="title background-color-automated ">Io Sulphur Research</div>
            <div class="price ">17</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="tag tag2 tag-science "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">232</div>
            <div class="content ">
              <div class="points points-big">2</div>
              <div class="resource card"></div> OR <br>
              <div class="resource-tag tag-venus"></div>
              <div class="resource-tag tag-venus" style="margin-left:-15px;"></div>
              <div class="resource-tag tag-venus" style="margin-left:-15px;"></div> :
              <div class="resource card"></div><div class="resource card" style="margin-left:-15px;"></div><div class="resource card" style="margin-left:-15px;"></div>
               <div class="description">
                 (Draw 1 card, or draw 3 if you have at least 3 Venus tags)
            </div>
`],
[CardName.ISHTAR_MINING,`
            <div class="title background-color-automated ">Ishtar Mining</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">233</div>
            <div class="content ">
              <div class="requirements">8% Venus</div>
                <div class="production-box ">
                    <div class="titanium production"></div>
                </div>
               <div class="description">
                 (Requires Venus 8%. Increase your titanium production 1 step)
            </div>
`],
[CardName.JET_STREAM_MICROSCRAPPERS,`
            <div class="title background-color-active ">Jet Stream Microscrappers</div>
            <div class="price ">12</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">234</div>
            <div class="content ">
                <div class="titanium resource "></div> <div class="red-arrow "></div> <div class="floater resource "></div><div class="floater resource "></div><br>
              OR <div class="floater resource "></div><div class="floater resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile ">V</div>
                <div class="description ">
                  (Action: Spend 1 titanium to add 2 Floaters here, OR spend 2 Floaters here to raise Venus 1 step)
                </div>
            </div>
`],
[CardName.LOCAL_SHADING,`
            <div class="title background-color-active ">Local Shading</div>
            <div class="price ">4</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">235</div>
            <div class="content ">
                <div class="red-arrow "></div> <div class="floater resource "></div> <br>
              OR <div class="floater resource "></div> <div class="red-arrow "></div>
              <div class="production-box">
                  <div class="money production">1</div>
              </div>
                <div class="description ">
                  (Action: add 1 Floater to this card, or spend 1 Floater here to raise your MC production 1 step)
                </div>
            </div>
`],
[CardName.LUNA_METROPOLIS,`
            <div class="title background-color-automated ">Luna Metropolis</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-earth "></div>
            <div class="tag tag3 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">236</div>
            <div class="content ">
              <div class="points points-big">2</div>
                <div class="production-box production-box-size2a">
                    <div class="money production">1</div> / <div class="resource-tag tag-earth"></div>
                </div>
                <div class="tile city-tile" style="margin-left:20px"></div>*
               <div class="description">
                 (Increase your MC production 1 step for each Earth tag you have, including this. Place a City tile on the RESERVED AREA)
            </div>
          </div>
`],
[CardName.LUXURY_FOODS,`
            <div class="title background-color-automated ">Luxury Foods</div>
            <div class="price ">8</div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">237</div>
            <div class="content ">
              <div class="points points-big">2</div>
              <div class="requirements"> Venus Earth Jovian</div>
            </div>
`],
[CardName.MAXWELL_BASE,`
            <div class="title background-color-active ">Maxwell Base</div>
            <div class="price ">18</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">238</div>
            <div class="content ">
              <div class="points points-big">3</div>
              <div class="requirements">12% Venus</div>
                <div class="red-arrow "></div> <div class="resource " style="background:white;">?<div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;margin-left: 17px;font-weight:bold;">V</div></div>
                <div class="description " style="margin-top:-5px">
                  (Action: Add 1 resource to ANOTHER VENUS CARD)
                </div>
              <div class="production-box production-box-size1a">
                    <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div>
              </div>
              <div class="tile city-tile" style="margin-left:20px"></div>*
              <div class="description" style="text-align:left;margin-top:-8px; width: 223px">
                Requires Venus 12%. Decrease your energy production 1 step.
              </div>
              <div class="description" style="text-align:left;width: 108px; margin: 5px 0 0 24px">
                Place a City tile ON THE RESERVED AREA.
              </div>
            </div>
`],
[CardName.MINING_QUOTA,`
            <div class="title background-color-automated ">Mining Quota</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-building"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">239</div>
            <div class="content ">
              <div class="requirements"> Venus Earth Jovian</div>
              <div class="production-box production-box-size2">
                  <div class="steel production"></div><div class="steel production"></div>
              </div>
              <div class="description">
              (Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps)
              </div>
            </div>
`],
[CardName.NEUTRALIZER_FACTORY,`
            <div class="title background-color-automated ">Neutralizer Factory</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">240</div>
            <div class="content ">
              <div class="requirements"> 10% Venus</div>
              <div class="tile venus-tile">V</div>
              <div class="description">
                (Requires Venus 10%. Increase the Venus track 1 step)
              </div>
            </div>
`],
[CardName.OMNICOURT,`
            <div class="title background-color-automated ">Omnicourt</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-building"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">241</div>
            <div class="content ">
              <div class="requirements">Venus Earth Jovian</div>
              <div class="tile rating"></div>  <div class="tile rating"></div>
              <div class="description">
                (Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.)
              </div>
            </div>
`],
[CardName.ORBITAL_REFLECTORS,`
            <div class="title background-color-automated ">Orbital Reflectors</div>
            <div class="price ">26</div>
            <div class="tag tag1 tag-space"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">242</div>
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
[CardName.ROTATOR_IMPACTS,`
            <div class="title background-color-active ">Rotator Impacts</div>
            <div class="price ">6</div>
            <div class="tag tag1 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">243</div>
            <div class="content ">
                <div class="requirements requirements-max">max 14% Venus</div>
                <div class=" money resource ">6</div> (<span class="titanium " style="margin:0px;padding:1px;padding-top:3px;border-radius:5px; "></span>)
                <span class="red-arrow "></span> <div class="resource" style="background:black;color:#bbb;">A</div> <br>
                OR <div class="resource" style="background:black;color:#bbb;">A</div> <span class="red-arrow "></span> <div class="tile venus-tile">V</div>
                <div class="description ">
                  (Action: spend 6 MC to add an asteroid resource to this card (TITANIUM MAY BE USED), or spend 1 resource from this card to increase Venus 1 step)
                  <br>(Venus must be 14% or lower)
                </div>
            </div>
`],
[CardName.SISTER_PLANET_SUPPORT,`
            <div class="title background-color-automated ">Sister Planet Support</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">244</div>
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
[CardName.SOLARNET,`
            <div class="title background-color-automated ">Solarnet</div>
            <div class="price ">7</div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">245</div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements"> Venus Earth Jovian</div>
              <div class="resource card"></div> <div class="resource card"></div>
              <div class="description">
                (Requires Venus, Earth and Jovian tags. Draw 2 cards)
              </div>
            </div>
`],
[CardName.SPIN_INDUCING_ASTEROID,`
            <div class="title background-color-events ">Spin-Inducing Asteroid</div>
            <div class="price ">16</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">246</div>
            <div class="content ">
              <div class="requirements requirements-max">max 10% Venus</div>
              <div class="tile venus-tile">V</div> <div class="tile venus-tile">V</div>
                <div class="description">
                  (Venus must be 10% or lower. Raise Venus 2 steps)
                </div>
            </div>
`],
[CardName.SPONSORED_ACADEMIES,`
            <div class="title background-color-automated ">Sponsored Academies</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="tag tag2 tag-science"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">247</div>
            <div class="content ">
              <div class="points points-big">1</div>
              - <div class="resource card"></div><br>
              + <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>* + <div class="resource card red-outline"></div>*
              <div class="description">
                (Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card)
              </div>
            </div>
`],
[CardName.STRATOPOLIS,`
            <div class="title background-color-active ">Stratopolis</div>
            <div class="price ">22</div>
            <div class="tag tag1 tag-city "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">248</div>
            <div class="content ">
              <div class="points">1/3<div class="resource floater"></div></div>
              <div class="requirements" style="margin-bottom:15px;">2 Science</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
                <div class="resource floater"><div class="card-icon card-icon-venus">V</div></div>
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
[CardName.STRATOSPHERIC_BIRDS,`
            <div class="title background-color-active ">Stratospheric Birds</div>
            <div class="price ">12</div>
            <div class="tag tag1 tag-animal "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">249</div>
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
[CardName.SULPHUR_EXPORTS,`
            <div class="title background-color-automated ">Sulphur Exports</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">250</div>
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
[CardName.SULPHUR_EATING_BACTERIA,`
            <div class="title background-color-active ">Sulphur-Eating Bacteria</div>
            <div class="price ">6</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">251</div>
            <div class="content ">
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
[CardName.TERRAFORMING_CONTRACT,`
            <div class="title background-color-automated ">Terraforming Contract</div>
            <div class="price ">8</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">252</div>
            <div class="content ">
              <div class="requirements">25 TR</div>
              <div class="production-box">
                  <div class="money production">4</div>
              </div>
              <div class="description">
                (Requires that you have at least 25 TR. Increase your MC production 4 steps.)
              </div>
            </div>
`],
[CardName.THERMOPHILES,`
            <div class="title background-color-active ">Thermophiles</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">253</div>
            <div class="content ">
              <div class="requirements">6% Venus</div>
                <div class="red-arrow " style="margin-left:76px;"></div> <div class="resource microbe"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div>
                <br>
              OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile venus-tile">V</div>
                <div class="description ">
                  (Action: add 1 Microbe to ANY Venus CARD or spend 2 Microbes here to raise Venus 1 step)
                  <br><br>
                  (Requires Venus 6%)
                </div>
            </div>
`],
[CardName.WATER_TO_VENUS,`
            <div class="title background-color-events ">Water to Venus</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-event "></div>
            <div class="tag tag2 tag-space "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">254</div>
            <div class="content ">
              <div class="tile venus-tile">V</div>
                <div class="description">
                  (Raise Venus 1 step.)
                </div>
            </div>
`],
[CardName.VENUS_GOVERNOR,`
            <div class="title background-color-automated ">Venus Governor</div>
            <div class="price ">4</div>
            <div class="tag tag1 tag-venus"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">255</div>
            <div class="content ">
              <div class="requirements">2 Venus</div>
              <div class="production-box">
                  <div class="money production">2</div>
              </div>
              <div class="description">
                (Requires 2 Venus tags. Increase your MC production 2 steps.)
              </div>
            </div>
`],
[CardName.VENUS_MAGNETIZER,`
            <div class="title background-color-active ">Venus Magnetizer</div>
            <div class="price ">7</div>
            <div class="tag tag1 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">256</div>
            <div class="content ">
              <div class="requirements">10% Venus</div>
                <div class="production-box production-box-size1a ">
                    <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                </div>
                <span class="red-arrow " style="margin-left:5px; "></span>
                <div class="tile venus-tile ">V</div>
                <div class="description ">
                    (Action: Decrease your Energy production 1 step to raise Venus 1 step.)
                    <br><br>
                    (Requires Venus 10%.)
                </div>
            </div>
`],
[CardName.VENUS_SOILS,`
            <div class="title background-color-automated ">Venus Soils</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-plant"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">257</div>
            <div class="content ">
              <div class="tile venus-tile">V</div> <br>
              <div class="production-box">
                  <div class="plant production"></div>
              </div>
              <div class="resource microbe" style="margin-left:20px;"></div><div class="resource microbe"></div>*
              <div class="description">
                (Raise Venus 1 step. Increase your Plant production 1 step. Add 2 Microbes to ANOTHER card)
              </div>
            </div>
`],
[CardName.VENUS_WAYSTATION,`
            <div class="title background-color-active ">Venus Waystation</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">258</div>
            <div class="content ">
                <div class="points points-big ">1</div>
                <div class="resource-tag tag-venus"></div> : <div class="money resource ">-2</div>
                <div class="description ">
                    (Effect: When you play a Venus tag, you pay 2 MC less for it.)
                </div>
            </div>
`],
[CardName.VENUSIAN_ANIMALS,`
            <div class="title background-color-active ">Venusian Animals</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-animal "></div>
            <div class="tag tag2 tag-science "></div>
            <div class="tag tag3 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">259</div>
            <div class="content ">
                <div class="points">1/<div class="animal resource "></div></div>
                <div class="requirements">18% Venus</div>
                <div class="resource-tag science"></div> : <div class="animal resource "></div>
                <div class="description ">
                  (Effect: when you play a Science tag, including this, add 1 Animal to this card)
                </div>
            </div>
`],
[CardName.VENUSIAN_INSECTS,`
            <div class="title background-color-active ">Venusian Insects</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-microbe "></div>
            <div class="tag tag2 tag-venus "></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">260</div>
            <div class="content ">
              <div class="points">1/2<div class="resource microbe"></div></div>
              <div class="requirements">12% Venus</div>
                <div class="red-arrow "></div> <div class="resource microbe"></div>
                <div class="description ">
                  (Action: add 1 Microbe to this card.)
                </div><br>
                <div class="description ">
                  (Requires Venus 12%. 1 VP for every 2nd Microbe on this card.)
                </div>
            </div>
`],
[CardName.VENUSIAN_PLANTS,`
            <div class="title background-color-automated ">Venusian Plants</div>
            <div class="price ">13</div>
            <div class="tag tag1 tag-plant"></div>
            <div class="tag tag2 tag-venus"></div>
            <div class="venus-icon project-icon"></div>
            <div class="card-number">261</div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements">16% Venus</div>
              <div class="tile venus-tile">V</div>
              <br><div class="microbe resource"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div> OR
              <div class="animal resource"><div class="card-icon card-icon-venus" style="color: white;margin-top: -36px;font-weight:bold;">V</div></div>
              <div class="description">
                (Requires Venus 16%. Raise Venus 1 step. Add 1 Microbe or 1 Animal to ANOTHER VENUS CARD)
              </div>
            </div>
`],
[CardName.HOUSE_PRINTING,`
            <div class="title background-color-automated ">House Printing</div>
            <div class="price ">10</div>
            <div class="tag tag1 tag-building"></div>
            <div class="prelude-icon project-icon"></div>
            <div class="card-number">P36</div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="production-box">
                <div class="production steel"></div>
              </div><br>
              <div class="description">
                (Increase your steel production 1 step.)
              </div>
            </div>
`],
[CardName.LAVA_TUBE_SETTLEMENT,`
            <div class="title background-color-automated ">Lava Tube Settlement</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-building"></div>
            <div class="tag tag2 tag-city"></div>
            <div class="prelude-icon project-icon"></div>
            <div class="card-number">P37</div>
            <div class="content ">
              <div class="production-box production-box-size1a">
                <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div><br>
                <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">2</div>
              </div><br>
              <div class="tile city-tile"></div>*
              <div class="description">
                (Decrease your energy production 1 step and increase your MC production 2 steps. Place a City Tile on a VOLCANIC AREA regardless of adjacent cities.)
              </div>
            </div>
`],
[CardName.MARTIAN_SURVEY,`
              <div class="title background-color-events ">Martian Survey</div>
              <div class="price ">9</div>
              <div class="tag tag1 tag-event"></div>
              <div class="tag tag2 tag-science"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="card-number">P38</div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="requirements requirements-max ">max 4% O2</div>
                <div class="resource card"></div> <div class="resource card"></div>
                <div class="description">
                  (Oxygen must be 4% or lower. Draw two cards.)
                </div>
              </div>
`],
[CardName.PSYCHROPHILES,`
              <div class="title background-color-active ">PSYCHROPHILES</div>
              <div class="price ">2</div>
              <div class="tag tag1 tag-microbe"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="card-number">P39</div>
              <div class="content ">
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
[CardName.RESEARCH_COORDINATION,`
              <div class="title background-color-automated ">RESEARCH COORDINATION</div>
              <div class="price ">4</div>
              <div class="tag tag1 tag-wild"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="card-number">P40</div>
              <div class="content ">
                After being played, when you perform an action, the wild tag counts as any tag of your choice.
              </div>
`],
[CardName.SF_MEMORIAL,`
              <div class="title background-color-automated ">SF MEMORIAL</div>
              <div class="price ">7</div>
              <div class="tag tag1 tag-building"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="card-number">P41</div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="resource card"></div>
                <div class="description">
                  (Draw 1 card.)
                </div>
              </div>
`],
[CardName.SPACE_HOTELS,`
              <div class="title background-color-automated ">Space hotels</div>
              <div class="price ">12</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-earth"></div>
              <div class="prelude-icon project-icon"></div>
              <div class="card-number">P42</div>
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
[CardName.AIRLINERS,`
            <div class="title background-color-automated ">Airliners</div>
            <div class="price ">11</div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C01</div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="requirements ">3 Floaters</div>
              <div class="production-box">
                <div class="money production">2</div>
              </div><br>
              <div class="floater resource "></div><div class="floater resource "></div>*
              <div class="description">
                (Requires that you have 3 floaters. Increase your MC production 2 steps. Add 2 floaters to ANY card.)
              </div>
            </div>
`],
[CardName.AIR_RAID,`
            <div class="title background-color-events">Air Raid</div>
            <div class="price">0</div>
            <div class="tag tag1 tag-event"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C02</div>
            <div class="content">
              - <div class="resource floater" style="margin-right:20px;"></div>
              STEAL <div class="resource money red-outline">5</div>
              <div class="description">
                (Requires that you lose 1 floater. Steal 5 MC from any player.)
              </div>
            </div>
`],
[CardName.ATMO_COLLECTORS,`
            <div class="title background-color-active ">Atmo Collectors</div>
            <div class="price ">15</div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C03</div>
            <div class="content ">
              <div class="red-arrow "></div> <div class="floater resource "></div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; OR <br>
              <div class="floater resource "></div> <div class="red-arrow "></div> 2<div class="titanium resource "></div> / 3<div class="energy resource "></div> / 4<div class="heat resource "></div>
              <div class="description ">
                (Action: Add 1 floater here, or spend 1 floater here to gain 2 titanium, or 3 energy, or 4 heat.)
              </div>
              <div class="resource floater"></div><div class="resource floater"></div>*
              <br>
              <div class="description ">
                (Add 2 floaters to ANY card.)
              </div>
            </div>
`],
[CardName.COMMUNITY_SERVICES,`
            <div class="title background-color-automated ">Community Services</div>
            <div class="price">13</div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C04</div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="production-box">
                <div class="money production">1</div>
              </div>  / <div class="resource-tag" style="font-size: 42px; vertical-align: middle;background:white">X</div> *
              <div class="description">
                (Increase your MC production 1 step per CARD WITH NO TAGS, including this.)
              </div>
            </div>
`],
[CardName.CONSCRIPTION,`
              <div class="title background-color-events ">Conscription</div>
              <div class="price ">5</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C05</div>
              <div class="content ">
                <div class="points points-big">-1</div>
                <div class="requirements">2 Earth</div>
                <span style="font-size:14px;">NEXT CARD: </span> <div class="resource money">-16</div>
                  <div class="description ">
                    (Requires 2 Earth tags. The next card you play this generation costs 16 MC less.)
                  </div>
              </div>
`],
[CardName.CORONA_EXTRACTOR,`
              <div class="title background-color-automated ">Corona Extractor</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-power"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C06</div>
              <div class="content ">
                <div class="requirements">4 Science</div>
                  <div class="production-box production-box-size1a">
                      4 <div class="energy production"></div>
                  </div>
                  <div class="description ">
                      (Requires 4 science tags. Increase your energy production 4 steps.)
                  </div>
              </div>
`],
[CardName.CRYO_SLEEP,`
              <div class="title background-color-active ">Cryo Sleep</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C07</div>
              <div class="content ">
                <div class="points points-big ">1</div>
                  <div class="triangle triangle-white"></div> : <div class="resource " style="background:white">-1</div>
                  <div class="description ">
                      (Effect: When you trade, you pay 1 less resource for it.)
                  </div>
              </div>
`],
[CardName.EARTH_ELEVATOR,`
            <div class="title background-color-automated">Earth Elevator</div>
            <div class="price">43</div>
            <div class="tag tag1 tag-space"></div>
            <div class="tag tag2 tag-earth"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C08</div>
            <div class="content">
              <div class="points points-big">4</div>
              <div class="production-box production-box-size3">
                <div class="production titanium"></div><div class="production titanium"></div><div class="production titanium"></div>
              </div>
              <div class="description">
                (Increase your titanium production 3 steps.)
              </div>
            </div>
`],
[CardName.ECOLOGY_RESEARCH,`
            <div class="title background-color-automated ">Ecology Research</div>
            <div class="price">21</div>
            <div class="tag tag1 tag-plant"></div>
            <div class="tag tag2 tag-microbe"></div>
            <div class="tag tag3 tag-animal"></div>
            <div class="tag tag-science" style="margin-left:56px;"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C09</div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="production-box production-box-size2a">
                <div class="plant production"></div> / <div class="triangle triangle-black"></div>
              </div><br>
              <div class="resource animal"></div>* <div class="resource microbe" style="margin-left:20px;"></div><div class="resource microbe"></div>*
              <div class="description">
                (Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.)
              </div>
            </div>
`],
[CardName.FLOATER_LEASING,`
            <div class="title background-color-automated ">Floater Leasing</div>
            <div class="price ">3</div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C10</div>
            <div class="content ">
              <div class="production-box">
                <div class="money production">1</div>
              </div> &nbsp;/ 3<div class="resource floater"></div>
              <div class="description">
                (Increase your MC production 1 step per 3 floaters you have.)
              </div>
            </div>
`],
[CardName.FLOATER_PROTOTYPES,`
              <div class="title background-color-events ">Floater Prototypes</div>
              <div class="price ">2</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-science "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C11</div>
              <div class="content ">
                <div class="resource floater"></div><div class="resource floater"></div>*
                  <div class="description ">
                    (Add two floaters to ANOTHER card.)
                  </div>
              </div>
`],
[CardName.FLOATER_TECHNOLOGY,`
              <div class="title background-color-active ">Floater Technology</div>
              <div class="price ">7</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C12</div>
              <div class="content ">
                  <div class="red-arrow "></div> <div class="floater resource "></div>*
                  <div class="description ">
                    (Action: Add 1 floater to ANOTHER card.)
                  </div>
              </div>
`],
[CardName.GALILEAN_WAYSTATION,`
            <div class="title background-color-automated ">Galilean Waystation</div>
            <div class="price ">15</div>
            <div class="tag tag1 tag-space "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C13</div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="production-box production-box-size2a">
                <div class="money production">1</div> / <div class="resource-tag tag-jovian red-outline"></div>
              </div>
              <div class="description">
                (Increase your MC production 1 step for every Jovian tag in play.)
              </div>
            </div>
`],
[CardName.HEAVY_TAXATION,`
              <div class="title background-color-automated ">Heavy Taxation</div>
              <div class="price ">3</div>
              <div class="tag tag1 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C14</div>
              <div class="content ">
                <div class="points points-big">-1</div>
                <div class="requirements">2 Earth</div>
                <div class="production-box"><div class="production money">2</div></div> <div style="margin-left:20px;" class="resource money">4</div>
                  <div class="description ">
                    (Requires 2 Earth tags. Increase your MC production 2 steps, and gain 4MC.)
                  </div>
              </div>
`],
[CardName.ICE_MOON_COLONY,`
            <div class="title background-color-automated ">Ice Moon Colony</div>
            <div class="price ">23</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C15</div>
            <div class="content ">
              <div class="triangle triangle-black"></div> <div class="tile ocean-tile" style="margin-left:20px;"></div>
              <div class="description">
                (Place 1 colony and 1 ocean tile.)
              </div>
            </div>
`],
[CardName.IMPACTOR_SWARM,`
              <div class="title background-color-events ">Impactor Swarm</div>
              <div class="price ">11</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-space "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C16</div>
              <div class="content ">
                <div class="requirements">2 Jovian</div>
                12<div class="resource heat"></div><br>
                - <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>
                  <div class="description ">
                    (Requires 2 Jovian tags. Gain 12 heat. Remove up to 2 plants from any player.)
                  </div>
              </div>
`],
[CardName.INTERPLANETARY_COLONY_SHIP,`
              <div class="title background-color-events ">Interplanetary Colony Ship</div>
              <div class="price ">12</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-space "></div>
              <div class="tag tag3 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C17</div>
              <div class="content ">
                <br>
                <div class="triangle triangle-black"></div><br><br>
                  <div class="description ">
                    (Place a colony.)
                  </div>
              </div>
`],
[CardName.JOVIAN_LANTERNS,`
            <div class="title background-color-active ">Jovian Lanterns</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C18</div>
            <div class="content ">
                <div class="points">1/2<div class="resource floater"></div></div>
                <div class="requirements">Jovian</div>
                <div class="resource titanium"></div> <div class="red-arrow "></div> <div class="resource floater"></div><div class="resource floater"></div>
                <div class="description ">
                  (Action: Spend 1 titanium to add 2 floaters here.)
                </div>
                <div class="tile rating"></div> <div class="resource floater"></div><div class="resource floater"></div>*
                <div class="description " style="margin-top:-5px;text-align:left;">
                  (Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY card. 1VP per 2 floaters.)
                </div>
              </div>
`],
[CardName.JUPITER_FLOATING_STATION,`
            <div class="title background-color-active ">Jupiter Floating Station</div>
            <div class="price ">9</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C19</div>
            <div class="content ">
              <div class="points points-big">1</div>
              <div class="requirements">3 Science</div>
              <div class="red-arrow "></div> <div class="resource floater" style="margin-right:10px;"><div class="card-icon tag-jovian"></div></div> OR<br>
              <div class="red-arrow "></div> <div class="resource money">1</div> / <div class="resource floater"></div> * (max 4)
              <div class="description ">
                (Action: Add 1 floater to a JOVIAN CARD, or gain 1 MC for every floater here (MAX 4).)
              </div><br>
              <div class="description " style="margin-left:-90px;">
                (Requires 3 Science tags.)
              </div>
            </div>
`],
[CardName.LUNA_GOVERNOR,`
              <div class="title background-color-automated ">Luna Governor</div>
              <div class="price ">4</div>
              <div class="tag tag1 tag-earth "></div>
              <div class="tag tag2 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C20</div>
              <div class="content ">
                <div class="requirements">3 Earth</div>
                <div class="production-box"><div class="production money">2</div></div>
                  <div class="description ">
                    (Requires 3 Earth tags. Increase your MC production 2 steps.)
                  </div>
              </div>
`],
[CardName.LUNAR_EXPORTS,`
            <div class="title background-color-automated ">Lunar Exports</div>
            <div class="price ">19</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="tag tag2 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C21</div>
            <div class="content ">
              <div class="production-box production-box-size4">
                <div class="plant production"></div><div class="plant production"></div> OR <div class="money production">5</div>
              </div>
              <div class="description">
                (Increase your plant production 2 steps, or your MC production 5 steps.)
              </div>
            </div>
`],
[CardName.LUNAR_MINING,`
            <div class="title background-color-automated ">Lunar Mining</div>
            <div class="price ">11</div>
            <div class="tag tag1 tag-earth"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C22</div>
            <div class="content ">
              <div class="production-box production-box-size3">
                <div class="titanium production"></div> / 2 <div class="resource-tag tag-earth"></div>
                </div>
              <div class="description">
                (Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.)
              </div>
            </div>
`],
[CardName.MARKET_MANIPULATION,`
              <div class="title background-color-events ">Market Manipulation</div>
              <div class="price ">1</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-earth "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C23</div>
              <div class="content ">
                INCREASE ONE COLONY TILE TRACK 1 STEP. <BR>
                DECREASE ANOTHER COLONY TILE TRACK 1 STEP.
              </div>
`],
[CardName.MARTIAN_ZOO,`
              <div class="title background-color-active ">Martian Zoo</div>
              <div class="price ">12</div>
              <div class="tag tag1 tag-building"></div>
              <div class="tag tag2 tag-animal"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C24</div>
              <div class="content ">
                <div class="points points-big">1</div>
                <div class="requirements">2 Cities</div>
                <div class="resource-tag tag-earth"></div> : <div class="resource animal"></div> <br>
                <div class="red-arrow"></div> <div class="resource money">1</div> / <div class="resource animal"></div>
                <div class="description">
                  <p style="margin-bottom: 4px;">(Effect: When you play an Earth tag, place an animal here.)</p>
                  <p style="margin-bottom: 13px;">(Action: Gain 1MC per animal here.)</p>
                  <div style="margin-left:-93px;">(Requires 2 city tiles in play.)</div>
                </div>
              </div>
`],
[CardName.MINING_COLONY,`
            <div class="title background-color-automated ">Mining Colony</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C25</div>
            <div class="content ">
              <div class="production-box">
                <div class="production titanium"></div>
              </div>
              <div class="triangle triangle-black" style="margin-left:20px;"></div>
              <div class="description" >
                (Increase your titanium production 1 step. Place a colony.)
              </div>
            </div>
`],
[CardName.MINORITY_REFUGE,`
            <div class="title background-color-automated ">Minority Refuge</div>
            <div class="price ">5</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C26</div>
            <div class="content ">
              <div class="production-box">
                <div class="production money">-2</div>
              </div>
              <div class="triangle triangle-black" style="margin-left:20px;"></div>
              <div class="description" >
                (Decrease your MC production 2 steps. Place a colony.)
              </div>
            </div>
`],
[CardName.MOLECULAR_PRINTING,`
              <div class="title background-color-automated ">Molecular Printing</div>
              <div class="price ">11</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C27</div>
              <div class="content ">
                <div class="points points-big ">1</div>
                  <div class="resource money">1</div> / <div class="tile city-tile-small red-outline"></div> <br>
                  <div class="resource money" style="margin-left:-14px;">1</div> / <div class="triangle triangle-red"></div>
                  <div class="description ">
                      <p>(Gain 1MC for each city tile in play.)</p>
                      <p>(Gain 1MC for each colony in play.)</p>
                  </div>
              </div>
`],
[CardName.NITROGEN_FROM_TITAN,`
              <div class="title background-color-automated ">Nitrogen From Titan</div>
              <div class="price ">25</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-jovian"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C28</div>
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
[CardName.PIONEER_SETTLEMENT,`
            <div class="title background-color-automated ">Pioneer Settlement</div>
            <div class="price ">13</div>
            <div class="tag tag1 tag-space"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C29</div>
            <div class="content ">
              <div class="points points-big ">2</div>
              <div class="requirements requirements-max">max 1 Colony</div>
              <div class="production-box">
                <div class="production money">-2</div>
              </div>
              <div class="triangle triangle-black" style="margin-left:20px;"></div>
              <div class="description" >
                (Requires that you have no more than 1 colony. Decrease your MC production 2 steps. Place a colony.)
              </div>
            </div>
`],
[CardName.PRODUCTIVE_OUTPOST,`
            <div class="title background-color-automated ">Productive Outpost</div>
            <div class="price ">0</div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C30</div>
            <div class="content ">
              GAIN ALL YOUR COLONY BONUSES
            </div>
`],
[CardName.QUANTUM_COMMUNICATIONS,`
            <div class="title background-color-automated ">Quantum Communications</div>
            <div class="price">8</div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C31</div>
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="requirements">4 Science</div>
              <div class="production-box production-box-size2a">
                <div class="money production">1</div> / <div class="triangle triangle-red"></div>
              </div><br>
              <div class="description">
                (Requires 4 Science tags. Increase your MC production 1 step for each colony in play.)
              </div>
            </div>
`],
[CardName.RED_SPOT_OBSERVATORY,`
            <div class="title background-color-active ">Red Spot Observatory</div>
            <div class="price ">17</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="tag tag2 tag-science "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C32</div>
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
[CardName.REFUGEE_CAMP,`
              <div class="title background-color-active ">Refugee Camps</div>
              <div class="price ">10</div>
              <div class="tag tag1 tag-earth"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C33</div>
              <div class="content ">
                  <div class="points points-big">1/<div class="resource camp" style="vertical-align:middle;"></div></div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="money production ">1</div>
                  </div>
                  <span class="red-arrow " style="margin-left:5px; "></span>
                  <div class="resource camp"></div>
                  <div class="description ">
                      (Action: Decrease your MC production 1 step to add a camp resource to this card.)<br><br>
                      (1 VP for each camp resource on this card.)
                  </div>
              </div>
`],
[CardName.RESEARCH_COLONY,`
            <div class="title background-color-automated ">Research Colony</div>
            <div class="price ">20</div>
            <div class="tag tag1 tag-space"></div>
            <div class="tag tag2 tag-science"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C34</div>
            <div class="content ">
              <div class="triangle triangle-black"></div>* <div class="resource card" style="margin-left:20px;"></div><div class="resource card"></div>
              <div class="description" >
                (Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.)
              </div>
            </div>
`],
[CardName.RIM_FREIGHTERS,`
              <div class="title background-color-active ">Rim Freighters</div>
              <div class="price ">4</div>
              <div class="tag tag1 tag-space"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C35</div>
              <div class="content ">
                  <div class="triangle triangle-white"></div> : <div class="resource " style="background:white">-1</div>
                  <div class="description ">
                      (Effect: When you trade, you pay 1 less resource for it.)
                  </div>
              </div>
`],
[CardName.SKY_DOCKS,`
              <div class="title background-color-active ">Sky Docks</div>
              <div class="price ">18</div>
              <div class="tag tag1 tag-space"></div>
              <div class="tag tag2 tag-earth"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C36</div>
              <div class="content ">
                <div class="points points-big">2</div>
                <div class="requirements">2 Earth</div>
                  : <span class="money resource ">-1</span>
                  <div class="description ">
                      (Effect: When you play a card, you pay 1 MC less for it.)
                  </div><br>
                  <div class="triangle triangle-white"></div>
                  <div class="description ">
                      (Requires 2 Earth tags. Gain 1 Trade Fleet.)
                  </div>
              </div>
`],
[CardName.SOLAR_PROBE,`
              <div class="title background-color-events ">Solar Probe</div>
              <div class="price ">9</div>
              <div class="tag tag1 tag-event "></div>
              <div class="tag tag2 tag-space "></div>
              <div class="tag tag3 tag-science "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C37</div>
              <div class="content ">
                <div class="points points-big">1</div>
                  <div class="resource card"></div> /
                    <div class="resource-tag science"></div><div class="resource-tag science" style="margin-left:-10px"></div><div class="resource-tag science" style="margin-left:-10px"></div>
                  <div class="description ">
                      (Draw 1 card for every 3 science tags you have, including this.)
                  </div>
              </div>
`],
[CardName.SOLAR_REFLECTORS,`
              <div class="title background-color-automated ">Solar Reflectors</div>
              <div class="price ">23</div>
              <div class="tag tag1 tag-space"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C38</div>
              <div class="content ">
                <div class="production-box production-box-size1a">
                    5 <div class="heat production"></div>
                </div>
                <div class="description">
                  (Increase your heat production 5 steps.)
                </div>
              </div>
`],
[CardName.SPACE_PORT,`
              <div class="title background-color-automated ">Space Port</div>
              <div class="price ">22</div>
              <div class="tag tag1 tag-building "></div>
              <div class="tag tag2 tag-city "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C39</div>
              <div class="content ">
                <div class="requirements">Colony</div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
                      <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">4</div>
                  </div>
                  <div class="tile city-tile " style="margin-left:10px "></div> <div class="triangle triangle-white" style="margin-left:10px "></div><br>
                  <div class="description ">
                      (Requires 1 colony. Decrease your Energy production 1 step and increase your MC production 4 steps. Place a City tile. Gain 1 Trade Fleet.)
                  </div>
              </div>
`],
[CardName.SPACE_PORT_COLONY,`
              <div class="title background-color-automated ">Space Port Colony</div>
              <div class="price ">27</div>
              <div class="tag tag1 tag-space "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C40</div>
              <div class="content ">
                <div class="points">1/2<div class="triangle triangle-red" style="vertical-align:middle;"></div></div>
                <div class="requirements">Colony</div>
                  <div class="triangle triangle-black"></div>* <div class="triangle triangle-white" style="margin-left:20px "></div><br>
                  <div class="description ">
                      (Requires a colony. Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. Gain 1 Trade Fleet. 1VP per 2 colonies in play.)
                  </div>
              </div>
`],
[CardName.SPINOFF_DEPARTMENT,`
            <div class="title background-color-active">Spin-off Department</div>
            <div class="price ">10</div>
            <div class="tag tag1 tag-building"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C41</div>
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
[CardName.SUBZERO_SALT_FISH,`
            <div class="title background-color-active">Sub-Zero Salt Fish</div>
            <div class="price">5</div>
            <div class="tag tag1 tag-animal"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C42</div>
            <div class="content">
              <div class="points">1/2<div class="animal resource"></div>
              </div>
              <div class="requirements">-6 C</div>
              <span class="red-arrow"></span>
              <div class="animal resource"></div>
              <div class="description" style="margin-bottom:5px;">
                (Action: Add 1 Animal to this card.)
              </div>
              <div class="production-box production-box-size1a">
                <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="plant production red-outline"></div>
              </div>
              <div class="description" style="text-align:left;">
                (Requires -6 C. Decrease any Plant production 1 step. 1 VP per 2 Animals on this card.)
              </div>
            </div>
`],
[CardName.TITAN_AIRSCRAPPING,`
            <div class="title background-color-active ">Titan Air-scrapping</div>
            <div class="price ">21</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C43</div>
            <div class="content ">
                <div class="points points-big">2</div>
                <div class="resource titanium"></div> <div class="red-arrow "></div> <div class="resource floater"></div><div class="resource floater"></div> <br>
                OR <div class="resource floater"></div><div class="resource floater"></div> <div class="red-arrow "></div> <div class="tile rating"></div>
                <div class="description ">
                  (Action: Spend 1 titanium to add 2 floaters here, or spend 2 floaters here to increase your TR 1 step.)
                </div>
              </div>
`],
[CardName.TITAN_FLOATER_LAUNCHPAD,`
            <div class="title background-color-active ">Titan Floating Launch-Pad</div>
            <div class="price ">18</div>
            <div class="tag tag1 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C44</div>
            <div class="content ">
                <div class="points points-big">1</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div> <br>
                OR <div class="resource floater"></div> <div class="red-arrow "></div> <div class="triangle triangle-white"></div>
                <div class="description ">
                  (Action: Add 1 floater to ANY JOVIAN CARD, or spend 1 floater here to trade for free.)
                </div>
                <div class="resource floater" style="margin-left:-130px;margin-top:15px;"><div class="card-icon tag-jovian"></div></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                <div class="description" style="position: absolute; margin-left: 87px; margin-top: -36px;">
                  (Add two floaters to ANY JOVIAN CARD.)
                </div>
              </div>
`],
[CardName.TITAN_SHUTTLES,`
            <div class="title background-color-active ">Titan Shuttles</div>
            <div class="price ">23</div>
            <div class="tag tag1 tag-space "></div>
            <div class="tag tag2 tag-jovian "></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C45</div>
            <div class="content ">
                <div class="points points-big">1</div>
                <div class="red-arrow "></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div>
                <div class="resource floater"><div class="card-icon tag-jovian"></div></div> <br>
                OR X<div class="resource floater"></div> <div class="red-arrow "></div> X<div class="resource titanium"></div>
                <div class="description ">
                  (Action: Add 2 floaters to ANY JOVIAN CARD, or spend any number of floaters here to gain the same number of titanium.)
                </div>
              </div>
`],
[CardName.TRADE_ENVOYS,`
              <div class="title background-color-active ">Trade Envoys</div>
              <div class="price ">6</div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C46</div>
              <div class="content ">
                  <div class="triangle triangle-white"></div> : <span style="font-family:Prototype;font-size:23px;font-weight:normal;vertical-align:middle">+1</span>
                  <div class="description " style="margin-top:5px">
                      (Effect: When you trade, you may first increase that Colony Tile track 1 step.)
                  </div>
              </div>
`],
[CardName.TRADING_COLONY,`
              <div class="title background-color-active ">Trading Colony</div>
              <div class="price ">18</div>
              <div class="tag tag1 tag-space "></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C47</div>
              <div class="content ">
                <div class="triangle triangle-white"></div> : <span style="font-family:Prototype;font-size:23px;font-weight:normal;vertical-align:middle">+1</span>
                  <br>
                  <div class="description " style="margin-top:5px;margin-bottom:5px">
                      (Effect: When you trade, you may first increase that Colony Tile track 1 step.)
                  </div>
                  <div class="triangle triangle-black"></div>
                  <br>
                  <div class="description " style="margin-top:5px">
                      (Place a colony.)
                  </div>
              </div>
`],
[CardName.URBAN_DECOMPOSERS,`
            <div class="title background-color-automated">Urban Decomposers</div>
            <div class="price">6</div>
            <div class="tag tag1 tag-microbe"></div>
            <div class="colonies-icon project-icon"></div>
            <div class="card-number">C48</div>
            <div class="content">
              <div class="requirements">Colony City</div>
              <div class="production-box">
                <div class="production plant"></div>
              </div>
              <div class="resource microbe" style="margin-left:20px;"></div><div class="resource microbe"></div>*
              <div class="description">
                (Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.)
              </div>
            </div>
`],
[CardName.WARP_DRIVE,`
              <div class="title background-color-active ">Warp Drive</div>
              <div class="price ">14</div>
              <div class="tag tag1 tag-science"></div>
              <div class="colonies-icon project-icon"></div>
              <div class="card-number">C49</div>
              <div class="content ">
                <div class="points points-big ">2</div>
                <div class="requirements">5 Science</div>
                  <div class="resource-tag tag-space"></div> : <div class="money resource ">-4</div>
                  <div class="description ">
                      (Effect: When you play a Space card, you pay 4 MC less for it.)
                  </div><br>
                  <div class="description ">
                      (Requires 5 Science tags.)
                  </div>
              </div>
`],
[CardName.CREDICOR,`
      <div class="corporationLabel ">CORPORATION</div>
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
[CardName.ECOLINE,`
    <div class="tag tag1 tag-plant"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        7
        <div class="resource plant"></div> <span class="red-arrow"></span>
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
[CardName.HELION,`
    <div class="tag tag1 tag-space"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        X<div class="resource heat"></div> :
        <div class="resource money">X</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Your may use heat as MC. You may not use MC as heat.)
        </div>
      </div>
      <div style="font-size:34px;
                      width:140px;
                      text-align: center;
                      color: #020202;
                      margin-top:5px;
                      border:2px solid black;
                      margin-left:8px;
                      background: #e6e600;
                      box-shadow: 6px 6px 6px grey;
                      border-radius:2px;">
                  helion</div><br>
      <div class="production-box production-box-size3" style="margin-left:20px;margin-top:-50px;">
        <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
      </div>
        <div class="resource money" style="margin-left:20px;">42</div>
      <div class="description" style="text-align:center;">
        (You start with 3 heat production and 42 MC.)
      </div>
    </div>
`],
[CardName.MINING_GUILD,`
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-building"></div>
    <div class="corporationLabel">CORPORATION</div>
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
      5<div class="production steel"></div>
      <div class="production-box" style="margin-top:5px;margin-left:20px;">
        <div class="production steel"></div>
      </div>
      <div class="description" style="margin-top:-5px;text-align:center;">
        (You start with 30 MC, 5 steel, and 1 steel production)
      </div>
    </div>
`],
[CardName.INTERPLANETARY_CINEMATICS,`
    <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel ">CORPORATION</div>
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
          ;
          margin-bottom:15px;">CINEMATICS
        </div><br>
          <div class="resource money " style="margin-left:40px;">30</div>&nbsp;&nbsp;&nbsp;&nbsp; 20<div class="resource steel"></div>
          <div class="description " style="text-align:center ">
              (You start with 20 steel and 30 MC.)
          </div>
      </div>
`],
[CardName.INVENTRIX,`
    <div class="tag tag1 tag-science"></div>
      <div class="corporationLabel ">CORPORATION</div>
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="tile background-color-corporation" style="width:100px;text-shadow:none;color:black;font-size:11px;padding-top:5px;padding-bottom:5px;">Temp / O2 / Ocean</div>: +/- 2
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: Your temperature, oxygen and ocean requirements are +2 or -2 steps, your choice in each case.)
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
[CardName.PHOBOLOG,`
    <div class="tag tag1 tag-space"></div>
    <div class="corporationLabel">CORPORATION</div>
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
[CardName.THARSIS_REPUBLIC,`
    <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel ">CORPORATION</div>
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
[CardName.THORGATE,`
    <div class="tag tag1 tag-power"></div>
    <div class="corporationLabel">CORPORATION</div>
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
[CardName.UNITED_NATIONS_MARS_INITIATIVE,`
    <div class="tag tag1 tag-earth"></div>
    <div class="corporationLabel">CORPORATION</div>
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
[CardName.TERACTOR,`
    <div class="tag tag1 tag-earth"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="corporate-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource-tag tag-earth"></div> :
        <div class="resource money">-3</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: When playing an Earth card, you pay 3 MC less for it.)
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
[CardName.SATURN_SYSTEMS,`
    <div class="tag tag1 tag-jovian"></div>
    <div class="corporationLabel">CORPORATION</div>
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
[CardName.APHRODITE,`
    <div class="tag tag1 tag-plant"></div>
    <div class="tag tag2 tag-venus"></div>
    <div class="corporationLabel">CORPORATION</div>
    <div class="venus-icon corporation-icon"></div>
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="tile venus-tile">V</div> : <div class="resource money">2</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Whenever Venus is terraformed 1 step, you gain 2MC.)
        </div>
      </div>
      <div style="font-size:23px;
                    color: orange;
                    font-weight:bold;
                    margin-top:10px;
                    text-shadow:  6px 6px 6px  grey;
                    text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333,0px -1px #333333, 6px 3px 5px  grey;">
                APHRODITE</div>
                <br><div class="production-box " style="margin-top:5px;margin-left:50px; ">
                <div class="production plant "></div>
            </div>
            <div class="resource money " style="margin-left:20px; ">47</div>
            <div class="description " style="text-align:center; ">
                (You start with 1 plant production and 47 MC)
            </div>
        </div>
`],
[CardName.CELESTIC,`
      <div class="tag tag1 tag-venus"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="pointsCorporation">1/3<div class="resource floater"></div></div>
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater"></div>*
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Add a floater to ANY card.) <br>
          </div>
          <div class="description" style="margin-top:17px;margin-left:17px; width: 120px; text-align:left;">
          (1 VP per 3 floaters <br> on this card.)
          </div>
        </div>
        <div class="celestic" style="font-size:24px;box-shadow:6px 6px 6px grey;margin-left: 9px;margin-bottom:2px">
          <span style="background:linear-gradient(to right, rgb(251,192,137),rgb(251,192,137),rgb(23,185,236));padding-left:5px;">CEL</span><span
          style="background:linear-gradient(to right,rgb(23,185,236),rgb(251,192,137))">ES</span><span style="background:rgb(251,192,137);padding-right:5px;">TIC</span>
        </div>
      </div><br>
        <div class="resource money" style="margin-left:30px;">42</div>
        <div class="resource card" style="margin-left:15px;"><div class="card-icon card-icon-floater">&#x2601;</div></div>
        <div class="resource card"><div class="card-icon card-icon-floater">&#x2601;</div></div>
        <div class="description" style="text-align:center;margin-top:-3px;font-size:10px;">
          (You start with 42 MC. As your first action, reveal cards from the deck until you have revealed 2 cards with a floater icon on it. Take those 2 cards into hand and discard the rest.)
        </div>
`],
[CardName.MANUTECH,`
      <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="venus-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box">
            <div class="production" style="background:white;">?</div>
          </div> :
          <div class="resource" style="background:white;">?</div>
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
[CardName.MORNING_STAR_INC,`
      <div class="tag tag1 tag-venus"></div>
      <div class="corporationLabel">CORPORATION</div>
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
        <div class="resource card" style="margin-left:15px;"><div class="card-icon card-icon-venus">V</div></div>
        <div class="resource card"><div class="card-icon card-icon-venus">V</div></div>
        <div class="resource card"><div class="card-icon card-icon-venus">V</div></div>
        <div class="description" style="text-align:center;margin-top:-4px;">
          (You start with 50 MC. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.)
        </div>
      </div>
`],
[CardName.VIRON,`
      <div class="tag tag1 tag-microbe"></div>
      <div class="corporationLabel">CORPORATION</div>
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
[CardName.CHEUNG_SHING_MARS,`
      <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel">CORPORATION</div>
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
                    &nbsp;Cheung Shing <br><div style="margin-left:10px">	■■MARS■■ </div>
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
[CardName.POINT_LUNA,`
      <div class="tag tag1 tag-space"></div>
      <div class="tag tag2 tag-earth"></div>
        <div class="corporationLabel ">CORPORATION</div>
        <div class="prelude-icon corporation-icon"></div>
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource-tag tag-earth"></div> : <div class="resource card"></div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play an Earth tag, including this, draw a card.)
                </div>
            </div>
            <div class="point luna" style="font-size:22px;
            font-family: Prototype;
            font-weight: normal;
            display:inline-block;
            margin-top: 35px;
            margin-bottom: 5px;
            text-decoration: underline;
            margin-left: 40px;
            -webkit-transform:scale(1.5,1); /* Safari and Chrome */
            -moz-transform:scale(1.5,1); /* Firefox */
            -ms-transform:scale(1.5,1); /* IE 9 */
            -o-transform:scale(1.5,1); /* Opera */
            transform:scale(1.5,1); /* W3C */
            ">POINT<span>&nbsp;</span>LUNA</div>
            </div>
            <div class="description " style="text-align:center;margin-top:0px ">
            <div class="production-box" style="margin-left:-30px;margin-top:-5px;margin-bottom:-5px;"><div class="production titanium"></div></div>
            <div class="resource money" style="margin-left:60px;margin-bottom:15px">38</div><br>
              (You start with 1 titanium production<br> and 38 MC.)
            </div>
`],
[CardName.ROBINSON_INDUSTRIES,`
      <div class="corporationLabel">CORPORATION</div>
      <div class="prelude-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource money">4</div>
          <div class="red-arrow"></div>
          <div class="production-box">
            <div class="production" style="background:white;">?</div>
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
[CardName.VALLEY_TRUST,`
      <div class="tag tag1 tag-earth"></div>
        <div class="corporationLabel ">CORPORATION</div>
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
[CardName.VITOR,`
      <div class="tag tag1 tag-earth"></div>
        <div class="corporationLabel ">CORPORATION</div>
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
                "
                >?</div> : <div class="resource money">3</div>
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
[CardName.ARIDOR,`
      <div class="corporationLabel">CORPORATION</div>
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
[CardName.MONS_INSURANCE,`
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box" style="width:50px;margin-left:-2px">
            -<div class="production red-outline" style="background:white;">?</div>
          </div>
          OR - <div class="resource red-outline" style="background:white;">?</div>:
          PAY<div class="resource money" style="margin-right:-2px">3</div>
          <div class="description" style="text-align:center;margin-top:-2px;">
            (Effect: When a player causes another player to decrease production or lose resources, pay 3MC to the victim,
            or as much as possible.)
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
          (You start with 48 MC. Increase your MC production 4 steps. ALL OPPONENTS DECREASE THEIR MC PRODUCTION 2 STEPS.
          THIS DOES NOT TRIGGER THE EFFECT BELOW.)
        </div>
      </div>
`],
[CardName.ARKLIGHT,`
      <div class="tag tag1 tag-animal"></div>
      <div class="corporationLabel">CORPORATION</div>
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
[CardName.PRISTAR,`
            <div class="corporationLabel ">CORPORATION</div>
            <div class="turmoil-icon corporation-icon"></div>
            <div class="contentCorporation ">
               <div class="pointsCorporation" >1/<div class="resource pristar"></div></div>
                <div class="corporationEffectBox" style="height:140px;margin-top:150px">
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
                    (You start with 53 MC. Decrease your TR 2 steps.<br>
                    1 VP per preservation resource here.)
                </div>
            </div>
`],
[CardName.POLYPHEMOS,`
      <div class="corporationLabel">CORPORATION</div>
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
[CardName.UTOPIA_INVEST,`
<div class="tag tag1 tag-building"></div>
<div class="corporationLabel">CORPORATION</div>
<div class="turmoil-icon corporation-icon"></div>
<div class="contentCorporation">
  <div class="corporationEffectBox">
    <div class="corporationEffectBoxLabel">ACTION</div>
    <div class="production-box">
      <div class="production" style="background:white;">?</div>
    </div>
    <div class="red-arrow"></div>
    4<div class="resource" style="background:white;">?</div>
    <div class="description" style="text-align:center;margin-top:0px;">
      (Action: Decrease any production to gain 4 resources of that kind.)
    </div>
  </div>
  <div class="utopia">
    <div class="utopia1">UTOPIA</div>
    <div class="utopia2">INVEST</div>
  </div>
  <div class="resource money" style="margin-left:35px;margin-right:20px;margin-top:20px;">40</div>
  <div class="production-box production-box-size2">
    <div class="production steel"></div><div class="production titanium"></div>
  </div>
  <div class="description" style="margin-top:-5px;text-align:center;">
    (You start with 40 MC. Increase your steel and titanium production 1 step each.)
  </div>
</div>
`],
[CardName.POSEIDON,`
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tringle triangle-red"></div>: <div class="production-box"><div class="resource money">1</div></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: When any colony is placed, including this, raise your MC production 1 step.)
          </div>
        </div>
        <div class="poseidon">POSEIDON</div>
        <div class="resource money" style="margin-left:50px;margin-right:20px;">45</div> <div class="triangle triangle-black"></div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 45MC. As your first acton, place a colony.)
        </div>
      </div>
`],
[CardName.STORMCRAFT_INCORPORATED,`
      <div class="tag tag1 tag-jovian"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="colonies-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox" style="margin-top: 136px; height: 149px">
          <div class="corporationEffectBoxLabel" style="margin-bottom:5px;" >ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater" style="margin-bottom:5px;"></div>* <br>
          <div class="resource floater"></div> = <div class="resource heat"></div><div class="resource heat"></div>
          <div class="description" style="text-align:center;margin-top:-5px;">
            (Action: Add a floater to ANY card.<br> Effect: Floaters on this card may be used as 2 heat each.) <br>
          </div>
        </div>
        <div class="stormcraft1">STORM</div><div class="stormcraft2">CRAFT</div>
        <div class="stormcraft3">INCOR</div><div class="stormcraft4">PORATED</div>
        <div class="resource money" style="margin-left:60px;">48</div>
        <div class="description" style="margin-left: 20px">
          (You start with 48 MC.)
        </div>
      </div>
`],
[CardName.ARCADIAN_COMMUNITIES,`
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div style="font-size:10px;line-height:12px;margin-top:-5px;margin-bottom:10px;"><span class="red-arrow"></span>ACTION: PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA ADJACENT TO ONE OF YOUR TILES OR MARKED AREAS</div>
          <div class="corporationEffectBoxLabel" style="margin-top:-3px">EFFECT</div>
            <div style="font-size:10px;line-height:12px;margin-top:-5px;">EFFECT: MARKED AREAS ARE RESERVED FOR YOU. WHEN YOU PLACE A TILE THERE, GAIN 3 MC</div>
        </div>
        <div style="font-size:20px;
        padding-left:3px;width:147px;background:#eeeeee;box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 3px 3px 3px grey;margin-left:10px;border-radius:5px;
        margin-bottom:4px;
        border-top: 2px solid rgb(221,221,221);
        border-left: 2px solid rgb(221,221,221);
        border-bottom: 2px solid rgb(137,137,137);
        border-right: 2px solid rgb(137,137,137);">
                    &nbsp;&nbsp;&nbsp;ARCADIAN <br>COMMUNITIES
                </div>
                <div class="resource money" style="margin-left:15px;margin-right:15px;">40</div>
                10<div class="resource steel" style="margin-right:20px;"></div>
                <div class="resource" style="background: linear-gradient(orange, orangered);">&nbsp;</div>*
        <div class="description" style="margin-top:-5px;text-align:center;">(You start with 40 MC and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA.)</div>
      </div>
`],
[CardName.BEGINNER_CORPORATION,`
      <div class="corporationLabel">CORPORATION</div>
      <div class="contentCorporation">
        <div class="corporation-frame">BEGINNER CORPORATION</div>
        <div class="resource money">42</div>
        <div class="description">
          You start with 42 MC. Instead of choosing from 10 cards during setup, you get 10 cards for free.)
        </div>
      </div>
`],
[CardName.PHILARES,`
      <div class="tag tag1 tag-building"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tile empty-tile-small red-outline" style="
            padding: 6px; margin-right: -3px;
          "></div><div class="tile empty-tile-small"></div>
          : <div class="resource" style="background:white;">?</div>
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
[CardName.RECYCLON,`
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-microbe"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:10px">EFFECT</div>
          <div class="resource-tag tag-building"></div> :<div class="resource microbe"></div> OR
          2<div class="resource microbe"></div>:<div class="production-box" style="margin-left:5px;"><div class="production plant"></div></div><br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.)
        </div>
        </div>
        <div  style="font-size:20px;margin-top:5px;margin-bottom:5px; border-radius:25px;padding:10px;font-weight:bold;
        background:red;color:white; box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3), 3px 3px 3px #444; font-family: Prototype;
        font-weight: normal;text-shadow: 0 0 1px black;"> RECYCLON</div>
                </div>
                <div class="resource money" style="margin-left:60px;margin-right:25px;">38</div>
                <div class="production-box" style="margin-left:20px;"><div class="production steel"></div></div>
        <div class="description" style="margin-top:0px;text-align:center;">(You start with 38 MC and 1 steel production.)</div>
`],
[CardName.SPLICE,`
      <div class="tag tag1 tag-microbe"></div>
      <div class="corporationLabel">CORPORATION</div>
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
                <div class="resource card" style="margin-left:20px;"><div class="card-icon card-icon-microbe">&#x2042;</div></div>
        <div class="description" style="margin-top:-2px;margin-left:-7px;margin-right:-7px;text-align:center;">(You start with 44 MC. As your first action, reveal cards until you have revealed a microbe tag. Take that card into hand and discard the rest.)</div>
      </div>
`],
[CardName.LAKEFRONT_RESORTS,`
            <div class="tag tag1 tag-building"></div>
            <div class="corporationLabel ">CORPORATION</div>
            <div class="turmoil-icon corporation-icon"></div>
            <div class="contentCorporation ">
                <div class="corporationEffectBox" style="height:140px;margin-top:150px">
                    <div class="corporationEffectBoxLabel" style="margin-bottom:4px;">EFFECT</div>
                    <div class="resource ocean-resource red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>&nbsp;&nbsp;
                      <div class="resource" style="height:29px;width:30px;background:#eee"></div>
                      <div class="resource ocean-resource" style="position:absolute;margin-left:-39px;margin-top:36px;"></div>
                      :<div class="resource money">3</div>
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
[CardName.TERRALABS_RESEARCH,`
<div class="tag tag1 tag-earth"></div>
<div class="tag tag2 tag-science"></div>
  <div class="corporationLabel ">CORPORATION</div>
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
[CardName.FACTORUM,`
          <div class="tag tag1 tag-building"></div>
          <div class="tag tag2 tag-power"></div>
          <div class="corporationLabel">CORPORATION</div>
          <div class="promo-icon corporation-icon"></div>
          <div class="contentCorporation">
            <div class="corporationEffectBox">
              <div class="corporationEffectBoxLabel" style="margin-bottom:5px">ACTION</div>
              <div class="red-arrow"></div><div class="production-box">
                <div class="production energy"></div>
              </div> * OR
              <div class="resource money">3</div><div class="red-arrow"></div><div class="resource card">
                <div class="card-icon card-icon-building" style="margin-top:-17px;">&#x2617;</div>
              </div>
              <div class="description" style="text-align:center;margin-top:0px;">
                (Action: Increase your energy production 1 step IF YOU HAVE NO ENERGY RESOURCES, or spend 3MC to draw a building card.)
              </div>
            </div>
            <div class="factorum">
              FACTORUM
            </div>
            <div class="resource money" style="margin-left:35px;margin-right:20px;margin-top:20px;">37</div>
            <div class="production-box">
              <div class="production steel"></div>
            </div>
            <div class="description" style="text-align:center;">
              (You start with 37 MC. Increase your steel production 1 step.)
            </div>
          </div>
          `],
[CardName.SEPTUM_TRIBUS,`
      <div class="tag tag1 tag-wild"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="turmoil-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:15px;" >ACTION</div>
          <div class="red-arrow"></div> <div class="resource money">2</div> / <div class="delegate"></div> *
          <div class="description" style="text-align:center;margin-top:5px;">
            (Action: Gain 2 MC for each party where you have at least 1 delegate.)<br>
          </div>
        </div>
        <div class="septem">Septem Tribus</div>
        <div class="resource money" style="margin-left:60px;margin-top:10px">36</div>
        <div class="description" style="text-align:center;margin-top:10px">
          (You start with 36 MC. When you perform an action, the wild tag counts as any tag of your choice.)
        </div>
      </div>
`],
[CardName.ASTRODRILL,`
      <div class="tag tag1 tag-space"></div>
      <div class="corporationLabel">CORPORATION</div>
      <div class="promo-icon corporation-icon"></div>
      <div class="contentCorporation">
        <div class="corporationEffectBox" style="height:160px;margin-top:130px">
          <div class="corporationEffectBoxLabel" >ACTION</div>
          <div class="red-arrow"></div> <div class="asteroid resource">A</div> * / <div class="resource " style="background:white;">?</div> OR <br>
          <div class="asteroid resource">A</div><div class="red-arrow"></div> 3 <div class="resource titanium"></div>
          <div class="description" style="text-align:center;">
            (Action: Add an asteroid resource to ANY card and gain any standard resource, OR remove an asteroid resource from this card to gain 3 titanium.)<br>
          </div>
        </div>
        <div class="astrodrill">Astrodrill</div>
        <div class="resource money" style="margin:3px 40px 0px 50px">38</div>
        3 <div class="asteroid resource">A</div>
        <div class="description" style="text-align:center">
          (You start with 38 MC and 3 asteroid resources.)
        </div>
      </div>
`],
[CardName.ALLIED_BANKS,`
      <div class="title background-color-prelude">Allied Banks</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P01</div>
      <div class="content">
        <div class="production-box">
          <div class="production money">4</div>
        </div><br>
        <div class="resource money">3</div>
        <div class="description">
          Increase your MC production 4 steps. Gain 3 MC.
        </div>
      </div>
`],
[CardName.AQUIFER_TURBINES,`
      <div class="title background-color-prelude">Aquifer Turbines</div>
      <div class="tag tag1 tag-power"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P02</div>
      <div class="content">
        <div class="tile ocean-tile"></div>
        <div class="production-box production-box-size2">
          <div class="production energy"></div><div class="production energy"></div>
        </div><br>
        - <div class="resource money">3</div>
        <div class="description">
          Place an Ocean. Increase your energy production 2 steps. Pay 3 MC.
        </div>
      </div>
`],
[CardName.BIOFUELS,`
      <div class="title background-color-prelude">Biofuels</div>
      <div class="tag tag1 tag-microbe"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P03</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production energy"></div><div class="production plant"></div>
        </div><br>
        <div class="resource plant"></div><div class="resource plant"></div>
        <div class="description">
          Increase your energy and plant production 1 step. Gain 2 plants.
        </div>
      </div>
`],
[CardName.BIOLAB,`
      <div class="title background-color-prelude">Biolab</div>
      <div class="tag tag1 tag-science"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P04</div>
      <div class="content">
        <div class="production-box ">
          <div class="production plant"></div>
        </div><br>
        <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>
        <div class="description">
          Increase your plant production 1 step. Draw 3 cards.
        </div>
      </div>
`],
[CardName.BIOSPHERE_SUPPORT,`
      <div class="title background-color-prelude">Biosphere Support</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P05</div>
      <div class="content">
        <div class="production-box production-box-size2a">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="production money">1</div><br>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="production plant"></div><div class="production plant"></div>
        </div><br>
        <div class="description">
          Increase your plant production 2 steps. Decrease your MC production 1 step.
        </div>
      </div>
`],
[CardName.BUSINESS_EMPIRE,`
      <div class="title background-color-prelude">Business Empire</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P06</div>
      <div class="content">
        <div class="production-box">
          <div class="production money">6</div>
        </div><br>
        - <div class="resource money">6</div>
        <div class="description">
          Increase your MC production 6 steps. Pay 6 MC.
        </div>
      </div>
`],
[CardName.DOME_FARMING,`
      <div class="title background-color-prelude">Dome Farming</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="tag tag2 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P07</div>
      <div class="content">
        <div class="production-box">
          <div class="production money">2</div><div class="production plant"></div>
        </div><br>
        <div class="description">
          Increase your MC production 2 steps and plant production 1 step.
        </div>
      </div>
`],
[CardName.DONATION,`
      <div class="title background-color-prelude">Donation</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P08</div>
      <div class="content">
        <div class="resource money">21</div>
        <div class="description">
          Gain 21 MC.
        </div>
      </div>
`],
[CardName.EARLY_SETTLEMENT,`
      <div class="title background-color-prelude">Early Settlement</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-city"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P09</div>
      <div class="content">
        <div class="production-box">
          <div class="production plant"></div>
        </div> <div class="tile city-tile"></div>
        <div class="description">
          Increase your plant production 1 step. Place a city tile.
        </div>
      </div>
`],
[CardName.ECOLOGY_EXPERTS,`
      <div class="title background-color-prelude">Ecology Experts</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-microbe"></div>
      <div class="tag tag2 tag-plant"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P10</div>
      <div class="content">
        <div class="production-box">
          <div class="production plant"></div>
        </div><br>
        <div class="requirements" style="margin-left:31px; width:70%;"><div style="color:red;font-size:56px;display:inline-block;">X</div><div style="position:absolute;margin-top:-40px;margin-left:6px;">Project Requirements</div></div>
        <div class="description">
          Increase your plant production 1 step. Play a card from hand, ignoring global requirements.
        </div>
      </div>
`],
[CardName.ECCENTRIC_SPONSOR,`
      <div class="title background-color-prelude">Eccentric Sponsor</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P11</div>
      <div class="content">
        <div class="resource card"></div> : <div class="resource money">-25</div>
        <div class="description">
          Play 1 card from hand with a 25 MC reduction.
        </div>
      </div>
`],
[CardName.EXPERIMENTAL_FOREST,`
      <div class="title background-color-prelude">Experimental Forest</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P12</div>
      <div class="content">
        <div class="tile greenery-tile"></div>
        <div class="resource card"><div class="card-icon card-icon-plant">&#x1F331;&#xFE0E;</div></div> <div class="resource card"><div class="card-icon card-icon-plant">&#x1F331;&#xFE0E;</div></div>
        <div class="description">
          Place 1 Greenery Tile. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.
        </div>
      </div>
`],
[CardName.GALILEAN_MINING,`
      <div class="title background-color-prelude">Galilean Mining</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-jovian"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P13</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production titanium"></div><div class="production titanium"></div>
        </div><br>
        - <div class="resource money">5</div>
        <div class="description">
          Increase your titanium production 2 steps. Pay 5 MC.
        </div>
      </div>
`],
[CardName.GREAT_AQUIFER,`
      <div class="title background-color-prelude">Great Aquifer</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P14</div>
      <div class="content">
        <div class="tile ocean-tile"></div> <div class="tile ocean-tile"></div>
        <div class="description">
          Place 2 Ocean tiles.
        </div>
      </div>
`],
[CardName.HUGE_ASTEROID,`
      <div class="title background-color-prelude">Huge Asteroid</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P15</div>
      <div class="content">
        <div class="tile temperature-tile"></div><div class="tile temperature-tile"></div><div class="tile temperature-tile"></div><br>
        - <div class="resource money">5</div>
        <div class="description">
          Increase Temperature 3 steps. Pay 5 MC.
        </div>
      </div>
`],
[CardName.IO_RESEARCH_OUTPOST,`
      <div class="title background-color-prelude">IO Research Outpost</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-jovian"></div>
      <div class="tag tag2 tag-science"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P16</div>
      <div class="content">
        <div class="production-box"><div class="production titanium"></div></div><br>
        <div class="resource card"></div>
        <div class="description">
          Increase your titanium production 1 step. Draw a card.
        </div>
      </div>
`],
[CardName.LOAN,`
      <div class="title background-color-prelude">Loan</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P17</div>
      <div class="content">
        <div class="production-box production-box-size1a">
          <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="money production">2</div>
        </div><br>
        <div class="resource money">30</div>
        <div class="description">
          Gain 30 MC. Decrease your MC production 2 steps.
        </div>
      </div>
`],
[CardName.MARTIAN_INDUSTRIES,`
      <div class="title background-color-prelude">Martian Industries</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P18</div>
      <div class="content">
        <div class="production-box production-box-size2" style="vertical-align: bottom;">
          <div class="production energy"></div><div class="production steel"></div>
        </div><br>
        <div class="resource money">6</div>
        <div class="description">
          Increase your energy and steel production 1 step. Gain 6 MC.
        </div>
      </div>
`],
[CardName.METAL_RICH_ASTEROID,`
      <div class="title background-color-prelude">Metal-Rich Asteroid</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P19</div>
      <div class="content">
        <div class="tile temperature-tile"></div>
        <div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          Increase temperature 1 step. Gain 4 titanium and 4 steel.
        </div>
      </div>
`],
[CardName.METALS_COMPANY,`
      <div class="title background-color-prelude">Metals Company</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P20</div>
      <div class="content">
        <div class="production-box production-box-size3">
          <div class="production money">1</div><div class="production steel"></div><div class="production titanium"></div>
        </div><br>
        <div class="description">
          Increase your MC, steel and titanium production 1 step.
        </div>
      </div>
`],
[CardName.MINING_OPERATIONS,`
      <div class="title background-color-prelude">Mining Operations</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P21</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production steel"></div><div class="production steel"></div>
        </div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          Increase your steel production 2 steps. Gain 4 steel.
        </div>
      </div>
`],
[CardName.MOHOLE,`
      <div class="title background-color-prelude">Mohole</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P22</div>
      <div class="content">
        <div class="production-box production-box-size3">
          <div class="production heat"></div><div class="production heat"></div><div class="production heat"></div>
        </div><br>
        <div class="resource heat"></div><div class="resource heat"></div><div class="resource heat"></div>
        <div class="description">
          Increase your heat production 3 steps. Gain 3 heat.
        </div>
      </div>
`],
[CardName.MOHOLE_EXCAVATION,`
      <div class="title background-color-prelude">Mohole Excavation</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P23</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production steel"></div><br>
          <div class="production heat"></div><div class="production heat"></div>
        </div> &nbsp;&nbsp;
        <div class="resource heat"></div><div class="resource heat"></div>
        <div class="description">
          Increase your steel production 1 step and heat production 2 steps. Gain 2 heat.
        </div>
      </div>
`],
[CardName.NITROGEN_SHIPMENT,`
      <div class="title background-color-prelude">Nitrogen Shipment</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P24</div>
      <div class="content">
        <div class="production-box ">
          <div class="production plant"></div>
        </div> &nbsp; <div class="tile rating"></div><br>
        <div class="resource money">5</div>
        <div class="description">
          Increase your plant production 1 step. Increase your TR 1 step. Gain 5 MC.
        </div>
      </div>
`],
[CardName.ORBITAL_CONSTRUCTION_YARD,`
      <div class="title background-color-prelude">Orbital Construction Yard</div>
      <div class="tag tag1 tag-space"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P25</div>
      <div class="content">
        <div class="production-box"><div class="production titanium"></div></div><br>
        <div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div>
        <div class="description">
          Increase your titanium production 1 step. Gain 4 titanium.
        </div>
      </div>
`],
[CardName.POLAR_INDUSTRIES,`
      <div class="title background-color-prelude">Polar Industries</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P26</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production heat"></div><div class="production heat"></div>
        </div> &nbsp; <div class="tile ocean-tile"></div><br>
        <div class="description">
          Increase your heat production 2 steps. Place an Ocean tile.
        </div>
      </div>
`],
[CardName.POWER_GENERATION,`
      <div class="title background-color-prelude">Power Generation</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-power"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P27</div>
      <div class="content">
        <div class="production-box production-box-size3">
          <div class="production energy"></div><div class="production energy"></div><div class="production energy"></div>
        </div>
        <div class="description">
          Increase your energy production 3 steps.
        </div>
      </div>
`],
[CardName.RESEARCH_NETWORK,`
      <div class="title background-color-prelude">Research Network</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-wild"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P28</div>
      <div class="content">
        <div class="production-box ">
          <div class="production money">1</div>
        </div><br>
        <div class="resource card"></div><div class="resource card"></div><div class="resource card"></div>
        <div class="description">
          Increase your money production 1 step. Draw 3 cards.
        </div>
      </div>
`],
[CardName.SELF_SUFFICIENT_SETTLEMENT,`
      <div class="title background-color-prelude">Self-Sufficient Settlement</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-city"></div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P29</div>
      <div class="content">
        <div class="production-box ">
          <div class="production money">2</div>
        </div><br>
        <div class="tile city-tile"></div>
        <div class="description">
          Increase your money production 2 step. Place a City tile.
        </div>
      </div>
`],
[CardName.SMELTING_PLANT,`
      <div class="title background-color-prelude">Smelting Plant</div>
      <div class="tag tag1 tag-building"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P30</div>
      <div class="content">
        <div class="tile oxygen-tile"></div><div class="tile oxygen-tile"></div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          Raise oxygen 2 steps. Gain 5 steel.
        </div>
      </div>
`],
[CardName.SOCIETY_SUPPORT,`
      <div class="title background-color-prelude">Society Support</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P31</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production money">-1</div><div class="production plant"></div><br>
          <div class="production energy"></div><div class="production heat"></div>
        </div>
        <div class="description">
          Increase your plant, energy and heat production 1 step. Decrease money production 1 step.
        </div>
      </div>
`],
[CardName.SUPPLIER,`
      <div class="title background-color-prelude">Supplier</div>
      <div class="tag tag1 tag-power"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P32</div>
      <div class="content">
        <div class="production-box production-box-size2">
          <div class="production energy"></div><div class="production energy"></div>
        </div><br>
        <div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div><div class="resource steel"></div>
        <div class="description">
          Increase your energy production 2 steps. Gain 4 steel.
        </div>
      </div>
`],
[CardName.SUPPLY_DROP,`
      <div class="title background-color-prelude">Supply Drop</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P33</div>
      <div class="content">
        3<div class="resource titanium"></div> 8<div class="resource steel"></div> 3<div class="resource plant"></div>
        <div class="description">
          Gain 3 titanium, 8 steel and 3 plants.
        </div>
      </div>
`],
[CardName.UNMI_CONTRACTOR,`
      <div class="title background-color-prelude">UNMI Contractor</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P34</div>
      <div class="content">
        <div class="tile rating"></div><div class="tile rating"></div><div class="tile rating"></div> <div class="resource card"></div>
        <div class="description">
          Increase your TR 3 steps. Draw a card.
        </div>
      </div>
`],
[CardName.ACQUIRED_SPACE_AGENCY,`
      <div class="title background-color-prelude">Acquired Space Agency</div>
      <div class="prelude-label">PRELUDE</div>
      <div class="prelude-icon preludeCard-icon"></div>
      <div class="card-number">P35</div>
      <div class="content">
        <div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div><div class="resource titanium"></div>
        <div class="resource card"><div class="card-icon card-icon-space">&#x2734;</div></div> <div class="resource card"><div class="card-icon card-icon-space">&#x2734;</div></div>
        <div class="description">
          Gain 6 titanium. Reveal cards until you reveal two cards with Space Tags. Take them into your hand, discard the rest.
        </div>
      </div>
`],
[CardName.PENGUINS, `
    <div class="title background-color-active">Penguins</div>
    <div class="price ">7</div>
    <div class="tag tag1 tag-animal "></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">212</div>
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
[CardName.SMALL_ASTEROID,`
    <div class="title background-color-events ">Small Asteroid</div>
    <div class="price ">10</div>
    <div class="tag tag1 tag-event"></div>
    <div class="tag tag2 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">209</div>
    <div class="content ">
        <div class="tile temperature-tile"></div><br/>
        - <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>
        <div class="description ">
            (Increase temperature 1 step. Remove up to 2 plants from any player.)
        </div>
    </div>
`],
[CardName.SNOW_ALGAE,`
    <div class="title background-color-automated">Snow Algae</div>
    <div class="price">12</div>
    <div class="tag tag1 tag-plant"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">211</div>
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
[CardName.DUSK_LASER_MINING,`
    <div class="title background-color-automated">Dusk Laser Mining</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X01</div>
    <div class="content">
        <div class="requirements">2 Science</div>
        <div class="production-box production-box-size1a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="production energy"></div><br/>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="production titanium"></div>
        </div>
        <span style="font-size: 18px; margin-left: 20px; font-family: Prototype">4</span> <div class="production titanium"></div>
        <div class="description">
            (Requires 2 Science tags.
            Decrease your energy production 1 step, and increase your titanium production 1 step.
            Gain 4 titanium.)
        </div>
    </div>
`],
[CardName.ASTEROID_HOLLOWING, `
    <div class="title background-color-active">Asteroid Hollowing</div>
    <div class="price ">16</div>
    <div class="tag tag1 tag-space "></div>
    <div class="promo-icon project-icon"></div>
    <div class="content ">
        <div class="points" style="line-height:45px;vertical-align:middle">1/2<div class="asteroid resource" style="vertical-align:middle;margin-left:5px">A</div></div>
        <div class="resource titanium"></div>
        <span class="red-arrow"></span>
        <div class="asteroid resource" style="margin-right:5px">A</div>
        <div class="production-box"><div  class="production money">1</div></div>
        <div class="description">
            (Action: Spend 1 titanium to add 1 asteroid resource here and increase MC production 1 step.)
            <br><br>(1 VP per 2 asteroid resources on this card.)
        </div>
      </div>
    </div>
`],
[CardName.ADVERTISING,`
      <div class="title background-color-active">Advertising</div>
      <div class="price ">4</div>
      <div class="tag tag1 tag-earth"></div>
      <div class="promo-icon project-icon"></div>
      <div class="content ">
        <div class="resource money">20</div>* : <div class="production-box"><div class="production money">1</div></div></div>
        <div class="description" style="text-align:center;margin:0px 10px;">
          (Effect: When you play a card with a basic cost of 20 MC or more, increase your MC production 1 step.)
        </div>
      </div>
`],
[CardName.PHARMACY_UNION,`
    <div class="tag tag1 tag-microbe"></div>
    <div class="tag tag2 tag-microbe"></div>
    <div class="corporationLabel">Corporation</div>
    <div class="promo-icon corporation-icon"></div>
    <div class="contentCorporation">

      <div class="corp-logo">Pharmacy Union</div>

      <div class="card-effect-icons">
        <div class="resource money startmc">54</div>
        <div class="resource card">
          <div class="card-icon card-icon-science"></div>
        </div>
      </div>

      <div class="description card-effect-text">
        (You start with 54 MC. As your first action, draw a Science card.)
      </div>

      <div class="corporationEffectBox">
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
[CardName.COMET_AIMING, `
    <div class="title background-color-active">Comet Aiming</div>
    <div class="price ">17</div>
    <div class="tag tag1 tag-space "></div>
    <div class="promo-icon project-icon"></div>
    <div class="content ">
        <div class="resource titanium"></div>
        <span class="red-arrow"></span>
        <div class="asteroid resource">A</div>*
        <br>
        OR <div class="asteroid resource">A</div>
        <span class="red-arrow"></span>
        <div class="tile ocean-tile"></div>
        <div class="description">
            (Action: Spend 1 titanium to add 1 asteroid resource to ANY card, or remove 1 asteroid resource here to place an ocean tile.)
        </div>
      </div>
    </div>
`],
[CardName.CUTTING_EDGE_TECHNOLOGY,`
            <div class="title background-color-active">Cutting Edge Technology</div>
            <div class="price">11</div>
            <div class="tag tag1 tag-science"></div>
            <div class="promo-icon project-icon"></div>
            <div class="content">
                <div class="points points-big">1</div>
                <div class="resource card">
                <div class="card-icon requirements"></div></div>
                 : <div class="money resource">-2</div>
                <div class="description">
                    (Effect: When playing a card with a requirement, you pay 2 MC less for it.)
                </div>
            </div>
`],
[CardName.CRASH_SITE_CLEANUP, `
    <div class="title background-color-events">Crash Site Cleanup</div>
    <div class="price">4</div>
    <div class="tag tag1 tag-event"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">- <div class="resource plant red-outline"></div></div>
        <div class="resource titanium"></div> OR 2 <div class="resource steel"></div>
        <div class="description">
            (Requires that a player removed ANOTHER PLAYER's plants this generation. Gain 1 titanium or 2 steel.)
        </div>
    </div>
`],
[CardName.DIRECTED_IMPACTORS, `
    <div class="title background-color-active">Directed Impactors</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
        <div class=" money resource">6</div> (<span class="titanium"></span>)
        <span class="red-arrow"></span>
        <div class="asteroid resource">A</div>*
        <br>
        OR <div class="asteroid resource">A</div>
        <span class="red-arrow"></span>
        <div class="tile temperature-tile"></div>
        <div class="description">
            (Action: Spend 6 MC to add 1 asteroid resource to ANY card (titanium may be used), or remove 1 asteroid resource here to raise temperature 1 step.)
        </div>
      </div>
    </div>
`],
[CardName.FIELD_CAPPED_CITY,`
        <div class="title background-color-automated">Field-Capped City</div>
        <div class="price">29</div>
        <div class="tag tag1 tag-building"></div>
        <div class="tag tag2 tag-city"></div>
        <div class="tag tag3 tag-power"></div>
        <div class="promo-icon project-icon"></div>
        <div class="content">
            <div class="production-box production-box-size1a">
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="money production">2</div>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="energy production"></div>
            </div>
            <div class="tile city-tile"></div><br>
            <div class="plant resource"></div><div class="plant resource"></div><div class="plant resource"></div>
            <div class="description">
                <div>(Increase your MC production 2 steps and increase your Energy production 1 step. Gain 3 plants, and place a City tile.)</div>
            </div>
        </div>
`],
[CardName.MAGNETIC_SHIELD,`
    <div class="title background-color-automated">Magnetic Shield</div>
    <div class="price">26</div>
    <div class="tag tag1 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
        <div class="requirements">2 Power</div>
        4 <div class="tile rating"></div>
        <div class="description">
            (Requires 2 Power tags. Raise your TR 4 steps.)
        </div>
    </div>
`],
[CardName.MELTWORKS,`
    <div class="title background-color-active">Meltworks</div>
    <div class="price">4</div>
    <div class="tag tag1 tag-building"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content ">
      5 <span class="heat resource"></span> <span class="red-arrow "></span>
      <div class="steel resource"></div><div class="steel resource"></div><div class="steel resource"></div>
      <div class="description ">
        (Action: Spend 5 heat to gain 3 steel.)
      </div>
    </div>
`],
[CardName.MOHOLE_LAKE,`
    <div class="title background-color-active">Mohole Lake</div>
    <div class="price">31</div>
    <div class="tag tag1 tag-building"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
        <div class="red-arrow"></div><div class="microbe resource"></div>* OR <div class="animal resource"></div>*
        <div class="description">
          (Action: Add a microbe or animal to ANOTHER card.)
        </div>
        <br>
        <div class="tile temperature-tile"></div><div class="tile ocean-tile"></div>
        <div class="plant resource"></div><div class="plant resource"></div><div class="plant resource"></div>
        <div class="description">
          (Place an ocean tile and raise temperature 1 step. Gain 3 Plants.)
        </div>
    </div>
`],
[CardName.DIVERSITY_SUPPORT,`
        <div class="title background-color-events">Diversity Support</div>
        <div class="price">1</div>
        <div class="tag tag1 tag-event"></div>
        <div class="promo-icon project-icon"></div>
        <div class="content">
            <div class="requirements">9 Resource Types</div>
            <div class="tile rating"></div>
            <div class="description ">
                (Requires that you have 9 different types of resources. Raise your terraform rating 1 step.)
            </div>
        </div>
`],
[CardName.TOPSOIL_CONTRACT, `
    <div class="title background-color-active">Topsoil Contract</div>
    <div class="price">8</div>
    <div class="tag tag1 tag-microbe"></div>
    <div class="tag tag2 tag-earth"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
      <div class="microbe resource"></div>* : <div class="money resource">1</div>
      <div class="description">
        (Effect: When you gain a microbe to ANY CARD, gain 1 MC.)
      </div>
      <br><br>
      <div class="plant resource"></div><div class="plant resource"></div><div class="plant resource"></div>
      <div class="description">
        (Gain 3 plants.)
      </div>
    </div>
`],
[CardName.IMPORTED_NUTRIENTS,`
    <div class="title background-color-events">Imported Nutrients</div>
    <div class="price">14</div>
    <div class="tag tag1 tag-event"></div>
    <div class="tag tag2 tag-space"></div>
    <div class="tag tag3 tag-earth"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
      4 <div class="plant resource"></div> 4 <div class="microbe resource"></div>*
      <div class="description">
        (Gain 4 Plants and add 4 Microbes to ANOTHER card.)
      </div>
    </div>
`],
[CardName.ASTEROID_DEFLECTION_SYSTEM,`
    <div class="title background-color-active">Asteroid Deflection System</div>
    <div class="price">13</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-space"></div>
    <div class="tag tag3 tag-earth"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
      <div class="points">1/<div class="asteroid resource">A</div></div>
      <span class="red-arrow"></span><div class="resource card"></div>*
      <div class="resource-tag tag-space"></div> : <div class="asteroid resource">A</div>
      <div class="description">
        (Action: REVEAL AND DISCARD the top card of the deck. If it has a space tag, add an asteroid resource here.)
      </div>
      <br>
      <div class="description effect">
        OPPONENTS MAY NOT REMOVE YOUR PLANTS
      </div>
      <br>
      <div class="production-box production-box-size1a">
        <div class="production-prefix">&#x2796;&#xFE0E;</div><div class="energy production"></div><br>
      </div>
      <div class="description bottom" >
        (Decrease your energy production 1 step. 1 VP per asteroid on this card.)
      </div>
    </div>
`],
[CardName.JOVIAN_EMBASSY,`
<div class="title background-color-automated">Jovian Embassy</div>
<div class="price">14</div>
<div class="tag tag1 tag-building"></div>
<div class="tag tag2 tag-jovian"></div>
<div class="promo-icon project-icon"></div>
<div class="content">
    <div class="points points-big">1</div>
    <div class="tile rating"></div>
    <div class="description ">
        (Raise your terraform rating 1 step.)
    </div>
</div>
`],
[CardName.SUB_CRUST_MEASUREMENTS,`
    <div class="title background-color-active">Sub-Crust Measurements</div>
    <div class="price">20</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-science"></div>
    <div class="tag tag3 tag-earth"></div>
    <div class="promo-icon project-icon"></div>
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
[CardName.POTATOES,`
      <div class="title background-color-automated">Potatoes</div>
      <div class="price">2</div>
      <div class="tag tag1 tag-plant"></div>
      <div class="promo-icon project-icon"></div>
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
[CardName.MEAT_INDUSTRY, `
    <div class="title background-color-active">Meat Industry</div>
    <div class="price">5</div>
    <div class="tag tag1 tag-building"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
      <div class="animal resource"></div>* : <div class="money resource">2</div>
      <div class="description">
        (Effect: When you gain an animal to ANY CARD, gain 2 MC.)
      </div>
    </div>
`],
[CardName.DEIMOS_DOWN_PROMO,`
    <div class="title background-color-events">Deimos Down</div>
    <div class="price">31</div>
    <div class="tag tag1 tag-event"></div>
    <div class="tag tag2 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="content">
      <div class="tile temperature-tile"></div>
      <div class="tile temperature-tile"></div>
      <div class="tile temperature-tile"></div><br>
      <div class="tile special-tile">&#x274B;</div>*&nbsp;
      4 <div class=" steel resource"></div>&nbsp;
      -6 <div class="resource plant red-outline"></div>
      <div class="description">
        (Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 Plants from any player.)
      </div>
    </div>
`],
[CardName.GREAT_DAM_PROMO,`
      <div class="title background-color-automated">Great Dam</div>
      <div class="price">15</div>
      <div class="tag tag1 tag-building"></div>
      <div class="tag tag2 tag-power"></div>
      <div class="promo-icon project-icon"></div>
      <div class="content">
        <div class="points points-big">1</div>
        <div class="requirements">4 Oceans</div>
        <div class="production-box production-box-size2">
          <div class="energy production"></div><div class="energy production"></div>
        </div>
        *&nbsp;<div class="tile special-tile">&#x23DA;</div>
        <div class="description">
          (Requires 4 ocean tiles. Increase your Energy production 2 steps. Place this tile ADJACENT TO an ocean tile.)
        </div>
      </div>
`],
[CardName.MAGNETIC_FIELD_GENERATORS_PROMO,`
        <div class="title background-color-automated">Magnetic Field Generators</div>
        <div class="price">22</div>
        <div class="tag tag1 tag-building"></div>
        <div class="promo-icon project-icon"></div>
        <div class="content">
          <div class="production-box production-box-size2a">
            <div class="production-prefix">&#x2796;&#xFE0E;</div> 4 <div class="energy production"></div><br>
            <div class="production-prefix">&#x2795;&#xFE0E;</div><div class="plant production"></div><div class="plant production"></div>
          </div> <br>
           3 <div class="tile rating"></div>*&nbsp;&nbsp;<div class="tile special-tile"><span class="tile-icon">&#x25C9;</span></div>
          <div class="description">
            (Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps and place this tile.)
          </div>
        </div>
`],
[CardName.MERCURIAN_ALLOYS,`
    <div class="title background-color-active">Mercurian Alloys</div>
    <div class="price">3</div>
    <div class="tag tag1 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X07</div>
    <div class="content">
        <div class="requirements">2 Science</div>
        <div class="resource titanium"></div> : + <div class="resource money">1</div>
        <div class="description">
            (Effect: Your titanium resources are worth 1 MC extra.)
        </div><br/>
        <div class="description">
            (Requires 2 Science tags.)
        </div>
    </div>
`],
[CardName.REGO_PLASTICS,`
    <div class="title background-color-active">Rego Plastics</div>
    <div class="price">10</div>
    <div class="tag tag1 tag-building"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X10</div>
    <div class="content ">
        <div class="points points-big">1</div>
        <div class="resource steel"></div> : + <div class="resource money">1</div>
        <div class="description">
            (Effect: Your steel resources are worth 1 MC extra.)
        </div>
    </div>
`],
[CardName.INTERPLANETARY_TRADE,`
    <div class="title background-color-automated">Interplanetary Trade</div>
    <div class="price">27</div>
    <div class="tag tag1 tag-space"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X05</div>
    <div class="content">
        <div class="points points-big">1</div>
        <div class="production-box"><div class="production money">1</div></div> /
        <div class="resource-tag" style="background: linear-gradient(to bottom right, green, yellow, red);"></div>
        <div class="description">
            (Increase your MC production 1 step per different tag you have in play, including this.)
        </div>
        </div>
`],
[CardName.PROJECT_INSPECTION, `
    <div class="title background-color-events">Project Inspection</div>
    <div class="price">0</div>
    <div class="tag tag1 tag-event"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X02</div>
    <div class="content">
        USE A CARD ACTION THAT HAS BEEN USED THIS GENERATION
    </div>
`],
[CardName.ORBITAL_CLEANUP, `
    <div class="title background-color-active">Orbital Cleanup</div>
    <div class="price ">14</div>
    <div class="tag tag1 tag-space"></div>
    <div class="tag tag2 tag-earth"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X08</div>
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
[CardName.HI_TECH_LAB, `
    <div class="title background-color-active">Hi-Tech Lab</div>
    <div class="price ">17</div>
    <div class="tag tag1 tag-building"></div>
    <div class="tag tag2 tag-science"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X04</div>
    <div class="content">
        <div class="points points-big">1</div>
        X <div class="energy resource "></div> <div class="red-arrow"></div> X <div class="card resource "></div>*
        <div class="description">
            (Action: Spend any amount of energy to draw the same number of cards. TAKE 1 INTO HAND AND DISCARD THE REST.)
        </div>
    </div>
`],
[CardName.ENERGY_MARKET, `
    <div class="title background-color-active">Energy Market</div>
    <div class="price ">3</div>
    <div class="tag tag1 tag-power"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X03</div>
    <div class="content ">
        <div class="money resource">2X</div> <div class="red-arrow"></div> X <div class="energy resource"></div><br/>
        OR <div class="production-box production-box-size1a"><div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div></div> <div class="red-arrow"></div> <div class="money resource">8</div>
        <div class="description">
            (Action: Spend 2X MC to gain X energy, or decrease energy production 1 step to gain 8 MC.)
        </div>
    </div>
`],
[CardName.AERIAL_LENSES, `
  <div class="title background-color-automated ">Aerial Lenses</div>
  <div class="price">2</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="card-number">T01</div>
  <div class="content ">
    <div class="points points-big">-1</div>
    <div class="requirements"><span class="party">Kelvinists</span></div>
      - <div class="resource plant red-outline"></div><div class="resource plant red-outline"></div>

      <div class="production-box production-box-size2">
        <div class="heat production"></div><div class="heat production"></div>
      </div>
      <div class="description ">
        (Requires that Kelvinists are ruling or that you have 2 delegates there. Remove up to 2 plants from any player. Increase your heat production 2 steps.)
      </div>
  </div>
`],
[CardName.BANNED_DELEGATE, `
  <div class="title background-color-events ">Banned Delegate</div>
  <div class="price">0</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-event "></div>
  <div class="card-number">T02</div>
  <div class="content ">
    <div class="requirements">Chairman</div>
      - <div class="delegate delegate-red"></div>
      <div class="description ">
          (Requires that you are Chairman. Remove any NON-LEADER delegate.)
      </div>
  </div>
`],
[CardName.CULTURAL_METROPOLIS, `
  <div class="title background-color-automated ">Cultural Metropolis</div>
  <div class="price">20</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-building "></div>
  <div class="tag tag2 tag-city "></div>
  <div class="card-number">#T03</div>
  <div class="content ">
      <div class="requirements"><span class="party">Unity</span></div>
      <div class="production-box production-box-size1a ">
          <div class="production-prefix ">&#x2796;&#xFE0E;</div><div class="energy production "></div>
          <div class="production-prefix ">&#x2795;&#xFE0E;</div><div class="money production ">3</div>
      </div>
      <div class="tile city-tile " style="margin-left:10px "></div>
      <div class="delegate"></div><div class="delegate"></div>
      <div class="description ">
        (Requires that Unity is ruling or that you have 2 delegates there. Decrease your energy production 1 step and increase your MC production 3 steps. Place a city tile. Place 2 delegates in 1 party.)
      </div>
  </div>
`],
[CardName.DIASPORA_MOVEMENT, `
  <div class="title background-color-automated ">Diaspora Movement</div>
  <div class="price">7</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-jovian "></div>
  <div class="card-number">#T04</div>
  <div class="content ">
      <div class="points points-big">1</div>
      <div class="requirements"><span class="party">Reds</span></div>
      <div class="money production">1</div> / <div class="resource-tag tag-jovian red-outline"></div>
      <div class="description" style="margin-top:5px;">
        (Requires that Reds are ruling or that you have 2 delegates there. Gain 1MC for each Jovian tag in play.)
      </div>
  </div>
`],
[CardName.EVENT_ANALYSTS, `
  <div class="title background-color-active ">Event Analysts</div>
  <div class="price">5</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-science "></div>
  <div class="card-number">#T05</div>
  <div class="content ">
    <div class="requirements"><span class="party">Scientists</span></div>
    + <div class="influence"></div><br>
    <div class="description" style="margin-top:5px;">
      (Effect: You have influence +1.)
    </div>
    <br>
    <div class="description">
      (Requires that Scientists are ruling or that you have 2 delegates there.)
    </div>
  </div>
`],
[CardName.GMO_CONTRACT, `
  <div class="title background-color-active">GMO Contract</div>
  <div class="price">3</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-microbe"></div>
  <div class="tag tag2 tag-science"></div>
  <div class="card-number">#T06</div>
  <div class="content">
    <div class="requirements"><span class="party">Greens</span></div>
    <div class="tag-animal resource-tag"></div> / <div class="tag-plant resource-tag"></div> / <div class="tag-microbe resource-tag"></div> : <div class="money resource">2</div>
    <div class="description">
      (Effect: Each time you play a plant, animal, or microbe tag, including this, gain 2MC.)
    </div>
    <div class="description" style="margin-top:10px;">
      (Requires that Greens are ruling or that you have 2 delegates there.)
    </div>
  </div>
`],
[CardName.MARTIAN_MEDIA_CENTER, `
  <div class="title background-color-active ">Martian Media Center</div>
  <div class="price">7</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-building "></div>
  <div class="card-number">#T07</div>
  <div class="content ">
    <div class="requirements"><span class="party">Mars First</span></div>
      <div class="money resource ">3</div> <span class="red-arrow "></span> <div class="delegate"></div>
      <div class="description " style="margin-bottom:10px;">
          (Action: Pay 3 MC to add a delegate to any party.)
      </div>
      <div class="production-box "><div class="money production ">2</div></div>
      <div class="description ">
          (Requires that Mars First is ruling or that you have 2 delegates there. Increase your MC production 2 steps.)
      </div>
  </div>
`],
[CardName.PARLIAMENT_HALL, `
  <div class="title background-color-automated ">Parliament Hall</div>
  <div class="price">8</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-building "></div>
  <div class="card-number">#T08</div>
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
  <div class="title background-color-events">Political Alliance</div>
  <div class="price">4</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-event"></div>
  <div class="card-number">X09</div>
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
  <div class="title background-color-automated ">PR Office</div>
  <div class="price">7</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-earth "></div>
  <div class="card-number">#T09</div>
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
[CardName.PUBLIC_CELEBRATIONS, `
  <div class="title background-color-events ">Public Celebrations</div>
  <div class="price">8</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-event "></div>
  <div class="card-number">#T10</div>
  <div class="content ">
    <div class="points points-big">2</div>
    <div class="requirements">Chairman</div>
      <div class="description ">
        (Requires that you are Chairman.)
      </div>
  </div>
`],
[CardName.RECRUITMENT, `
  <div class="title background-color-events ">Recruitment</div>
  <div class="price">2</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-event "></div>
  <div class="card-number">#T11</div>
  <div class="content ">
    - <div class="delegate delegate-red"></div>* &nbsp;&nbsp; + <div class="delegate"></div>
      <div class="description ">
        (Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.)
      </div>
  </div>
`],
[CardName.RED_TOURISM_WAVE, `
  <div class="title background-color-events ">Red Tourism Wave</div>
  <div class="price">3</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-event "></div>
  <div class="tag tag2 tag-earth "></div>
  <div class="card-number">#T12</div>
  <div class="content ">
    <div class="requirements"><span class="party">Reds</span></div>
    <div class="resource money">1</div> / <div class="tile empty-tile-small"></div>*

      <div class="description ">
        (Requires that Reds are ruling or that you have 2 delegates there. Gain 1 MC from each EMPTY AREA ADJACENT TO YOUR TILES.)
      </div>
  </div>
`],
[CardName.SPONSORED_MOHOLE, `
  <div class="title background-color-automated ">Sponsored Mohole</div>
  <div class="price">5</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-building "></div>
  <div class="card-number">#T13</div>
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
  <div class="title background-color-automated ">Supported Research</div>
  <div class="price">3</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-science "></div>
  <div class="card-number">#T14</div>
  <div class="content ">
    <div class="requirements"><span class="party">Scientists</span></div>
      <div class="resource card"></div> <div class="resource card"></div>
      <div class="description ">
        (Requires that Scientists are ruling or that you have 2 delegates there. Draw 2 cards.)
      </div>
  </div>
`],
[CardName.WILDLIFE_DOME, `
  <div class="title background-color-automated ">Wildlife Dome</div>
  <div class="price">15</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-building"></div>
  <div class="tag tag2 tag-plant"></div>
  <div class="tag tag3 tag-animal"></div>
  <div class="card-number">#T15</div>
  <div class="content ">
    <div class="requirements"><span class="party">Greens</span></div>
      <div class="tile greenery-tile"></div>
      <div class="description ">
        (Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.)
      </div>
  </div>
`],
[CardName.VOTE_OF_NO_CONFIDENCE, `
  <div class="title background-color-events ">Vote Of No Confidence</div>
  <div class="price">5</div>
  <div class="turmoil-icon project-icon"></div>
  <div class="tag tag1 tag-event "></div>
  <div class="card-number">#T16</div>
  <div class="content ">
    - <div class="chairman" style="box-shadow:1px 0 1px red, -1px 0 1px red"></div> * &nbsp;&nbsp; + <div class="chairman"></div>
    <br>
    <div class="tile rating"></div>
      <div class="description ">
        (Requires that you have a Party Leader in any party and that the sitting Chairman is neutral. Remove the NEUTRAL Chairman and move your own delegate(from the reserve) there instead. Gain 1 TR.)
      </div>
  </div>
`],
[CardName.LAW_SUIT, `
    <div class="title background-color-events">Law Suit</div>
    <div class="price ">2</div>
    <div class="tag tag1 tag-event"></div>
    <div class="tag tag2 tag-earth"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X06</div>
    <div class="content">
        <div class="points points-big red-outline">-1</div>
        STEAL <div class="production money red-outline">3</div> *
        <div class="description ">
            (Steal 3 MC from a player that REMOVED YOUR RESOURCES OR DECREASED YOUR PRODUCTION this generation.
            Place this card face down in THAT PLAYER'S EVENT PILE.)
        </div>
    </div>
`],
[CardName.STANFORD_TORUS, `
    <div class="title background-color-automated">Stanford Torus</div>
    <div class="price">12</div>
    <div class="tag tag1 tag-space"></div>
    <div class="tag tag2 tag-city"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X12</div>
    <div class="content">
        <div class="points points-big">2</div>
        <div class="tile city-tile"></div> *
        <div class="description ">
            (Place a city tile IN SPACE, outside and separate from the planet.)
        </div>
    </div>
`],
[CardName.SATURN_SURFING, `
    <div class="title background-color-active">Saturn Surfing</div>
    <div class="price">13</div>
    <div class="tag tag1 tag-earth"></div>
    <div class="tag tag2 tag-jovian"></div>
    <div class="promo-icon project-icon"></div>
    <div class="card-number">X11</div>
    <div class="content">
        <div class="points points-big">1</div>
        <div class="floater resource"></div>
        <span class="red-arrow"></span>
        <div class="money resource">1</div> / <div class="resource floater"></div> * max 5
        <div class="description" style="margin-bottom:10px;">
            (Action: Spend 1 floater from here to gain 1 MC from each floater here, INCLUDING THE PAID FLOATER. Max 5.)
        </div>
        <div class="floater resource"></div> / <div class="resource-tag tag-earth"></div>
        <div class="description">
            (Add 1 floater here for every Earth tag you have, including this.)
        </div>
    </div>
`]
]);
