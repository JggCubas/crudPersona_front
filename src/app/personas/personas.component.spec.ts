import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasComponent } from './personas.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('PersonasComponent', () => {
  let component: PersonasComponent;
  let fixture: ComponentFixture<PersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[

  HttpClientTestingModule

      ],
      declarations: [ PersonasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
