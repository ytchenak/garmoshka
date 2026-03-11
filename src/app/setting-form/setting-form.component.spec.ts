import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SettingFormComponent } from './setting-form.component';

describe('SettingFormComponent', () => {
  let component: SettingFormComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SettingFormComponent, RouterModule.forRoot([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.shower).toBe('PER');
    expect(component.Lm).toBe('5.75');
    expect(component.Dec).toBe('30');
    expect(component.F).toBe('0');
    expect(component.RaStartTime).toBe('1900');
    expect(component.RaStartValue).toBe('236');
  });

  it('should persist field changes', () => {
    component.onFieldChange('shower', 'GEM');
    expect(localStorage.getItem('garmoshka_settings_shower')).toContain('GEM');
  });
});
