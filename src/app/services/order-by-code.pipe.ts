import { Pipe, PipeTransform } from '@angular/core';
import { AbllsTask } from '../models/ablls-task.model';

@Pipe({
  name: 'orderByCode',
  standalone: true
})
export class OrderByCodePipe implements PipeTransform {
  transform(tasks: AbllsTask[]): AbllsTask[] {
    if (!tasks) return [];
    return [...tasks].sort((a, b) => (a.code || '').localeCompare(b.code || '', 'fr', { numeric: true }));
  }
}
