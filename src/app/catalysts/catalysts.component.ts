import { CatalystsService } from '../core/catalysts.service';
import { Component, OnInit, Input } from '@angular/core';
import { IHero, ICatalysts, ILocations } from '../shared/interfaces';

@Component({
  selector: 'app-catalysts',
  templateUrl: './catalysts.component.html',
  styleUrls: ['./catalysts.component.scss']
})

export class CatalystsComponent implements OnInit {
  @Input() loading;
  @Input() doneLoading;

  hideCatalystData:boolean[] = [];
  catalysts:ICatalysts[] = [];
  filteredCatalysts:any[] = [];
  catalystsLocations:ILocations[] = [];

  constructor(private catalystsService: CatalystsService) {
    
  }

  ngOnInit() {
    this.loading();
    this.catalystsService.getCatalystLocations().subscribe(catalysts => {
      for(let catalyst in catalysts) {
        this.catalystsLocations.push({
          catalystID: catalyst,
          locations: catalysts[catalyst].locations
        });
      }
    })

    this.catalystsService.getCatalysts().subscribe(catalystData => {
      Object.keys(catalystData).map((catalyst, i) => {
        this.hideCatalystData.push(true);
        let heroes = [];

        Object.keys(catalystData[catalyst]).map(hero => {
          const heroesData = {
            name: hero,
          }
          if(catalystData[catalyst][hero]['Skills']) {
            heroesData['skills'] = catalystData[catalyst][hero]['Skills'];
          }
          if(catalystData[catalyst][hero]['Awakening']) {
            heroesData['awakening'] = catalystData[catalyst][hero]['Awakening'];
          }
          heroes.push(heroesData);
        });

        const matchingCatalyst = this.catalystsLocations.find(catalystLocation => catalystLocation.catalystID === catalyst);
        let locationData;
        if(matchingCatalyst) {
            locationData = matchingCatalyst.locations.map(location => {
            return {
              ...location,
              isWorldStage: /World/.test(location.stage) ? true : false
            }
          });
        }

        this.catalysts.push({
          id: catalyst, 
          heroes: heroes,
          locations: locationData
        });
      });
      console.log(this.catalysts);
      this.filteredCatalysts = [...this.catalysts].sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
      this.doneLoading();
    });
  }

  filter(input) {
    this.filteredCatalysts = this.catalysts.filter(catalyst => {
      return catalyst.id.toLowerCase().indexOf(input.toLowerCase()) >= 0 ? catalyst : '';
    }).sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
  }
}
