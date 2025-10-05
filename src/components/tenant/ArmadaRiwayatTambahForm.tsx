"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    ServiceCategoryEnum,
    serviceCategoryLabels,
    ServiceStatusEnum,
    serviceStatusLabels,
    ServiceTypeEnum,
    serviceTypeLabels,
} from "@/schema/riwayat";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ArmadaRiwayatTambahFormProps {
  platNomor: string;
}

interface FormData {
  type: string;
  category: string;
  title: string;
  description: string;
  serviceDate: string;
  cost: string;
  mileage: string;
  status: string;
  nextDueDate: string;
  vendor: string;
  invoice: string;
}

export function ArmadaRiwayatTambahForm({ platNomor }: ArmadaRiwayatTambahFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    type: "MAINTENANCE",
    category: "GENERAL",
    title: "",
    description: "",
    serviceDate: new Date().toISOString().split('T')[0],
    cost: "",
    mileage: "",
    status: "COMPLETED",
    nextDueDate: "",
    vendor: "",
    invoice: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Judul pemeliharaan dan perbaikan wajib diisi";
    }
    
    if (!formData.serviceDate) {
      newErrors.serviceDate = "Tanggal pemeliharaan dan perbaikan wajib diisi";
    }
    
    if (formData.cost && isNaN(Number(formData.cost))) {
      newErrors.cost = "Biaya harus berupa angka";
    }
    
    if (formData.mileage && isNaN(Number(formData.mileage))) {
      newErrors.mileage = "Kilometer harus berupa angka";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to save service record
      console.log("Saving service record:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to riwayat list
      router.push(`/armada/${platNomor}/riwayat`);
    } catch (error) {
      console.error("Error saving service record:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/armada/${platNomor}/riwayat`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Riwayat Pemeliharaan dan Perbaikan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Type & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Jenis Pemeliharaan dan Perbaikan</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pemeliharaan dan perbaikan" />
                </SelectTrigger>
                <SelectContent>
                  {ServiceTypeEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {serviceTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {ServiceCategoryEnum.options.map((category) => (
                    <SelectItem key={category} value={category}>
                      {serviceCategoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Pemeliharaan dan Perbaikan</Label>
            <Input
              id="title"
              placeholder="Contoh: Ganti oli mesin"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi detail tentang pemeliharaan dan perbaikan yang dilakukan..."
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Service Date & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Tanggal Pemeliharaan dan Perbaikan</Label>
              <Input
                id="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={(e) => handleInputChange('serviceDate', e.target.value)}
              />
              {errors.serviceDate && (
                <p className="text-sm text-red-600">{errors.serviceDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {ServiceStatusEnum.options.map((status) => (
                    <SelectItem key={status} value={status}>
                      {serviceStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cost & Mileage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Biaya (Opsional)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                min="0"
                step="1000"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
              />
              <p className="text-xs text-gray-500">Dalam Rupiah (Rp)</p>
              {errors.cost && (
                <p className="text-sm text-red-600">{errors.cost}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Kilometer (Opsional)</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="0"
                min="0"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
              />
              <p className="text-xs text-gray-500">Kilometer pada saat pemeliharaan dan perbaikan</p>
              {errors.mileage && (
                <p className="text-sm text-red-600">{errors.mileage}</p>
              )}
            </div>
          </div>

          {/* Vendor & Invoice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Bengkel (Opsional)</Label>
              <Input
                id="vendor"
                placeholder="Nama bengkel/penyedia pemeliharaan dan perbaikan"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice">No. Invoice (Opsional)</Label>
              <Input
                id="invoice"
                placeholder="Nomor faktur/invoice"
                value={formData.invoice}
                onChange={(e) => handleInputChange('invoice', e.target.value)}
              />
            </div>
          </div>

          {/* Next Due Date */}
          <div className="space-y-2">
            <Label htmlFor="nextDueDate">Jadwal Pemeliharaan dan Perbaikan Berikutnya (Opsional)</Label>
            <Input
              id="nextDueDate"
              type="date"
              value={formData.nextDueDate}
              onChange={(e) => handleInputChange('nextDueDate', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Tanggal perkiraan pemeliharaan dan perbaikan selanjutnya diperlukan
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Riwayat"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}