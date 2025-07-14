// MaterialModal.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export function MaterialModal({ open, onClose, materials, onSave }) {
  const [localMaterials, setLocalMaterials] = useState(materials || []);

  const addMaterial = () => {
    setLocalMaterials(mats => [...mats, { name: "", url: "" }]);
  };

  const updateMaterial = (idx, field, value) => {
    const mats = [...localMaterials];
    mats[idx][field] = value;
    setLocalMaterials(mats);
  };

  const removeMaterial = idx => {
    setLocalMaterials(mats => mats.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Materials</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Button size="sm" onClick={addMaterial}>
            <Plus className="h-4 w-4 mr-1" /> Add Material
          </Button>
          {localMaterials.map((mat, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                placeholder="Material Name"
                value={mat.name}
                onChange={e => updateMaterial(idx, "name", e.target.value)}
              />
              <Input
                placeholder="PDF URL"
                value={mat.url}
                onChange={e => updateMaterial(idx, "url", e.target.value)}
              />
              <Button size="sm" variant="ghost" onClick={() => removeMaterial(idx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(localMaterials); onClose(); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}