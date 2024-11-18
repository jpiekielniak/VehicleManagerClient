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
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";

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
  MatInput,
  MatCell,
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
