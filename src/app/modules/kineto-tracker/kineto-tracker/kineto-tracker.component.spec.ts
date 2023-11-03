import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinetoTrackerComponent } from './kineto-tracker.component';

describe('KinetoTrackerComponent', () => {
  let component: KinetoTrackerComponent;
  let fixture: ComponentFixture<KinetoTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KinetoTrackerComponent]
    });
    fixture = TestBed.createComponent(KinetoTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
