import { z } from 'zod';
import { IncidentSeverity } from '../../types';

/**
 * Schéma de validation pour la création d'un incident
 */
export const createIncidentSchema = z.object({
  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),

  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),

  severity: z.union([
    z.literal(IncidentSeverity.LOW),
    z.literal(IncidentSeverity.MEDIUM),
    z.literal(IncidentSeverity.HIGH),
    z.literal(IncidentSeverity.CRITICAL),
  ]),

  // Location
  location: z.object({
    street: z.string().min(3, 'L\'adresse doit contenir au moins 3 caractères'),
    city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
    postalCode: z.string().regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),
    country: z.string(),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
  }),

  // Patient information
  patient: z.object({
    id: z.string().optional(),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    age: z.number().int().min(0).max(150, 'L\'âge doit être entre 0 et 150').optional(),
    gender: z.union([z.literal('M'), z.literal('F'), z.literal('OTHER')]).optional(),
    phoneNumber: z.string().regex(
      /^(\+212|0)[5-7]\d{8}$/,
      'Numéro de téléphone marocain invalide (ex: +212612345678 ou 0612345678)'
    ).optional(),
    medicalNotes: z.string().optional(),
  }),

  // Reported by
  reportedBy: z.string().min(2, 'Le nom du déclarant est requis'),

  // Optional notes
  notes: z.string().max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères').optional(),
});

export type CreateIncidentFormData = z.infer<typeof createIncidentSchema>;

/**
 * Schéma pour les coordonnées (utilisé dans l'autocomplete)
 */
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

/**
 * Valeurs par défaut pour le formulaire
 */
export const createIncidentDefaultValues: Partial<CreateIncidentFormData> = {
  severity: IncidentSeverity.MEDIUM,
  location: {
    street: '',
    city: 'Casablanca',
    postalCode: '20000',
    country: 'Maroc',
    coordinates: {
      latitude: 33.5731,
      longitude: -7.5898,
    },
  },
  patient: {
    firstName: '',
    lastName: '',
    age: 0,
    gender: 'M',
    phoneNumber: '',
  },
  reportedBy: 'Opérateur',
  notes: '',
};
