import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateUserComponent } from './createuser.component';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateUserComponent], // Corrección en import
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent); // Corrección en instancia
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
