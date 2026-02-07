import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/ideas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getComments(ideaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${ideaId}/comments`);
  }

  addComment(ideaId: number, message: string): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post<any>(
      `${this.apiUrl}/${ideaId}/comments`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
