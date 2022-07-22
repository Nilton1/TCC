import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchesTreesComponent } from './researches-trees.component';

describe('ResearchesTreesComponent', () => {
  let component: ResearchesTreesComponent;
  let fixture: ComponentFixture<ResearchesTreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchesTreesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchesTreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
