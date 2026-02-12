'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BrandSettings {
  logoUrl: string;
  brandName: string;
  tagline: string;
  description: string;
}

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<BrandSettings>({
    logoUrl: '/logo-placeholder.png',
    brandName: 'AutoParts Kenya',
    tagline: 'Quality spares. Fast delivery. Trusted mechanics.',
    description: 'Your trusted source for genuine automotive spare parts in Kenya.',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(settings.logoUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    field: keyof BrandSettings,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Upload logo to API if file is selected
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);

        // TODO: Replace with actual API endpoint
        // const response = await apiMethods.uploadBrandLogo(formData);
        // setSettings((prev) => ({
        //   ...prev,
        //   logoUrl: response.data.logo_url,
        // }));
      }

      // TODO: Save brand settings to API
      // await apiMethods.updateBrandSettings(settings);

      toast.success('Settings saved successfully!');
      setLogoFile(null);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(settings.logoUrl);
  };

  return (
    <div className="min-h-screen bg-road-grey-100 py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 font-montserrat font-bold text-road-grey-900 mb-2">
            Brand Settings
          </h1>
          <p className="text-body-md text-road-grey-700">
            Manage your store's branding, logo, and company information
          </p>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Logo Upload Section */}
          <div className="space-y-4">
            <h2 className="text-h4 font-montserrat font-bold text-road-grey-900">
              Brand Logo
            </h2>
            <p className="text-body-sm text-road-grey-700">
              Upload your store logo. Recommended size: 200x200px (min), supports PNG, JPG, WebP
            </p>

            {/* Preview */}
            <div className="relative bg-road-grey-100 rounded-lg border-2 border-dashed border-road-grey-300 p-6 flex flex-col items-center justify-center min-h-64">
              {previewUrl && (
                <>
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={previewUrl}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {logoFile && (
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute top-4 right-4 p-1 bg-reliable-red text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Remove logo"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}

              {/* Upload Area */}
              <label className="cursor-pointer w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-mechanic-blue" />
                  <p className="text-body-md font-semibold text-road-grey-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-body-sm text-road-grey-500">
                    PNG, JPG, WebP (Max 5MB)
                  </p>
                </div>
              </label>
            </div>

            {logoFile && (
              <div className="flex items-center gap-2 p-3 bg-success-green/10 border border-success-green/30 rounded-lg">
                <Check className="w-5 h-5 text-success-green" />
                <p className="text-body-sm text-success-green font-medium">
                  {logoFile.name} - Ready to upload
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-road-grey-200"></div>

          {/* Brand Name */}
          <div className="space-y-2">
            <label className="block text-body-md font-semibold text-road-grey-900">
              Brand Name
            </label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => handleInputChange('brandName', e.target.value)}
              className="w-full px-4 py-2 border border-road-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mechanic-blue"
              placeholder="Enter your brand name"
            />
            <p className="text-body-sm text-road-grey-500">
              Displayed in the header and footer
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <label className="block text-body-md font-semibold text-road-grey-900">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              className="w-full px-4 py-2 border border-road-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mechanic-blue"
              placeholder="Enter your tagline"
            />
            <p className="text-body-sm text-road-grey-500">
              Shown in hero section (max 100 characters)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-body-md font-semibold text-road-grey-900">
              Store Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-road-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mechanic-blue resize-none"
              rows={4}
              placeholder="Describe your store"
            />
            <p className="text-body-sm text-road-grey-500">
              Used for SEO and footer information
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-mechanic-blue text-white font-montserrat font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => {
                setSettings({
                  logoUrl: '/logo-placeholder.png',
                  brandName: 'AutoParts Kenya',
                  tagline: 'Quality spares. Fast delivery. Trusted mechanics.',
                  description: 'Your trusted source for genuine automotive spare parts in Kenya.',
                });
                setLogoFile(null);
                setPreviewUrl('/logo-placeholder.png');
              }}
              className="flex-1 px-6 py-3 bg-road-grey-200 text-road-grey-900 font-montserrat font-semibold rounded-lg hover:bg-road-grey-300 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-info-cyan/10 border border-info-cyan/30 rounded-lg">
            <p className="text-body-sm text-info-cyan font-medium">
              💡 Tip: Changes will be reflected across the website, including header, footer, and brand materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
