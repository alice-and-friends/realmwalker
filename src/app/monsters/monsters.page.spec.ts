import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonstersPage } from './monsters.page';

describe('MonstersPage', () => {
  let component: MonstersPage;
  let fixture: ComponentFixture<MonstersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MonstersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
