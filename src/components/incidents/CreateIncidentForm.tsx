import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateIncident } from '../../hooks/useIncidents';
import {
  createIncidentSchema,
  createIncidentDefaultValues,
  type CreateIncidentFormData,
} from '../../lib/validations/incident';
import { IncidentSeverity, IncidentStatus, type Incident } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { DialogFooter } from '../ui/Dialog';
import { useNotifications } from '../../hooks/useNotifications';

interface CreateIncidentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateIncidentForm({ onSuccess, onCancel }: CreateIncidentFormProps) {
  const createIncidentMutation = useCreateIncident();
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateIncidentFormData>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: createIncidentDefaultValues,
  });

  const onSubmit = async (data: CreateIncidentFormData) => {
    try {
      const timestamp = new Date().toISOString();
      const baseId = Date.now();

      const newIncident: Incident = {
        id: `inc-${baseId}`,
        ...data,
        notes: data.notes,
        status: IncidentStatus.PENDING,
        createdAt: timestamp,
        updatedAt: timestamp,
        patient: {
          id: `pat-${baseId}`,
          ...data.patient,
        },
      };

      await createIncidentMutation.mutateAsync(newIncident);
      reset();
      onSuccess?.();
      notifySuccess('Incident créé avec succès');
      if (newIncident.severity === IncidentSeverity.CRITICAL) {
        notifyWarning('Incident critique signalé : action immédiate requise.');
      }
    } catch (error) {
      console.error('Error creating incident:', error);
      notifyError('Impossible de créer l’incident. Réessayez.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title and Description */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'incident *
          </label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Ex: Accident de la route"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Décrivez la situation..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            Gravité *
          </label>
          <Select id="severity" {...register('severity')}>
            <option value={IncidentSeverity.LOW}>Faible</option>
            <option value={IncidentSeverity.MEDIUM}>Moyenne</option>
            <option value={IncidentSeverity.HIGH}>Élevée</option>
            <option value={IncidentSeverity.CRITICAL}>Critique</option>
          </Select>
          {errors.severity && (
            <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Localisation</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="location.street" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <Input
              id="location.street"
              {...register('location.street')}
              placeholder="Avenue Hassan II"
            />
            {errors.location?.street && (
              <p className="mt-1 text-sm text-red-600">{errors.location.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <Input
                id="location.city"
                {...register('location.city')}
                placeholder="Casablanca"
              />
              {errors.location?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="location.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal *
              </label>
              <Input
                id="location.postalCode"
                {...register('location.postalCode')}
                placeholder="20000"
              />
              {errors.location?.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.location.postalCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="location.coordinates.latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude *
              </label>
              <Input
                id="location.coordinates.latitude"
                type="number"
                step="0.000001"
                {...register('location.coordinates.latitude', { valueAsNumber: true })}
                placeholder="33.5731"
              />
              {errors.location?.coordinates?.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.location.coordinates.latitude.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="location.coordinates.longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude *
              </label>
              <Input
                id="location.coordinates.longitude"
                type="number"
                step="0.000001"
                {...register('location.coordinates.longitude', { valueAsNumber: true })}
                placeholder="-7.5898"
              />
              {errors.location?.coordinates?.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.location.coordinates.longitude.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations Patient</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient.firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <Input
                id="patient.firstName"
                {...register('patient.firstName')}
                placeholder="Mohammed"
              />
              {errors.patient?.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.patient.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="patient.lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <Input
                id="patient.lastName"
                {...register('patient.lastName')}
                placeholder="Alami"
              />
              {errors.patient?.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.patient.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient.age" className="block text-sm font-medium text-gray-700 mb-1">
                Âge *
              </label>
              <Input
                id="patient.age"
                type="number"
                {...register('patient.age', { valueAsNumber: true })}
                placeholder="35"
              />
              {errors.patient?.age && (
                <p className="mt-1 text-sm text-red-600">{errors.patient.age.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="patient.gender" className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <Select id="patient.gender" {...register('patient.gender')}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </Select>
              {errors.patient?.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.patient.gender.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="patient.phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <Input
              id="patient.phoneNumber"
              {...register('patient.phoneNumber')}
              placeholder="+212612345678 ou 0612345678"
            />
            {errors.patient?.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.patient.phoneNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-gray-200 pt-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes additionnelles (optionnel)
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={2}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Informations supplémentaires..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Footer */}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Création...' : 'Créer l\'incident'}
        </Button>
      </DialogFooter>
    </form>
  );
}
