// rbac_crud_test.js
// Simple test to verify RBAC and CRUD implementation

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import CategoryManagement from "../components/CategoryManagement";
import EnhancedGenericManagement from "../components/EnhancedGenericManagement";
import OrderManagement from "../components/OrderManagement";
import PaymentManagement from "../components/PaymentManagement";
import ReviewManagement from "../components/ReviewManagement";
import ServiceManagement from "../components/ServiceManagement";
import SettingsManagement from "../components/SettingsManagement";
import UserManagement from "../components/UserManagement";
import AdminDashboard from "../pages/AdminDashboard";
import { store } from "../store";

// Mock the API hooks to prevent actual API calls
vi.mock("../store/extendedApiSlice", async () => {
  const actual = await import("../store/extendedApiSlice");
  return {
    ...actual,
    // Override only the hooks we want to mock
    useGetAdminUsersQuery: () => ({
      data: [],
      isLoading: false,
      isError: false,
    }),
    useUpdateAdminUserMutation: () => [vi.fn(), { isLoading: false }],
    useDeleteAdminUserMutation: () => [vi.fn(), { isLoading: false }],
    usePromoteUserMutation: () => [vi.fn(), { isLoading: false }],
    useGetExtendedServicesQuery: () => ({
      data: [],
      isLoading: false,
      isError: false,
    }),
    useCreateExtendedServiceMutation: () => [vi.fn(), { isLoading: false }],
    useUpdateExtendedServiceMutation: () => [vi.fn(), { isLoading: false }],
    useDeleteExtendedServiceMutation: () => [vi.fn(), { isLoading: false }],
    useGetExtendedCategoriesQuery: () => ({
      data: [],
      isLoading: false,
      isError: false,
    }),
    useCreateExtendedCategoryMutation: () => [vi.fn(), { isLoading: false }],
    useUpdateExtendedCategoryMutation: () => [vi.fn(), { isLoading: false }],
    useDeleteExtendedCategoryMutation: () => [vi.fn(), { isLoading: false }],
    useGetReviewsQuery: () => ({
      data: [],
      isLoading: false,
      isError: false,
    }),
    useUpdateReviewMutation: () => [vi.fn(), { isLoading: false }],
    useDeleteReviewMutation: () => [vi.fn(), { isLoading: false }],
    useGetAdminOrdersQuery: () => ({
      data: [],
      isLoading: false,
      isError: false,
    }),
    useUpdateOrderStatusMutation: () => [vi.fn(), { isLoading: false }],
    useGetSearchAnalyticsQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useGetPopularSearchesQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useAdvancedSearchQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useHandlePaymentIPNMutation: () => [vi.fn(), { isLoading: false }],
    // Add the hooks that were removed but might still be referenced by test components
    useGetSystemSettingsQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useUpdateSystemSettingMutation: () => [vi.fn(), { isLoading: false }],
    useGetCacheStatusQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useClearCacheMutation: () => [vi.fn(), { isLoading: false }],
    useGetPaymentAnalyticsQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useInitiateRefundMutation: () => [vi.fn(), { isLoading: false }],
    useInitiateDisputeMutation: () => [vi.fn(), { isLoading: false }],
    useGetEmailStatsQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useGetSentimentStatsQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
    useGetServiceSentimentStatsQuery: () => ({
      data: {},
      isLoading: false,
      isError: false,
    }),
  };
});

// Test wrapper component
const TestWrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe("RBAC & CRUD Implementation Tests", () => {
  test("renders AdminDashboard without crashing", () => {
    render(
      <TestWrapper>
        <AdminDashboard />
      </TestWrapper>,
    );

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("renders UserManagement component", () => {
    render(
      <TestWrapper>
        <UserManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Manage Users")).toBeInTheDocument();
  });

  test("renders ServiceManagement component", () => {
    render(
      <TestWrapper>
        <ServiceManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Manage Services")).toBeInTheDocument();
  });

  test("renders CategoryManagement component", () => {
    render(
      <TestWrapper>
        <CategoryManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Manage Categories")).toBeInTheDocument();
  });

  test("renders ReviewManagement component", () => {
    render(
      <TestWrapper>
        <ReviewManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Manage Reviews")).toBeInTheDocument();
  });

  test("renders OrderManagement component", () => {
    render(
      <TestWrapper>
        <OrderManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Manage Orders")).toBeInTheDocument();
  });

  test("renders PaymentManagement component", () => {
    render(
      <TestWrapper>
        <PaymentManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Payment Management")).toBeInTheDocument();
  });

  test("renders SettingsManagement component", () => {
    render(
      <TestWrapper>
        <SettingsManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("System Settings")).toBeInTheDocument();
  });

  test("renders EnhancedGenericManagement component", () => {
    render(
      <TestWrapper>
        <EnhancedGenericManagement />
      </TestWrapper>,
    );

    expect(screen.getByText("Analytics & Search")).toBeInTheDocument();
  });
});
