// Esquema Zod para validar el DTO del formulario de equipos.

import z from 'zod';

export const EquipmentDTOSchema = z.object({
  id: z.string().min(1),
  assetTag: z.string().trim().min(1, 'Asset Tag es requerido'),
  serialNumber: z.string().trim().min(1, 'Serial es requerido'),
  model: z.string().trim().min(1, 'Modelo es requerido'),
  type: z.enum(['Laptop','Desktop','Printer','Monitor','Server','Other']),
  status: z.enum(['Available','InUse','InRepair','Retired']),
  locationId: z.string().trim().min(1, 'Ubicación es requerida'),
  purchaseDate: z.union([z.string(), z.date()]),
  warrantyEnd: z.union([z.string(), z.date()]),
  metadata: z.union([
    z.record(z.unknown()),
    z.any().refine(v => v instanceof Map, { message: 'Debe ser Map o Record' })
  ]).default({})
});

export type EquipmentDTOInput = z.infer<typeof EquipmentDTOSchema>;
