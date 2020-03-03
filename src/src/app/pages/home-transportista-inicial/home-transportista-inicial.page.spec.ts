import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTransportistaInicialPage } from './home-transportista-inicial.page';

describe('HomeTransportistaInicialPage', () => {
  let component: HomeTransportistaInicialPage;
  let fixture: ComponentFixture<HomeTransportistaInicialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTransportistaInicialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTransportistaInicialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
