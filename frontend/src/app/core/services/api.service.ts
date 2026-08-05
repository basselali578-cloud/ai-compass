import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiModel, Tool, PaginatedResponse, UseCase, SavedTool, Collection, CollectionDetail, SearchResult, Workflow } from '../models/api.models';
import { API_BASE } from '../constants/api-base';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_URL = API_BASE;

  constructor(private http: HttpClient) {}

  getModels(page = 1, limit = 20, search = '', provider = ''): Observable<PaginatedResponse<AiModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (search) params = params.set('search', search);
    if (provider) params = params.set('provider', provider);
    return this.http.get<PaginatedResponse<AiModel>>(`${this.API_URL}/models`, { params });
  }

  getModelById(id: number): Observable<AiModel> {
    return this.http.get<AiModel>(`${this.API_URL}/models/${id}`);
  }

  getTools(page = 1, limit = 20, search = '', category = '', useCase = ''): Observable<PaginatedResponse<Tool>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (useCase) params = params.set('useCase', useCase);
    return this.http.get<PaginatedResponse<Tool>>(`${this.API_URL}/tools`, { params });
  }

  getToolById(id: number): Observable<Tool> {
    return this.http.get<Tool>(`${this.API_URL}/tools/${id}`);
  }

  getToolByName(name: string): Observable<Tool> {
    return this.http.get<Tool>(`${this.API_URL}/tools/by-name/${encodeURIComponent(name)}`);
  }

  getUseCases(): Observable<{ data: UseCase[] }> {
    return this.http.get<{ data: UseCase[] }>(`${this.API_URL}/use-cases`);
  }

  searchTools(query: string): Observable<SearchResult> {
    let params = new HttpParams().set('q', query);
    return this.http.get<SearchResult>(`${this.API_URL}/tools/search`, { params });
  }

  getTrendingTools(): Observable<{ data: Tool[] }> {
    return this.http.get<{ data: Tool[] }>(`${this.API_URL}/tools/trending`);
  }

  getCollections(): Observable<{ data: Collection[] }> {
    return this.http.get<{ data: Collection[] }>(`${this.API_URL}/collections`);
  }

  getCollectionBySlug(slug: string): Observable<CollectionDetail> {
    return this.http.get<CollectionDetail>(`${this.API_URL}/collections/${slug}`);
  }

  getWorkflows(): Observable<{ data: Workflow[] }> {
    return this.http.get<{ data: Workflow[] }>(`${this.API_URL}/workflows`);
  }

  getWorkflowBySlug(slug: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.API_URL}/workflows/${slug}`);
  }

  getSavedTools(): Observable<{ data: SavedTool[] }> {
    return this.http.get<{ data: SavedTool[] }>(`${this.API_URL}/saves`);
  }

  saveTool(toolId: number, note: string = ''): Observable<any> {
    return this.http.post(`${this.API_URL}/saves`, { toolId, note });
  }

  unsaveTool(toolId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/saves/${toolId}`);
  }
}
