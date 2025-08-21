import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminRegionList, createAdminRegion, updateAdminRegion, deleteAdminRegion } from "@/redux/actions/adminAction";
import { RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Modal  from "../ui/modal";
import { Card, CardContent } from "../ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";

const RegionManagement = () => {
  const dispatch = useDispatch();
  const { regions, loading, error } = useSelector((state: RootState) => state.regionList);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [regionForm, setRegionForm] = useState({ region_name: "", description: "" });

  useEffect(() => {
    dispatch(getAdminRegionList() as any);
  }, [dispatch]);

  const handleOpenModal = (region = null) => {
    setEditingRegion(region);
    setRegionForm(region || { region_name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRegion(null);
    setRegionForm({ region_name: "", description: "" });
  };

  const handleSubmit = () => {
    if (!regionForm.region_name.trim() || !regionForm.description.trim()) {
      alert("Region Name and Description cannot be empty.");
      return;
    }

    if (editingRegion) {
      dispatch(updateAdminRegion(editingRegion.id, regionForm) as any);
    } else {
      dispatch(createAdminRegion(regionForm) as any);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this region?")) {
      dispatch(deleteAdminRegion(id) as any);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Region Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your regions and settings
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium text-sm"
          onClick={() => handleOpenModal()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Region
        </Button>
      </div>

      {/* Region List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-600 dark:text-red-400">Error loading regions: {error}</p>
            <Button
              onClick={() => dispatch(getAdminRegionList() as any)}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region, index) => (
            <Card key={region.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {region.region_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {region.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-7"
                    onClick={() => handleOpenModal(region)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 p-0"
                    onClick={() => handleDelete(region.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              {editingRegion ? "Edit Region" : "Add New Region"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseModal}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Close
            </Button>
          </div>
          <Input
            placeholder="Region Name"
            value={regionForm.region_name}
            onChange={(e) => setRegionForm({ ...regionForm, region_name: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Description"
            value={regionForm.description}
            onChange={(e) => setRegionForm({ ...regionForm, description: e.target.value })}
            className="mb-4"
          />
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium text-sm"
          >
            {editingRegion ? "Update" : "Create"}
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default RegionManagement;