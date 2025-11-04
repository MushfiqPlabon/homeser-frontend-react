// SettingsManagement.jsx
// Component for managing system settings in admin panel

import {
  ClockIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  PhotoIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useState } from "react";
import { useToast } from "../context/ToastContext";
import {
  useClearCacheMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../store/extendedApiSlice";

const SettingsManagement = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const _sandboxModeCheckboxId = useId();
  const _requireSpecialCharsCheckboxId = useId();
  const _twoFactorAuthCheckboxId = useId();
  const _enableQueryCacheCheckboxId = useId();

  // Generate unique IDs for form elements
  const siteNameId = useId();
  const siteDescriptionId = useId();
  const contactEmailId = useId();
  const adminEmailId = useId();
  const paymentGatewayId = useId();
  const currencyId = useId();
  const taxRateId = useId();
  const smtpHostId = useId();
  const smtpPortId = useId();
  const smtpUsernameId = useId();
  const smtpPasswordId = useId();
  const fromEmailId = useId();
  const fromNameId = useId();
  const storageBackendId = useId();
  const maxUploadSizeId = useId();
  const allowedFileTypesId = useId();
  const imageQualityId = useId();
  const sessionTimeoutId = useId();
  const passwordMinLengthId = useId();
  const cacheTimeoutId = useId();
  const dbConnectionPoolId = useId();
  const queryTimeoutId = useId();

  // API hooks
  const { data: settings, isLoading, isError, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [clearCache, { isLoading: isClearingCache }] = useClearCacheMutation();

  const [formData, setFormData] = useState({
    general: {
      site_name: "HomeSer",
      site_description: "Service marketplace platform",
      contact_email: "contact@homeser.com",
      admin_email: "admin@homeser.com",
    },
    payment: {
      gateway: "sslcommerz",
      currency: "BDT",
      tax_rate: 5,
      sandbox_mode: true,
    },
    email: {
      smtp_host: "smtp.gmail.com",
      smtp_port: 587,
      smtp_username: "",
      smtp_password: "",
      from_email: "noreply@homeser.com",
      from_name: "HomeSer",
    },
    media: {
      storage_backend: "local",
      max_upload_size: 10,
      allowed_file_types: "jpg,png,gif,pdf,doc,docx",
      image_quality: 80,
    },
    security: {
      session_timeout: 30,
      password_min_length: 8,
      require_special_chars: true,
      two_factor_auth: false,
    },
    performance: {
      cache_timeout: 3600,
      db_connection_pool: 20,
      query_timeout: 30,
      enable_query_cache: true,
    },
  });

  // Cache status data
  const cacheStatus = settings?.cache_status || {
    redis_cache: { enabled: true, hit_rate: 95 },
    database_cache: { enabled: true, entries: 1250 },
    total_hits: 45000,
    miss_rate: 5,
  };

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleSaveSettings = async (section) => {
    setIsUpdating(true);
    try {
      const payload = { [section]: formData[section] };
      await updateSettings(payload).unwrap();
      showToast("Settings saved successfully", "success");
      setIsUpdating(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
      showToast(`Failed to save settings: ${error.message}`, "error");
      setIsUpdating(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      await clearCache().unwrap();
      showToast("Cache cleared successfully", "success");
      setIsClearingCache(false);
      refetch(); // Refresh settings after cache is cleared
    } catch (error) {
      console.error("Failed to clear cache:", error);
      showToast(`Failed to clear cache: ${error.message}`, "error");
      setIsClearingCache(false);
    }
  };

  const settingsTabs = [
    { id: "general", name: "General", icon: Cog6ToothIcon },
    { id: "payment", name: "Payment", icon: CurrencyDollarIcon },
    { id: "email", name: "Email", icon: EnvelopeIcon },
    { id: "media", name: "Media", icon: PhotoIcon },
    { id: "security", name: "Security", icon: ShieldCheckIcon },
    { id: "performance", name: "Performance", icon: ServerIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleClearCache}
            disabled={isClearingCache}
            className="btn-secondary flex items-center"
          >
            <ServerIcon className="h-5 w-5 mr-1" />
            {isClearingCache ? "Clearing Cache..." : "Clear Cache"}
          </button>
          <button type="button" onClick={refetch} className="btn-primary">
            Refresh
          </button>
        </div>
      </div>

      {/* Cache Status */}
      <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cache Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200/50 rounded-lg">
            <div className="flex items-center">
              <ServerIcon className="h-6 w-6 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Redis Cache
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {cacheStatus?.redis_cache?.enabled ? "Enabled" : "Disabled"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {cacheStatus?.redis_cache?.hit_rate || 0}% hit rate
            </p>
          </div>
          <div className="p-4 border border-gray-200/50 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Database Cache
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {cacheStatus?.database_cache?.enabled ? "Enabled" : "Disabled"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {cacheStatus?.database_cache?.entries || 0} entries
            </p>
          </div>
          <div className="p-4 border border-gray-200/50 rounded-lg">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-6 w-6 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Total Hits
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {cacheStatus?.total_hits || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {cacheStatus?.miss_rate || 0}% miss rate
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50">
        <div className="border-b border-gray-200/50">
          <nav className="flex -mb-px space-x-8 px-6" aria-label="Tabs">
            {settingsTabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Failed to load settings</div>
              <button
                type="button"
                onClick={() => refetch()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : (
            <div>
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={siteNameId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Site Name
                      </label>
                      <input
                        id={siteNameId}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.general?.site_name || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "general",
                            "site_name",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={siteDescriptionId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Site Description
                      </label>
                      <textarea
                        id={siteDescriptionId}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.general?.site_description || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "general",
                            "site_description",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={contactEmailId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Email
                      </label>
                      <input
                        id={contactEmailId}
                        type="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.general?.contact_email || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "general",
                            "contact_email",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={adminEmailId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Admin Email
                      </label>
                      <input
                        id={adminEmailId}
                        type="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.general?.admin_email || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "general",
                            "admin_email",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings("general")}
                      disabled={isUpdating}
                      className="btn-primary"
                    >
                      {isUpdating ? "Saving..." : "Save General Settings"}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={paymentGatewayId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Gateway
                      </label>
                      <select
                        id={paymentGatewayId}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.payment?.gateway || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "gateway",
                            e.target.value,
                          )
                        }
                      >
                        <option value="sslcommerz">SSLCOMMERZ</option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={currencyId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Currency
                      </label>
                      <select
                        id={currencyId}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.payment?.currency || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "currency",
                            e.target.value,
                          )
                        }
                      >
                        <option value="BDT">BDT (Bangladeshi Taka)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={taxRateId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tax Rate (%)
                      </label>
                      <input
                        id={taxRateId}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.payment?.tax_rate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "tax_rate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={sandboxModeCheckboxId}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-sm"
                        checked={formData.payment?.sandbox_mode || false}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "sandbox_mode",
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={sandboxModeCheckboxId}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Sandbox Mode
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings("payment")}
                      disabled={isUpdating}
                      className="btn-primary"
                    >
                      {isUpdating ? "Saving..." : "Save Payment Settings"}
                    </button>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={smtpHostId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        SMTP Host
                      </label>
                      <input
                        id={smtpHostId}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.email?.smtp_host || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "email",
                            "smtp_host",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={smtpPortId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        SMTP Port
                      </label>
                      <input
                        id={smtpPortId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.email?.smtp_port || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "email",
                            "smtp_port",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={smtpUsernameId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        SMTP Username
                      </label>
                      <input
                        id={smtpUsernameId}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.email?.smtp_username || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "email",
                            "smtp_username",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={smtpPasswordId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        SMTP Password
                      </label>
                      <input
                        id={smtpPasswordId}
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.email?.smtp_password || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "email",
                            "smtp_password",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={fromEmailId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        From Email
                      </label>
                      <input
                        id={fromEmailId}
                        type="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.email?.from_email || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "email",
                            "from_email",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={fromNameId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        From Name
                      </label>
                      <input
                        id={fromNameId}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.email?.from_name || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "email",
                            "from_name",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings("email")}
                      disabled={isUpdating}
                      className="btn-primary"
                    >
                      {isUpdating ? "Saving..." : "Save Email Settings"}
                    </button>
                  </div>
                </div>
              )}

              {/* Media Settings */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Media Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={storageBackendId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Storage Backend
                      </label>
                      <select
                        id={storageBackendId}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.media?.storage_backend || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "media",
                            "storage_backend",
                            e.target.value,
                          )
                        }
                      >
                        <option value="local">Local Storage</option>
                        <option value="cloudinary">Cloudinary</option>
                        <option value="aws_s3">AWS S3</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={maxUploadSizeId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Max Upload Size (MB)
                      </label>
                      <input
                        id={maxUploadSizeId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.media?.max_upload_size || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "media",
                            "max_upload_size",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={allowedFileTypesId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Allowed File Types
                      </label>
                      <input
                        id={allowedFileTypesId}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.media?.allowed_file_types || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "media",
                            "allowed_file_types",
                            e.target.value,
                          )
                        }
                        placeholder="jpg,png,gif,pdf,doc,docx"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={imageQualityId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Image Quality (%)
                      </label>
                      <input
                        id={imageQualityId}
                        type="number"
                        min="1"
                        max="100"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.media?.image_quality || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "media",
                            "image_quality",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings("media")}
                      disabled={isUpdating}
                      className="btn-primary"
                    >
                      {isUpdating ? "Saving..." : "Save Media Settings"}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Security Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={sessionTimeoutId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Session Timeout (minutes)
                      </label>
                      <input
                        id={sessionTimeoutId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.security?.session_timeout || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "security",
                            "session_timeout",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={passwordMinLengthId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password Minimum Length
                      </label>
                      <input
                        id={passwordMinLengthId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.security?.password_min_length || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "security",
                            "password_min_length",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={requireSpecialCharsCheckboxId}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-sm"
                        checked={
                          formData.security?.require_special_chars || false
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "security",
                            "require_special_chars",
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={requireSpecialCharsCheckboxId}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Require Special Characters in Password
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={twoFactorAuthCheckboxId}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-sm"
                        checked={formData.security?.two_factor_auth || false}
                        onChange={(e) =>
                          handleInputChange(
                            "security",
                            "two_factor_auth",
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={twoFactorAuthCheckboxId}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings("security")}
                      disabled={isUpdating}
                      className="btn-primary"
                    >
                      {isUpdating ? "Saving..." : "Save Security Settings"}
                    </button>
                  </div>
                </div>
              )}

              {/* Performance Settings */}
              {activeTab === "performance" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Performance Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={cacheTimeoutId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cache Timeout (seconds)
                      </label>
                      <input
                        id={cacheTimeoutId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.performance?.cache_timeout || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "performance",
                            "cache_timeout",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={dbConnectionPoolId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Database Connection Pool
                      </label>
                      <input
                        id={dbConnectionPoolId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.performance?.db_connection_pool || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "performance",
                            "db_connection_pool",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={queryTimeoutId}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Query Timeout (seconds)
                      </label>
                      <input
                        id={queryTimeoutId}
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                        value={formData.performance?.query_timeout || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "performance",
                            "query_timeout",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={enableQueryCacheCheckboxId}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-sm"
                        checked={
                          formData.performance?.enable_query_cache || false
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "performance",
                            "enable_query_cache",
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={enableQueryCacheCheckboxId}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Query Cache
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings("performance")}
                      disabled={isUpdating}
                      className="btn-primary"
                    >
                      {isUpdating ? "Saving..." : "Save Performance Settings"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
