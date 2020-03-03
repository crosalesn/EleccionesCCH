import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RutasDetallePage } from './rutas-detalle.page';

describe('RutasDetallePage', () => {
  let component: RutasDetallePage;
  let fixture: ComponentFixture<RutasDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutasDetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RutasDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
