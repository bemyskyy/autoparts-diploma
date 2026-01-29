import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDto } from '../models/catalog.models';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/categories`;

  getTree(): Observable<TreeNode[]> {
    return this.http.get<CategoryDto[]>(this.apiUrl).pipe(
      map(categories => categories.map(c => this.mapToTreeNode(c)))
    );
  }

  private mapToTreeNode(dto: CategoryDto): TreeNode {
    return {
      label: dto.name,
      data: dto.id,
      key: dto.id.toString(),
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: dto.children ? dto.children.map(c => this.mapToTreeNode(c)) : []
    };
  }

  create(name: string, parentId: number | null): Observable<void> {
    const params: any = { name };
    if (parentId) params.parentId = parentId;
    return this.http.post<void>(this.apiUrl, null, { params });
  }

  update(id: number, name: string, parentId: number | null): Observable<void> {
    const params: any = { name };
    if (parentId) params.parentId = parentId;
    return this.http.put<void>(`${this.apiUrl}/${id}`, null, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
