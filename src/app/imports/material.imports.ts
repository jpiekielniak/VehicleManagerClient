import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {MatSort} from "@angular/material/sort";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import { MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

export const MaterialImports = [
  MatPaginator,
  MatHeaderRow,
  MatHeaderRowDef,
  MatFormField,
  MatLabel,
  MatError,
  MatIcon,
  MatButton,
  MatIconButton,
  MatCardHeader,
  MatCardTitle,
  MatInput,
  MatCard,
  MatCardActions,
  MatCardContent,
  MatSelect,
  MatOption,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
  MatCell,
  MatIconModule,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCellDef,
  MatColumnDef,
  MatTable,
  MatProgressSpinner,
  NgIf,
  MatSort,
  MatRow,
  MatRowDef,
  MatPaginatorModule
] as const;
