import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private apiUrl = 'http://localhost:3000/ideas'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  createIdea(idea: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, idea, { headers });
  }

  getFilteredIdeas(filterType: 'controversial' | 'unpopular' | 'mainstream'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filter/${filterType}`);
  }

  getAllIdeas(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  upvoteIdea(ideaId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/${ideaId}/upvote`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  downvoteIdea(ideaId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/${ideaId}/downvote`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 400) {
      return throwError(error.error);
    } else {
      console.error('An error occurred:', error);
      return throwError('Something went wrong; please try again later.');
    }
  }
}
