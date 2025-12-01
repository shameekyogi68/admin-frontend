/**
 * Frontend Models/Types for User, Subscription, and Plan data
 * These define the expected shape of data from backend APIs
 */

/**
 * User/Customer Model
 * Maps from MongoDB User collection (_id, user_id, phone, name, gender, address, isOnline, subscription, etc.)
 */
export const UserModel = {
  id: String,           // MongoDB _id
  user_id: Number,      // user_id field from backend
  phone: String,
  name: String,
  gender: String,
  address: String,
  isOnline: Boolean,
  subscription: String, // Reference to subscription _id
  createdAt: String,
  updatedAt: String,
  __v: Number
};

/**
 * Customer Model (Admin Panel specific)
 * Used in Customer.jsx - represents customer in admin database
 */
export const CustomerModel = {
  _id: String,
  customerId: String,
  name: String,
  email: String,
  phone: String,
  currentPack: String,           // Current plan name
  status: String,                // 'Active', 'Expired', 'Pending'
  expiryDate: String,            // ISO date string
  isBlocked: Boolean,
  createdAt: String,
  updatedAt: String
};

/**
 * Subscription Model
 * Represents a customer's subscription to a plan
 * Structure from your backend: { _id, userId, planId, currentPack, price, expiryDate, status, startDate }
 */
export const SubscriptionModel = {
  _id: String,                   // Subscription record ID
  userId: Number,                // Reference to user_id in User model
  planId: String,                // Reference to Plan._id
  currentPack: String,           // Plan name (for quick reference)
  price: Number,                 // Current subscription price
  expiryDate: String,            // ISO date string
  status: String,                // 'Active', 'Expired', 'Pending'
  startDate: String,             // ISO date string
  createdAt: String,
  updatedAt: String,
  __v: Number,
  // Optional: enriched data from plan
  planDetails: {}                // Plan object (if populated from service)
};

/**
 * Plan Model
 * Represents a subscription plan available for purchase
 * Structure: { _id, name, price, duration, features, planType, createdAt, updatedAt }
 */
export const PlanModel = {
  _id: String,                   // Plan ID
  name: String,                  // Plan name (e.g., "D BOSS Jail Plan")
  price: Number,                 // Price in base currency
  duration: String,              // Duration (e.g., "3 Months")
  features: [String],            // Array of features
  planType: String,              // 'customer' or 'vendor'
  active: Boolean,               // Is plan active for new subscriptions
  createdAt: String,
  updatedAt: String,
  __v: Number
};

/**
 * Enriched Subscription (for display purposes)
 * Combines subscription data with plan details for UI rendering
 */
export const EnrichedSubscriptionModel = {
  ...SubscriptionModel,
  planDetails: PlanModel
};

/**
 * Data Mapping Utilities
 * Helper functions to map backend responses to frontend models
 */

export const mapUserToCustomer = (backendUser) => {
  return {
    _id: backendUser._id,
    name: backendUser.name,
    phone: backendUser.phone,
    email: backendUser.email || '',
    customerId: backendUser.user_id,
    currentPack: backendUser.subscription?.currentPack || '',
    status: backendUser.subscription?.status || 'Pending',
    expiryDate: backendUser.subscription?.expiryDate || '',
    isBlocked: backendUser.isBlocked || false
  };
};

export const mapSubscriptionResponse = (backendSubscription) => {
  return {
    _id: backendSubscription._id,
    userId: backendSubscription.userId,
    planId: backendSubscription.planId,
    currentPack: backendSubscription.currentPack,
    price: backendSubscription.price,
    expiryDate: backendSubscription.expiryDate,
    status: backendSubscription.status,
    startDate: backendSubscription.startDate,
    createdAt: backendSubscription.createdAt,
    updatedAt: backendSubscription.updatedAt
  };
};

export const mapPlanResponse = (backendPlan) => {
  return {
    _id: backendPlan._id,
    name: backendPlan.name,
    price: backendPlan.price,
    duration: backendPlan.duration,
    features: backendPlan.features || [],
    planType: backendPlan.planType,
    active: backendPlan.active !== false,
    createdAt: backendPlan.createdAt,
    updatedAt: backendPlan.updatedAt
  };
};

export default {
  UserModel,
  CustomerModel,
  SubscriptionModel,
  PlanModel,
  EnrichedSubscriptionModel,
  mapUserToCustomer,
  mapSubscriptionResponse,
  mapPlanResponse
};
