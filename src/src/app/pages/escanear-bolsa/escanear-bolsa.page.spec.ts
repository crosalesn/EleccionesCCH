import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscanearBolsaPage } from './escanear-bolsa.page';

describe('EscanearBolsaPage', () => {
  let component: EscanearBolsaPage;
  let fixture: ComponentFixture<EscanearBolsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscanearBolsaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscanearBolsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
