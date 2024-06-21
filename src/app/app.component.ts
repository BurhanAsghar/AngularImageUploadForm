import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-reactiveform';
  data: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/students')  // URL to your Node.js backend endpoint
      .subscribe((response: any) => {
        this.data = response;
        console.log(this.data);
      }, error => {
        console.error('Error:', error);
      });
  }
}
