import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Hook Redux useDispatch typé pour TypeScript
 * Utiliser ce hook au lieu du useDispatch standard
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook Redux useSelector typé pour TypeScript
 * Utiliser ce hook au lieu du useSelector standard
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
