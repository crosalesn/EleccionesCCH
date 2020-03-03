import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgruparBolsaPage } from './agrupar-bolsa.page';

describe('AgruparBolsaPage', () => {
  let component: AgruparBolsaPage;
  let fixture: ComponentFixture<AgruparBolsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgruparBolsaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgruparBolsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
