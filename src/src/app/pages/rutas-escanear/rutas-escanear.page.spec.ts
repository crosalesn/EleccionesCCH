import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RutasEscanearPage } from './rutas-escanear.page';

describe('RutasEscanearPage', () => {
  let component: RutasEscanearPage;
  let fixture: ComponentFixture<RutasEscanearPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutasEscanearPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RutasEscanearPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
