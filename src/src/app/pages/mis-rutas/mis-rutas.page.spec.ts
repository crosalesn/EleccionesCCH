import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisRutasPage } from './mis-rutas.page';

describe('MisRutasPage', () => {
  let component: MisRutasPage;
  let fixture: ComponentFixture<MisRutasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisRutasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisRutasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
