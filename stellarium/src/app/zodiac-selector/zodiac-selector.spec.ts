import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZodiacSelector } from './zodiac-selector';

describe('ZodiacSelector', () => {
  let component: ZodiacSelector;
  let fixture: ComponentFixture<ZodiacSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZodiacSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZodiacSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
