import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crewmateService } from '../services/supabaseService';
import type { InsertTables, UpdateTables } from '../types/database.types';
import { useToast } from './use-toast';

export const useCrewmates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all crewmates
  const getCrewmates = () => {
    return useQuery({
      queryKey: ['crewmates'],
      queryFn: async () => {
        const { data, error } = await crewmateService.getAllCrewmates();
        if (error) {
          toast({
            title: 'Error fetching crewmates',
            description: error.message,
            variant: 'destructive',
          });
          return [];
        }
        return data || [];
      },
    });
  };

  // Get a single crewmate by ID
  const getCrewmate = (id: number) => {
    return useQuery({
      queryKey: ['crewmates', id],
      queryFn: async () => {
        const { data, error } = await crewmateService.getCrewmate(id);
        if (error) {
          toast({
            title: 'Error fetching crewmate',
            description: error.message,
            variant: 'destructive',
          });
          return null;
        }
        return data;
      },
      enabled: !!id,
    });
  };

  // Create a new crewmate
  const createCrewmate = () => {
    return useMutation({
      mutationFn: async (crewmate: InsertTables<'crewmates'>) => {
        return await crewmateService.createCrewmate(crewmate);
      },
      onSuccess: (result) => {
        if (result.data) {
          queryClient.invalidateQueries({ queryKey: ['crewmates'] });
          toast({
            title: 'Success!',
            description: 'Crewmate created successfully.',
          });
        } else if (result.error) {
          toast({
            title: 'Error creating crewmate',
            description: result.error.message,
            variant: 'destructive',
          });
        }
        return result;
      },
    });
  };

  // Update an existing crewmate
  const updateCrewmate = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: number; updates: UpdateTables<'crewmates'> }) => {
        return await crewmateService.updateCrewmate(id, updates);
      },
      onSuccess: (result, variables) => {
        if (result.data) {
          queryClient.invalidateQueries({ queryKey: ['crewmates'] });
          queryClient.invalidateQueries({ queryKey: ['crewmates', variables.id] });
          toast({
            title: 'Success!',
            description: 'Crewmate updated successfully.',
          });
        } else if (result.error) {
          toast({
            title: 'Error updating crewmate',
            description: result.error.message,
            variant: 'destructive',
          });
        }
        return result;
      },
    });
  };

  // Delete a crewmate
  const deleteCrewmate = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        return await crewmateService.deleteCrewmate(id);
      },
      onSuccess: (result, id) => {
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ['crewmates'] });
          toast({
            title: 'Success!',
            description: 'Crewmate deleted successfully.',
          });
        } else if (result.error) {
          toast({
            title: 'Error deleting crewmate',
            description: result.error.message,
            variant: 'destructive',
          });
        }
        return result;
      },
    });
  };

  return {
    getCrewmates,
    getCrewmate,
    createCrewmate,
    updateCrewmate,
    deleteCrewmate,
  };
};