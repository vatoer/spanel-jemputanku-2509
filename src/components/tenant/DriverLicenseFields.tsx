"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateDriverData, CreateDriverLicenseData, DriverLicenseType } from "@/schema/driver";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

interface DriverLicenseFieldsProps {
  form: UseFormReturn<CreateDriverData>;
}

const LICENSE_TYPES: { value: DriverLicenseType; label: string; description: string }[] = [
  { value: "A", label: "SIM A", description: "Sepeda motor hingga 250cc" },
  { value: "A1", label: "SIM A1", description: "Sepeda motor hingga 125cc" },
  { value: "B", label: "SIM B", description: "Mobil dan kendaraan ringan" },
  { value: "B1", label: "SIM B1", description: "Mobil untuk keperluan pribadi" },
  { value: "B2", label: "SIM B2", description: "Mobil dengan trailer, truk kecil" },
  { value: "C", label: "SIM C", description: "Truk berat dan bus" },
  { value: "D", label: "SIM D", description: "Kendaraan khusus (traktor, alat berat)" },
];

export function DriverLicenseFields({ form }: DriverLicenseFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "licenses"
  });

  const [newLicense, setNewLicense] = useState<Partial<CreateDriverLicenseData>>({
    licenseType: "B",
    licenseNumber: "",
    issuedDate: undefined,
    expiresAt: undefined,
    issuingAuthority: "",
    notes: "",
  });

  const addLicense = () => {
    if (newLicense.licenseType && newLicense.licenseNumber && newLicense.issuedDate && newLicense.expiresAt) {
      // Check if license type already exists
      const existingLicense = fields.find(field => field.licenseType === newLicense.licenseType);
      if (existingLicense) {
        alert("Driver sudah memiliki SIM dengan tipe ini");
        return;
      }

      append(newLicense as CreateDriverLicenseData & {
        issuedDate: Date;
        expiresAt: Date;
      });
      setNewLicense({
        licenseType: "B",
        licenseNumber: "",
        issuedDate: undefined,
        expiresAt: undefined,
        issuingAuthority: "",
        notes: "",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateString: string) => {
    return new Date(dateString);
  };

  const isExpired = (expiresAt: Date) => {
    return new Date() > expiresAt;
  };

  const isExpiringSoon = (expiresAt: Date, days: number = 30) => {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + days);
    return new Date() <= expiresAt && expiresAt <= warningDate;
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-4 block">
          Informasi SIM Driver
        </Label>
        
        {/* Existing Licenses */}
        {fields.length > 0 && (
          <div className="space-y-3 mb-4">
            {fields.map((field, index) => {
              // Type assertion: z.coerce.date() ensures these are Date objects at runtime
              const license = field as CreateDriverLicenseData & {
                issuedDate: Date;
                expiresAt: Date;
              };
              const expired = isExpired(license.expiresAt);
              const expiringSoon = isExpiringSoon(license.expiresAt);
              
              return (
                <div 
                  key={field.id} 
                  className={`p-4 border rounded-lg ${
                    expired ? 'border-red-200 bg-red-50' : 
                    expiringSoon ? 'border-yellow-200 bg-yellow-50' : 
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {LICENSE_TYPES.find(t => t.value === license.licenseType)?.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {LICENSE_TYPES.find(t => t.value === license.licenseType)?.description}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {license.licenseNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {license.issuingAuthority || "Kepolisian RI"}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${
                          expired ? 'text-red-600' : 
                          expiringSoon ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          Berlaku hingga: {license.expiresAt.toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Dikeluarkan: {license.issuedDate.toLocaleDateString('id-ID')}
                        </div>
                        {expired && (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            ⚠️ SIM sudah kadaluarsa
                          </div>
                        )}
                        {expiringSoon && !expired && (
                          <div className="text-xs text-yellow-600 font-medium mt-1">
                            ⚠️ SIM akan kadaluarsa dalam 30 hari
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Hapus
                    </Button>
                  </div>
                  {license.notes && (
                    <div className="mt-2 text-xs text-gray-600">
                      Catatan: {license.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add New License Form */}
        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Tambah SIM Baru</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licenseType" className="text-xs font-medium text-gray-600">
                Jenis SIM
              </Label>
              <Select
                value={newLicense.licenseType}
                onValueChange={(value) => setNewLicense(prev => ({ ...prev, licenseType: value as DriverLicenseType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis SIM" />
                </SelectTrigger>
                <SelectContent>
                  {LICENSE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-xs font-medium text-gray-600">
                Nomor SIM
              </Label>
              <Input
                id="licenseNumber"
                type="text"
                placeholder="1234567890123"
                value={newLicense.licenseNumber}
                onChange={(e) => setNewLicense(prev => ({ ...prev, licenseNumber: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuedDate" className="text-xs font-medium text-gray-600">
                Tanggal Dikeluarkan
              </Label>
              <Input
                id="issuedDate"
                type="date"
                value={newLicense.issuedDate ? formatDate(newLicense.issuedDate) : ""}
                onChange={(e) => setNewLicense(prev => ({ ...prev, issuedDate: parseDate(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-xs font-medium text-gray-600">
                Tanggal Kadaluarsa
              </Label>
              <Input
                id="expiresAt"
                type="date"
                value={newLicense.expiresAt ? formatDate(newLicense.expiresAt) : ""}
                onChange={(e) => setNewLicense(prev => ({ ...prev, expiresAt: parseDate(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuingAuthority" className="text-xs font-medium text-gray-600">
                Instansi Penerbit
              </Label>
              <Input
                id="issuingAuthority"
                type="text"
                placeholder="Polda Metro Jaya"
                value={newLicense.issuingAuthority}
                onChange={(e) => setNewLicense(prev => ({ ...prev, issuingAuthority: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs font-medium text-gray-600">
                Catatan (Opsional)
              </Label>
              <Input
                id="notes"
                type="text"
                placeholder="Catatan khusus"
                value={newLicense.notes}
                onChange={(e) => setNewLicense(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLicense}
              disabled={!newLicense.licenseType || !newLicense.licenseNumber || !newLicense.issuedDate || !newLicense.expiresAt}
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              + Tambah SIM
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}