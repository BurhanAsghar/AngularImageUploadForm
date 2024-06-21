import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  submitted = false;
  students: any[] = [];
  selectedStudent: any = null;
  private baseUrl = 'http://localhost:3000';
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      fullName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(18)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dateTime: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]],
      confirmPassword: ['', Validators.required],
      profileImage: [null]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.fetchStudents();
  }

  fetchStudents(): void {
    this.http.get<any[]>(`${this.baseUrl}/users`).subscribe(response => {
      this.students = response;
      console.log(this.students);
    }, error => {
      console.error('Error fetching students:', error);
    });
  }

  get f() { return this.studentForm.controls; }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.studentForm.invalid) {
      return;
    }

    const formData = new FormData();
    for (const key in this.studentForm.value) {
      if (this.studentForm.value.hasOwnProperty(key)) {
        formData.append(key, this.studentForm.value[key]);
      }
    }
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }

    this.http.post<any>(`${this.baseUrl}/users`, formData).subscribe(response => {
      this.students.push(response);
      console.log('User created successfully:', response);

      this.studentForm.reset();
      this.submitted = false;
      this.selectedFile = null;
    }, error => {
      console.error('Error creating user:', error);
    });
  }

  selectStudent(student: any): void {
    this.selectedStudent = { ...student }; // Create a copy to avoid direct mutation
  }

  updateStudent(): void {
    if (!this.selectedStudent || !this.selectedStudent.id) {
      console.error('No student selected or missing student ID.');
      return;
    }
  
    this.http.put<any>(`${this.baseUrl}/users/${this.selectedStudent.id}`, this.selectedStudent).subscribe(response => {
      const index = this.students.findIndex(s => s.id === this.selectedStudent.id);
      if (index !== -1) {
        this.students[index] = response;
        console.log('Student updated successfully:', response);
        this.selectedStudent = null;
      } else {
        console.error('Updated student not found in the list.');
      }
    }, error => {
      console.error('Error updating student:', error);
    });
  }
  
  deleteStudent(): void {
    if (!this.selectedStudent || !this.selectedStudent.id) {
      console.error('No student selected or missing student ID.');
      return;
    }
  
    this.http.delete(`${this.baseUrl}/users/${this.selectedStudent.id}`).subscribe(() => {
      this.students = this.students.filter(s => s.id !== this.selectedStudent.id);
      console.log('Student deleted successfully');
      this.selectedStudent = null;
    }, error => {
      console.error('Error deleting student:', error);
    });
  }
  
}
