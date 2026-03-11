import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MeteorInputComponent } from './meteor-input.component';

describe('MeteorInputComponent', () => {
  let component: MeteorInputComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MeteorInputComponent, RouterModule.forRoot([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(MeteorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component.inputText).toBe('');
  });

  it('should return data values as array', () => {
    component.inputText = '2100\n3\n2200';
    expect(component.dataValues).toEqual(['2100', '3', '2200']);
  });

  it('should store data on input change', () => {
    component.inputText = '2100\n3\n2200';
    component.onInputChange();
    const stored = JSON.parse(localStorage.getItem('rowdata') || '[]');
    expect(stored.length).toBe(3);
    expect(stored[0].data).toBe('2100');
  });

  it('should clear data on clean', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.inputText = '2100\n3\n2200';
    component.onClean();
    expect(component.inputText).toBe('');
  });

  it('should not clear data if confirm is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.inputText = '2100\n3\n2200';
    component.onClean();
    expect(component.inputText).toBe('2100\n3\n2200');
  });

  it('should handle calculation errors gracefully', () => {
    component.inputText = '2100\nINVALID\n2200';
    component.calc();
    expect(component.error).toContain('Unknown value');
  });
});
