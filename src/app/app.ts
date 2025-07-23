import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { CompanyService } from './services/company/company.service';
//import { SpinnerComponent } from './view/general-components/spinner/spinner.component';
//import { SpinnerService } from './services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, /*SpinnerComponent*/ CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'abaFrontOffice';
  //spinnerService = inject(SpinnerService);

}