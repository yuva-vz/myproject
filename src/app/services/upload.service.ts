// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UploadService {
//   private readonly UPLOAD_URL = 'http://localhost:3000/upload';
//   private readonly AUTH_TOKEN = 'yourTokenHere'; // Replace with actual token

//   constructor(private http: HttpClient) {}

//   uploadPhoto(file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('photo', file);

//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${this.AUTH_TOKEN}`
//       // Don't set Content-Type manually for FormData!
//     });

//     return this.http.post(this.UPLOAD_URL, formData, { headers });
//   }

//   // Optional: Method to upload with progress tracking
//   uploadPhotoWithProgress(file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('photo', file);

//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${this.AUTH_TOKEN}`
//     });

//     return this.http.post(this.UPLOAD_URL, formData, { 
//       headers,
//       reportProgress: true,
//       observe: 'events'
//     });
//   }
// }
