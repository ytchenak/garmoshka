import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { InstructionComponent } from './instruction.component';

describe('InstructionComponent', () => {
  let component: InstructionComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [InstructionComponent, RouterModule.forRoot([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(InstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read showers from storage', () => {
    expect(component.showers).toBe('');
  });
});
