import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortuneTellerSelectorComponent } from './fortune-teller-selector.component';

describe('FortuneTellerSelectorComponent', () => {
  let component: FortuneTellerSelectorComponent;
  let fixture: ComponentFixture<FortuneTellerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FortuneTellerSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FortuneTellerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});