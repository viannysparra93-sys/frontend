import { EquipmentStatus, EquipmentType } from "../../domain/models/equipment.model";

export interface EquipmentDTO {
  id: string;
  assetTag: string;
  serialNumber: string;
  model: string;                  
  type: EquipmentType;
  status: EquipmentStatus;
  locationId: string;
  purchaseDate: Date | string;
  warrantyEnd: Date | string;
  metadata: Record<string, unknown> | Map<string, unknown>;
}
