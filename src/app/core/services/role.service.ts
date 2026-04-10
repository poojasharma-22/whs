import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Module {
  id: number;
  name: string;
}

export interface Role {
  id?: number;
  name: string;
}

export interface RolePermissionPayload {
  roleId: number;
  roleName: string;
  description: string;
  moduleIds: number[];
}

export interface RolePermissionEntry {
  id: number;
  roleId: number;
  roleName: string;
  description: string;
  moduleIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Role dropdown (/api/roles)
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  // Permission modules dropdown (/api/modules)
  getModules(): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}/modules`);
  }

  // Table data - saved role-permission entries
  getRolePermissions(): Observable<RolePermissionEntry[]> {
    return this.http.get<RolePermissionEntry[]>(`${this.baseUrl}/role-permissions`);
  }

  createRolePermission(payload: RolePermissionPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/role-permissions`, payload);
  }

  updateRolePermission(id: number, payload: RolePermissionPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/role-permissions/${id}`, payload);
  }
}