export type ArmadaStatus = "Aktif" | "Maintenance" | "Tidak Aktif";

export interface ArmadaHeaderProps {
  platNomor: string;
  status?: ArmadaStatus;
  title?: string;
  description?: string;
}

export interface StatusColorScheme {
  bg: string;
  border: string;
  dot: string;
  text: string;
}