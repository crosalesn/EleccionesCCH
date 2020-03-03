import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsignarCargasPage } from './asignar-cargas.page';

describe('AsignarCargasPage', () => {
  let component: AsignarCargasPage;
  let fixture: ComponentFixture<AsignarCargasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarCargasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarCargasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
