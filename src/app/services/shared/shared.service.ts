import { Injectable, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../../view/dialogs/confirmation-dialog/confirmation-dialog';
import { AuthService } from '../auth/auth.service';
import { Subscription } from '../../models/subscription.model';

// Dialogs personnalisés
//import { ConfirmationDialogComponent } from '../../view/dialogs/confirmation-dialog/confirmation-dialog.component';
//import { FeedbackDialogComponent } from '../../view/dialogs/feedback-dialog/feedback-dialog.component';

@Injectable({ providedIn: 'root' })
export class SharedService {
  datePipe: DatePipe = inject(DatePipe);
  snackBar: MatSnackBar = inject(MatSnackBar);
  dialog: MatDialog = inject(MatDialog);
  

  
  CURRENT_USER_KEY: string = 'CurrentUserKey';
  REFRESH_TOKEN: string = 'RefreshToken';
  AUTH_DATA_KEY: string = 'AuthDataKey';

  decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

fixEncoding(text: string | undefined): string {
  try {
    return decodeURIComponent(escape(text ?? ''));
  } catch {
    return text ?? '';
  }
}


  // 🕓 Dates
  getDateFormat(date: string | Date, format: string = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(date, format) ?? '';
  }

  getCurrentDate(format: string = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(new Date(), format) ?? '';
  }
  
  dueDateFromPaymentTerms(days: number): { withSlash: string; withDash: string } {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return { withSlash: `${d}/${m}/${y}`, withDash: `${y}-${m}-${d}` };
  }

  // 🔠 Initiales
  generateInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.map(p => p[0].toUpperCase()).slice(0, 2).join('');
  }

  // 📢 Snackbar
  displaySnackBar(message: string, duration = 3000): void {
    this.snackBar.open(message, 'Fermer', { duration });
  }

  // 📂 Blob → Base64
  convertBlobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // ✅ Confirmation dialog
  openConfirmationDialog(message: string, isInfo: boolean = false) {
    return this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: { message, isInfo }
    });
  }

  // ✅ Feedback dialog (success, error, info)
  openFeedbackDialog(type: 'success' | 'error' | 'info', content?: string) {
    //return this.dialog.open(FeedbackDialogComponent, {
    //  width: '400px',
    //  panelClass: 'status-dialog',
    //  data: { type, content }
    //});
  }
}
