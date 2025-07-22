import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesvgComponent } from './samplesvg.component';

describe('SamplesvgComponent', () => {
  let component: SamplesvgComponent;
  let fixture: ComponentFixture<SamplesvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamplesvgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SamplesvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
