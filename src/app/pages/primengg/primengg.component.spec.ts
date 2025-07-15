import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimenggComponent } from './primengg.component';

describe('PrimenggComponent', () => {
  let component: PrimenggComponent;
  let fixture: ComponentFixture<PrimenggComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimenggComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrimenggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
