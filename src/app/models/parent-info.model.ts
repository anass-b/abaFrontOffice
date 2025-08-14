import { Child } from "./child.model";

export interface ParentInfo {
  id?: number;
  userId?: number;
  nombreEnfants?: number;
  nombreEnfantsDiagnostiques?: number;
  children?: Child[];
}
