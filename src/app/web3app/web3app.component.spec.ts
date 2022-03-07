import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web3appComponent } from './web3app.component';

describe('Web3appComponent', () => {
  let component: Web3appComponent;
  let fixture: ComponentFixture<Web3appComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Web3appComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Web3appComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
