import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAmbulance } from '../../hooks/useAmbulances';
import {
  createAmbulanceSchema,
  createAmbulanceDefaultValues,
  type CreateAmbulanceFormData,
} from '../../lib/validations/ambulance';
import { AmbulanceStatus, EquipmentType, CrewRole, type Ambulance } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { DialogFooter } from '../ui/Dialog';
import { useNotifications } from '../../hooks/useNotifications';

interface AddAmbulanceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddAmbulanceForm({ onSuccess, onCancel }: AddAmbulanceFormProps) {
  const createAmbulanceMutation = useCreateAmbulance();
  const { notifySuccess, notifyError } = useNotifications();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAmbulanceFormData>({
    resolver: zodResolver(createAmbulanceSchema),
    defaultValues: createAmbulanceDefaultValues,
  });

  const { fields: crewFields, append: appendCrew, remove: removeCrew } = useFieldArray({
    control,
    name: 'crew',
  });

  const { fields: equipmentFields, append: appendEquipment, remove: removeEquipment } = useFieldArray({
    control,
    name: 'equipment',
  });

  const onSubmit = async (data: CreateAmbulanceFormData) => {
    try {
      const baseId = Date.now();
      const timestamp = new Date().toISOString();

      const newAmbulance: Ambulance = {
        ...data,
        id: `amb-${baseId}`,
        lastUpdate: timestamp,
        crew: data.crew.map((member, index) => ({
          id: `crew-${baseId}-${index}`,
          ...member,
        })),
        equipment: data.equipment.map((item, index) => ({
          id: `equip-${baseId}-${index}`,
          ...item,
        })),
      };

      await createAmbulanceMutation.mutateAsync(newAmbulance);
      reset();
      onSuccess?.();
      notifySuccess('Ambulance ajoutée à la flotte');
    } catch (error) {
      console.error('Error creating ambulance:', error);
      notifyError('Impossible d’ajouter l’ambulance. Vérifiez le formulaire.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de véhicule *
            </label>
            <Input
              id="vehicleNumber"
              {...register('vehicleNumber')}
              placeholder="AMB-106"
            />
            {errors.vehicleNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
              Plaque d'immatriculation *
            </label>
            <Input
              id="licensePlate"
              {...register('licensePlate')}
              placeholder="12345-A-67"
            />
            {errors.licensePlate && (
              <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut *
            </label>
            <Select id="status" {...register('status')}>
              <option value={AmbulanceStatus.AVAILABLE}>Disponible</option>
              <option value={AmbulanceStatus.BUSY}>Occupée</option>
              <option value={AmbulanceStatus.MAINTENANCE}>Maintenance</option>
              <option value={AmbulanceStatus.OFFLINE}>Hors service</option>
            </Select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="baseStation" className="block text-sm font-medium text-gray-700 mb-1">
              Station de base *
            </label>
            <Input
              id="baseStation"
              {...register('baseStation')}
              placeholder="Casa Central"
            />
            {errors.baseStation && (
              <p className="mt-1 text-sm text-red-600">{errors.baseStation.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="currentLocation.latitude" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude *
            </label>
            <Input
              id="currentLocation.latitude"
              type="number"
              step="0.000001"
              {...register('currentLocation.latitude', { valueAsNumber: true })}
              placeholder="33.5731"
            />
            {errors.currentLocation?.latitude && (
              <p className="mt-1 text-sm text-red-600">{errors.currentLocation.latitude.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="currentLocation.longitude" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude *
            </label>
            <Input
              id="currentLocation.longitude"
              type="number"
              step="0.000001"
              {...register('currentLocation.longitude', { valueAsNumber: true })}
              placeholder="-7.5898"
            />
            {errors.currentLocation?.longitude && (
              <p className="mt-1 text-sm text-red-600">{errors.currentLocation.longitude.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">
              Direction (°)
            </label>
            <Input
              id="heading"
              type="number"
              min="0"
              max="360"
              {...register('heading', { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.heading && (
              <p className="mt-1 text-sm text-red-600">{errors.heading.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Crew */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Équipage (min. 2 membres)</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => appendCrew({
              firstName: '',
              lastName: '',
              role: CrewRole.PARAMEDIC,
              phoneNumber: '',
            })}
          >
            + Ajouter un membre
          </Button>
        </div>

        <div className="space-y-4">
          {crewFields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Membre {index + 1}</span>
                {crewFields.length > 2 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => removeCrew(index)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register(`crew.${index}.firstName`)}
                    placeholder="Prénom"
                  />
                  {errors.crew?.[index]?.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.crew[index]?.firstName?.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    {...register(`crew.${index}.lastName`)}
                    placeholder="Nom"
                  />
                  {errors.crew?.[index]?.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.crew[index]?.lastName?.message}</p>
                  )}
                </div>

                <div>
                  <Select {...register(`crew.${index}.role`)}>
                    <option value={CrewRole.DRIVER}>Conducteur</option>
                    <option value={CrewRole.PARAMEDIC}>Ambulancier</option>
                    <option value={CrewRole.NURSE}>Infirmier</option>
                    <option value={CrewRole.DOCTOR}>Médecin</option>
                  </Select>
                </div>

                <div>
                  <Input
                    {...register(`crew.${index}.phoneNumber`)}
                    placeholder="Téléphone"
                  />
                  {errors.crew?.[index]?.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.crew[index]?.phoneNumber?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Équipement (min. 1)</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => appendEquipment({
              type: EquipmentType.FIRST_AID_KIT,
              name: '',
              isOperational: true,
            })}
          >
            + Ajouter un équipement
          </Button>
        </div>

        <div className="space-y-3">
          {equipmentFields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <Select {...register(`equipment.${index}.type`)} className="flex-1">
                <option value={EquipmentType.DEFIBRILLATOR}>Défibrillateur</option>
                <option value={EquipmentType.OXYGEN}>Oxygène</option>
                <option value={EquipmentType.STRETCHER}>Civière</option>
                <option value={EquipmentType.FIRST_AID_KIT}>Trousse premiers soins</option>
                <option value={EquipmentType.ECG}>ECG</option>
                <option value={EquipmentType.VENTILATOR}>Ventilateur</option>
              </Select>

              <Input
                {...register(`equipment.${index}.name`)}
                placeholder="Nom de l'équipement"
                className="flex-1"
              />

              <label className="flex items-center gap-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  {...register(`equipment.${index}.isOperational`)}
                  className="rounded"
                />
                <span className="text-sm">Opérationnel</span>
              </label>

              {equipmentFields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeEquipment(index)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>
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
          {isSubmitting ? 'Création...' : 'Créer l\'ambulance'}
        </Button>
      </DialogFooter>
    </form>
  );
}
