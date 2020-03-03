import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisRecepcionesPage } from './mis-recepciones.page';

describe('MisRecepcionesPage', () => {
  let component: MisRecepcionesPage;
  let fixture: ComponentFixture<MisRecepcionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisRecepcionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisRecepcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
