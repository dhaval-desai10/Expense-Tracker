import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseCharts } from './expense-charts';

describe('ExpenseCharts', () => {
  let component: ExpenseCharts;
  let fixture: ComponentFixture<ExpenseCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCharts],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseCharts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
