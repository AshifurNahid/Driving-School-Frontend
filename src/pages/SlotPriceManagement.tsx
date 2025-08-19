import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/redux/store';
import {
  getSlotPricingList,
  createSlotPricing,
  updateSlotPricing,
  deleteSlotPricing,
  slotPricingCreateReset,
  slotPricingUpdateReset,
  slotPricingDeleteReset,
  SlotPricing,
  SlotPricingCreatePayload
} from '@/redux/actions/slotPricingAction';

interface SlotPricingFormData {
  duration_hours: string;
  price_per_slot: string;
  status: number;
}

const SlotPriceManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state
  const { loading, slotPricings, error } = useSelector((state: RootState) => state.slotPricingList);
  const { loading: createLoading, success: createSuccess, error: createError, message: createMessage } = useSelector((state: RootState) => state.slotPricingCreate);
  const { loading: updateLoading, success: updateSuccess, error: updateError, message: updateMessage } = useSelector((state: RootState) => state.slotPricingUpdate);
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError, message: deleteMessage } = useSelector((state: RootState) => state.slotPricingDelete);

  // Local state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<SlotPricing | null>(null);
  const [formData, setFormData] = useState<SlotPricingFormData>({
    duration_hours: '',
    price_per_slot: '',
    status: 1
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load data on component mount
  useEffect(() => {
    dispatch(getSlotPricingList() as any);
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (createSuccess) {
      toast({
        title: "Success",
        description: createMessage || "Slot pricing created successfully",
        variant: "default",
      });
      setIsCreateModalOpen(false);
      resetForm();
      dispatch(getSlotPricingList() as any);
      dispatch(slotPricingCreateReset() as any);
    }
  }, [createSuccess, createMessage, dispatch, toast]);

  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Success",
        description: updateMessage || "Slot pricing updated successfully",
        variant: "default",
      });
      setIsEditModalOpen(false);
      resetForm();
      dispatch(getSlotPricingList() as any);
      dispatch(slotPricingUpdateReset() as any);
    }
  }, [updateSuccess, updateMessage, dispatch, toast]);

  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Success",
        description: deleteMessage || "Slot pricing deleted successfully",
        variant: "default",
      });
      setIsDeleteModalOpen(false);
      setSelectedPricing(null);
      dispatch(getSlotPricingList() as any);
      dispatch(slotPricingDeleteReset() as any);
    }
  }, [deleteSuccess, deleteMessage, dispatch, toast]);

  // Handle errors
  useEffect(() => {
    if (createError) {
      toast({
        title: "Error",
        description: createError,
        variant: "destructive",
      });
    }
  }, [createError, toast]);

  useEffect(() => {
    if (updateError) {
      toast({
        title: "Error",
        description: updateError,
        variant: "destructive",
      });
    }
  }, [updateError, toast]);

  useEffect(() => {
    if (deleteError) {
      toast({
        title: "Error",
        description: deleteError,
        variant: "destructive",
      });
    }
  }, [deleteError, toast]);

  const resetForm = () => {
    setFormData({
      duration_hours: '',
      price_per_slot: '',
      status: 1
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.duration_hours || parseFloat(formData.duration_hours) <= 0) {
      errors.duration_hours = 'Duration must be greater than 0';
    }
    
    if (!formData.price_per_slot || parseFloat(formData.price_per_slot) <= 0) {
      errors.price_per_slot = 'Price per slot must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOpen = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEditOpen = (pricing: SlotPricing) => {
    setSelectedPricing(pricing);
    setFormData({
      duration_hours: pricing.duration_hours.toString(),
      price_per_slot: pricing.price_per_slot.toString(),
      status: pricing.status
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleDeleteOpen = (pricing: SlotPricing) => {
    setSelectedPricing(pricing);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const payload: SlotPricingCreatePayload = {
      duration_hours: parseFloat(formData.duration_hours),
      price_per_slot: parseFloat(formData.price_per_slot),
      status: formData.status
    };

    dispatch(createSlotPricing(payload) as any);
  };

  const handleUpdate = () => {
    if (!validateForm() || !selectedPricing) return;

    const payload = {
      duration_hours: parseFloat(formData.duration_hours),
      price_per_slot: parseFloat(formData.price_per_slot),
      status: formData.status
    };

    dispatch(updateSlotPricing(selectedPricing.id, payload) as any);
  };

  const handleDelete = () => {
    if (!selectedPricing) return;
    dispatch(deleteSlotPricing(selectedPricing.id) as any);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading slot pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Slot Price Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage pricing for different appointment slot durations
          </p>
        </div>
        <Button onClick={handleCreateOpen} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Price
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slotPricings.map((pricing) => (
          <Card key={pricing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  {pricing.duration_hours}h Session
                </CardTitle>
                <Badge variant={pricing.status === 1 ? "default" : "secondary"}>
                  {pricing.status === 1 ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                <DollarSign className="h-6 w-6" />
                {pricing.price_per_slot}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>Created: {formatDate(pricing.created_at)}</p>
                <p>Updated: {formatDate(pricing.updated_at)}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditOpen(pricing)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteOpen(pricing)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {slotPricings.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pricing configured</h3>
            <p className="text-gray-600 mb-4">
              Create your first slot pricing to get started
            </p>
            <Button onClick={handleCreateOpen} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Price
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Slot Pricing</DialogTitle>
            <DialogDescription>
              Add a new pricing configuration for appointment slots
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration_hours">Duration (Hours) *</Label>
              <Input
                id="duration_hours"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g., 1.5"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                className={formErrors.duration_hours ? 'border-red-500' : ''}
              />
              {formErrors.duration_hours && (
                <p className="text-red-500 text-sm mt-1">{formErrors.duration_hours}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price_per_slot">Price per Slot ($) *</Label>
              <Input
                id="price_per_slot"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g., 25.00"
                value={formData.price_per_slot}
                onChange={(e) => setFormData({ ...formData, price_per_slot: e.target.value })}
                className={formErrors.price_per_slot ? 'border-red-500' : ''}
              />
              {formErrors.price_per_slot && (
                <p className="text-red-500 text-sm mt-1">{formErrors.price_per_slot}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createLoading ? "Creating..." : "Create Pricing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Slot Pricing</DialogTitle>
            <DialogDescription>
              Update the pricing configuration for this slot duration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_duration_hours">Duration (Hours) *</Label>
              <Input
                id="edit_duration_hours"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g., 1.5"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                className={formErrors.duration_hours ? 'border-red-500' : ''}
              />
              {formErrors.duration_hours && (
                <p className="text-red-500 text-sm mt-1">{formErrors.duration_hours}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit_price_per_slot">Price per Slot ($) *</Label>
              <Input
                id="edit_price_per_slot"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g., 25.00"
                value={formData.price_per_slot}
                onChange={(e) => setFormData({ ...formData, price_per_slot: e.target.value })}
                className={formErrors.price_per_slot ? 'border-red-500' : ''}
              />
              {formErrors.price_per_slot && (
                <p className="text-red-500 text-sm mt-1">{formErrors.price_per_slot}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateLoading ? "Updating..." : "Update Pricing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slot Pricing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the pricing for {selectedPricing?.duration_hours}h sessions? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SlotPriceManagement;
