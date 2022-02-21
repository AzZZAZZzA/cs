import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CudComponent } from './cud.component';

describe('CudComponent', () => {
  let component: CudComponent;
  let fixture: ComponentFixture<CudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
