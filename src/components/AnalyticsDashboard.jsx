// AnalyticsDashboard.jsx - Optimized with React.memo and useMemo
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { memo, useCallback, useMemo, useState } from "react";
import {
  useGetEmailStatsQuery,
  useGetPaymentAnalyticsQuery,
  useGetPopularSearchesQuery,
  useGetSearchAnalyticsQuery,
  useGetSentimentStatsQuery,
} from "../store/extendedApiSlice";

// Memoized formatters for O(1) performance
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(2)}%`;
};

// Memoized analytics tabs configuration
const analyticsTabs = [
  { id: "overview", name: "Overview", icon: ChartBarIcon },
  { id: "revenue", name: "Revenue", icon: CurrencyDollarIcon },
  { id: "search", name: "Search", icon: MagnifyingGlassIcon },
  { id: "engagement", name: "Engagement", icon: StarIcon },
  { id: "email", name: "Email", icon: EnvelopeIcon },
];

const AnalyticsDashboard = memo(() => {
  const [dateRange, setDateRange] = useState("30");
  const [activeTab, setActiveTab] = useState("overview");

  // Memoized query parameters to prevent unnecessary re-renders
  const queryParams = useMemo(() => ({ days: dateRange }), [dateRange]);
  const popularSearchParams = useMemo(() => ({ limit: 10 }), []);

  // Fetch analytics data with memoized parameters
  const { data: paymentAnalytics, isLoading: paymentLoading } =
    useGetPaymentAnalyticsQuery(queryParams);
  const { data: searchAnalytics, isLoading: searchLoading } =
    useGetSearchAnalyticsQuery(queryParams);
  const { data: emailStats, isLoading: emailLoading } =
    useGetEmailStatsQuery(queryParams);
  const { data: sentimentStats, isLoading: sentimentLoading } =
    useGetSentimentStatsQuery();
  const { data: popularSearches, isLoading: popularSearchesLoading } =
    useGetPopularSearchesQuery(popularSearchParams);

  // Memoized loading state
  const isLoading = useMemo(
    () =>
      paymentLoading ||
      searchLoading ||
      emailLoading ||
      sentimentLoading ||
      popularSearchesLoading,
    [
      paymentLoading,
      searchLoading,
      emailLoading,
      sentimentLoading,
      popularSearchesLoading,
    ],
  );

  // Memoized callbacks to prevent child re-renders
  const handleDateRangeChange = useCallback((e) => {
    setDateRange(e.target.value);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Memoized tab renderer
  const renderTabButton = useCallback(
    (tab) => (
      <button
        type="button"
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`${
          activeTab === tab.id
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
      >
        <tab.icon className="h-5 w-5 mr-2" />
        {tab.name}
      </button>
    ),
    [activeTab, handleTabChange],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="px-3 py-1 border border-gray-300/50 rounded-md bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {analyticsTabs.map(renderTabButton)}
        </nav>
      </div>

      {/* Tab Content */}
      <TabContent
        activeTab={activeTab}
        paymentAnalytics={paymentAnalytics}
        searchAnalytics={searchAnalytics}
        emailStats={emailStats}
        sentimentStats={sentimentStats}
        popularSearches={popularSearches}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />
    </div>
  );
});

// Memoized tab content component
const TabContent = memo(
  ({
    activeTab,
    paymentAnalytics,
    searchAnalytics,
    emailStats,
    sentimentStats,
    popularSearches,
    formatCurrency,
    formatPercentage,
  }) => {
    const content = useMemo(() => {
      switch (activeTab) {
        case "overview":
          return (
            <OverviewTab
              {...{
                paymentAnalytics,
                searchAnalytics,
                emailStats,
                formatCurrency,
              }}
            />
          );
        case "revenue":
          return <RevenueTab {...{ paymentAnalytics, formatCurrency }} />;
        case "search":
          return <SearchTab {...{ searchAnalytics, popularSearches }} />;
        case "engagement":
          return <EngagementTab {...{ sentimentStats, formatPercentage }} />;
        case "email":
          return <EmailTab {...{ emailStats, formatPercentage }} />;
        default:
          return (
            <OverviewTab
              {...{
                paymentAnalytics,
                searchAnalytics,
                emailStats,
                formatCurrency,
              }}
            />
          );
      }
    }, [
      activeTab,
      paymentAnalytics,
      searchAnalytics,
      emailStats,
      sentimentStats,
      popularSearches,
      formatCurrency,
      formatPercentage,
    ]);

    return content;
  },
);

// Memoized tab components
const OverviewTab = memo(
  ({ paymentAnalytics, searchAnalytics, emailStats, formatCurrency }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(paymentAnalytics?.total_revenue || 0)}
        icon={CurrencyDollarIcon}
        trend={paymentAnalytics?.revenue_growth || 0}
      />
      <MetricCard
        title="Total Searches"
        value={searchAnalytics?.total_searches || 0}
        icon={MagnifyingGlassIcon}
        trend={searchAnalytics?.search_growth || 0}
      />
      <MetricCard
        title="Email Open Rate"
        value={`${(emailStats?.open_rate || 0).toFixed(1)}%`}
        icon={EnvelopeIcon}
        trend={emailStats?.open_rate_change || 0}
      />
      <MetricCard
        title="Avg Response Time"
        value={`${(emailStats?.avg_response_time || 0).toFixed(1)}h`}
        icon={ArrowTrendingUpIcon}
        trend={-(emailStats?.response_time_change || 0)}
      />
    </div>
  ),
);

const RevenueTab = memo(({ paymentAnalytics, formatCurrency }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(paymentAnalytics?.total_revenue || 0)}
        icon={CurrencyDollarIcon}
      />
      <MetricCard
        title="Successful Payments"
        value={paymentAnalytics?.successful_payments || 0}
        icon={ChartBarIcon}
      />
      <MetricCard
        title="Failed Payments"
        value={paymentAnalytics?.failed_payments || 0}
        icon={ChartBarIcon}
      />
    </div>
  </div>
));

const SearchTab = memo(({ searchAnalytics, popularSearches }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Search Statistics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Searches:</span>
            <span className="font-semibold">
              {searchAnalytics?.total_searches || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Unique Searches:</span>
            <span className="font-semibold">
              {searchAnalytics?.unique_searches || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Popular Searches</h3>
        <div className="space-y-2">
          {popularSearches?.map((search) => (
            <div key={search.query} className="flex justify-between">
              <span className="truncate">{search.query}</span>
              <span className="font-semibold">{search.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const EngagementTab = memo(({ sentimentStats, formatPercentage }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Positive Sentiment"
        value={formatPercentage(sentimentStats?.positive_percentage || 0)}
        icon={StarIcon}
      />
      <MetricCard
        title="Neutral Sentiment"
        value={formatPercentage(sentimentStats?.neutral_percentage || 0)}
        icon={StarIcon}
      />
      <MetricCard
        title="Negative Sentiment"
        value={formatPercentage(sentimentStats?.negative_percentage || 0)}
        icon={StarIcon}
      />
    </div>
  </div>
));

const EmailTab = memo(({ emailStats, formatPercentage }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Open Rate"
        value={formatPercentage(emailStats?.open_rate || 0)}
        icon={EnvelopeIcon}
      />
      <MetricCard
        title="Click Rate"
        value={formatPercentage(emailStats?.click_rate || 0)}
        icon={EnvelopeIcon}
      />
    </div>
  </div>
));

// Memoized metric card component
const MetricCard = memo(({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Icon className="h-8 w-8 text-primary-600" />
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">
            {title}
          </dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            {trend !== undefined && (
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </div>
            )}
          </dd>
        </dl>
      </div>
    </div>
  </div>
));

AnalyticsDashboard.displayName = "AnalyticsDashboard";
TabContent.displayName = "TabContent";
OverviewTab.displayName = "OverviewTab";
RevenueTab.displayName = "RevenueTab";
SearchTab.displayName = "SearchTab";
EngagementTab.displayName = "EngagementTab";
EmailTab.displayName = "EmailTab";
MetricCard.displayName = "MetricCard";

export default AnalyticsDashboard;
