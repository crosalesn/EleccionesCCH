import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTransportistaFinalPage } from './home-transportista-final.page';

describe('HomeTransportistaFinalPage', () => {
  let component: HomeTransportistaFinalPage;
  let fixture: ComponentFixture<HomeTransportistaFinalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTransportistaFinalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTransportistaFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
