import { z } from 'zod';
import { AmbulanceStatus, EquipmentType, CrewRole } from '../../types';

/**
 * Schéma de validation pour la création d'une ambulance
 */
export const createAmbulanceSchema = z.object({
  vehicleNumber: z
    .string()
    .regex(/^AMB-\d{3}$/, 'Le numéro de véhicule doit être au format AMB-XXX (ex: AMB-106)')
    .min(7)
    .max(7),

  licensePlate: z
    .string()
    .min(5, 'La plaque d\'immatriculation doit contenir au moins 5 caractères')
    .max(15, 'La plaque d\'immatriculation ne peut pas dépasser 15 caractères'),

  status: z.union([
    z.literal(AmbulanceStatus.AVAILABLE),
    z.literal(AmbulanceStatus.BUSY),
    z.literal(AmbulanceStatus.MAINTENANCE),
    z.literal(AmbulanceStatus.OFFLINE),
  ]),

  baseStation: z
    .string()
    .min(3, 'La station de base doit contenir au moins 3 caractères')
    .max(50, 'La station de base ne peut pas dépasser 50 caractères'),

  currentLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),

  heading: z.number().min(0).max(360).optional(),

  // Equipment
  equipment: z.array(z.object({
    type: z.union([
      z.literal(EquipmentType.DEFIBRILLATOR),
      z.literal(EquipmentType.OXYGEN),
      z.literal(EquipmentType.STRETCHER),
      z.literal(EquipmentType.FIRST_AID_KIT),
      z.literal(EquipmentType.ECG),
      z.literal(EquipmentType.VENTILATOR),
    ]),
    name: z.string().min(2, 'Le nom de l\'équipement doit contenir au moins 2 caractères'),
    isOperational: z.boolean(),
  })).min(1, 'Au moins un équipement est requis'),

  // Crew
  crew: z.array(z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    role: z.union([
      z.literal(CrewRole.DRIVER),
      z.literal(CrewRole.PARAMEDIC),
      z.literal(CrewRole.NURSE),
      z.literal(CrewRole.DOCTOR),
    ]),
    phoneNumber: z.string().regex(
      /^(\+212|0)[5-7]\d{8}$/,
      'Numéro de téléphone marocain invalide'
    ),
  })).min(2, 'Au moins 2 membres d\'équipage sont requis')
    .max(5, 'Maximum 5 membres d\'équipage'),
});

export type CreateAmbulanceFormData = z.infer<typeof createAmbulanceSchema>;

/**
 * Valeurs par défaut pour le formulaire
 */
export const createAmbulanceDefaultValues: Partial<CreateAmbulanceFormData> = {
  vehicleNumber: '',
  licensePlate: '',
  status: AmbulanceStatus.AVAILABLE,
  baseStation: 'Casa Central',
  currentLocation: {
    latitude: 33.5731,
    longitude: -7.5898,
  },
  heading: 0,
  equipment: [
    {
      type: EquipmentType.FIRST_AID_KIT,
      name: 'Trousse de premiers soins',
      isOperational: true,
    },
    {
      type: EquipmentType.STRETCHER,
      name: 'Civière',
      isOperational: true,
    },
  ],
  crew: [
    {
      firstName: '',
      lastName: '',
      role: CrewRole.DRIVER,
      phoneNumber: '',
    },
    {
      firstName: '',
      lastName: '',
      role: CrewRole.PARAMEDIC,
      phoneNumber: '',
    },
  ],
};

/**
 * Schéma pour la mise à jour du statut uniquement
 */
export const updateAmbulanceStatusSchema = z.object({
  status: z.union([
    z.literal(AmbulanceStatus.AVAILABLE),
    z.literal(AmbulanceStatus.BUSY),
    z.literal(AmbulanceStatus.MAINTENANCE),
    z.literal(AmbulanceStatus.OFFLINE),
  ]),
});

export type UpdateAmbulanceStatusFormData = z.infer<typeof updateAmbulanceStatusSchema>;
