import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface IModel {
  id: number;
  year: number;
  make: string;
  model: string;
  hasDetails: number;
}

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {
  public models: IModel[] = [];
  public years: number[] = [];
  public makes: string[] = [];

  public yearFilter: number;
  public makeFilter = '';

  path = '';
  sign = '';
  offset = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getModels();
    this.getYears();
    this.getMakes();
  }

  async getModels() {
    this.path = 'https://vehicle-data.azurewebsites.net/api/models';
    this.sign = '?';
    this.models = await this.http.get<IModel[]>(this.path).toPromise();
  }

  async getMakes() {
    this.makes = await this.http.get<string[]>(`https://vehicle-data.azurewebsites.net/api/makes`).toPromise();
  }

  async getYears() {
    this.years = await this.http.get<number[]>('https://vehicle-data.azurewebsites.net/api/years').toPromise();
  }

  async filter() {
    if (this.yearFilter === undefined && this.makeFilter === '') {
      this.path = `https://vehicle-data.azurewebsites.net/api/models`;
      this.sign = '?';
      this.models = await this.http.get<IModel[]>(this.path).toPromise();
    }
    if (this.yearFilter !== undefined && this.makeFilter === '') {
      this.path = `https://vehicle-data.azurewebsites.net/api/models?year=${this.yearFilter}`;
      this.sign = '&';
      this.models = await this.http.get<IModel[]>(this.path).toPromise();
    }
    if (this.yearFilter === undefined && this.makeFilter !== '') {
      this.path = `https://vehicle-data.azurewebsites.net/api/models?make=${this.makeFilter}`;
      this.sign = '&';
      this.models = await this.http.get<IModel[]>(this.path).toPromise();
    }
    if (this.yearFilter !== undefined && this.makeFilter !== '') {
      this.path = `https://vehicle-data.azurewebsites.net/api/models?make=${this.makeFilter}&year=${this.yearFilter}`;
      this.sign = '&';
      this.models = await this.http.get<IModel[]>(this.path).toPromise();
    }
  }

  async prevPage() {
    if (this.offset >= 10) {
      this.offset -= 10;
    }
    this.models = await this.http.get<IModel[]>(`${this.path}${this.sign}offset=${this.offset}`).toPromise();
  }

  async nextPage() {
    this.offset += 10;
    this.models = await this.http.get<IModel[]>(`${this.path}${this.sign}offset=${this.offset}`).toPromise();
  }
}
