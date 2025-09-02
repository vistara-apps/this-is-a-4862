import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { User, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription, plans } = useSubscription();
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'preferences' | 'security'>('profile');

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="card p-8 text-center">
          <User className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-text-primary mb-2">Not Signed In</h2>
          <p className="text-dark-text-secondary mb-6">
            Please sign in to view and manage your profile.
          </p>
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  // Get current subscription plan
  const currentPlan = plans.find(plan => plan.tier === (subscription?.tier || 'free'));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-dark-text-primary mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 p-3 rounded-md text-left ${
                  activeTab === 'profile'
                    ? 'bg-dark-surface text-dark-accent'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center space-x-2 p-3 rounded-md text-left ${
                  activeTab === 'subscription'
                    ? 'bg-dark-surface text-dark-accent'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Subscription</span>
              </button>
              
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center space-x-2 p-3 rounded-md text-left ${
                  activeTab === 'preferences'
                    ? 'bg-dark-surface text-dark-accent'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Preferences</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-2 p-3 rounded-md text-left ${
                  activeTab === 'security'
                    ? 'bg-dark-surface text-dark-accent'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-dark-border">
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 p-3 rounded-md text-left w-full text-red-400 hover:bg-dark-surface"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-dark-text-primary mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    className="input-field bg-dark-surface"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your display name"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Trading Experience
                  </label>
                  <select className="input-field">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-dark-text-primary mb-6">Current Subscription</h2>
                
                <div className="p-4 bg-dark-surface rounded-lg border border-dark-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-dark-text-primary text-lg">
                        {currentPlan?.name || 'Free'} Plan
                      </h3>
                      
                      <p className="text-dark-text-secondary mt-1">
                        {currentPlan?.description || 'Basic calculations for casual traders'}
                      </p>
                      
                      {subscription && subscription.tier !== 'free' && (
                        <div className="mt-2">
                          <div className="text-sm text-dark-text-secondary">
                            Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </div>
                          
                          {subscription.cancelAtPeriodEnd && (
                            <div className="text-sm text-yellow-400 mt-1">
                              Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-dark-text-primary">
                        ${currentPlan?.price || 0}
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        per {currentPlan?.interval || 'month'}
                      </div>
                    </div>
                  </div>
                  
                  {subscription && subscription.tier !== 'free' && (
                    <div className="mt-4 pt-4 border-t border-dark-border flex justify-end space-x-3">
                      {subscription.cancelAtPeriodEnd ? (
                        <button className="btn-primary">
                          Renew Subscription
                        </button>
                      ) : (
                        <button className="btn-secondary text-red-400">
                          Cancel Subscription
                        </button>
                      )}
                      
                      <button className="btn-primary">
                        Manage Payment Methods
                      </button>
                    </div>
                  )}
                </div>
                
                {currentPlan?.tier !== 'premium' && (
                  <div className="mt-6">
                    <h3 className="font-medium text-dark-text-primary mb-3">Upgrade Your Plan</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plans
                        .filter(plan => plan.tier !== currentPlan?.tier && plan.tier !== 'free')
                        .map(plan => (
                          <div key={plan.id} className="p-4 bg-dark-surface rounded-lg border border-dark-border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-dark-text-primary">{plan.name} Plan</h4>
                                <p className="text-sm text-dark-text-secondary mt-1">{plan.description}</p>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-dark-text-primary">${plan.price}</div>
                                <div className="text-xs text-dark-text-secondary">per {plan.interval}</div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <button className="btn-primary w-full">
                                Upgrade to {plan.name}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="card">
                <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Billing History</h2>
                
                {subscription && subscription.tier !== 'free' ? (
                  <div className="border border-dark-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-dark-surface">
                          <th className="py-3 px-4 text-left text-dark-text-secondary font-medium">Date</th>
                          <th className="py-3 px-4 text-left text-dark-text-secondary font-medium">Description</th>
                          <th className="py-3 px-4 text-left text-dark-text-secondary font-medium">Amount</th>
                          <th className="py-3 px-4 text-left text-dark-text-secondary font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-dark-border">
                          <td className="py-3 px-4 text-dark-text-primary">
                            {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-dark-text-primary">
                            {currentPlan?.name} Plan Subscription
                          </td>
                          <td className="py-3 px-4 text-dark-text-primary">
                            ${currentPlan?.price}.00
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">
                              Paid
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-dark-text-secondary">
                    No billing history available
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-dark-text-primary mb-6">Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-dark-text-primary mb-3">Default Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                        Default Risk Per Trade (%)
                      </label>
                      <input
                        type="number"
                        placeholder="2"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                        Default Leverage
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                        Default Account Balance
                      </label>
                      <input
                        type="number"
                        placeholder="10000"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-dark-text-primary mb-3">Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-dark-text-primary">Email Notifications</div>
                        <div className="text-sm text-dark-text-secondary">Receive updates and alerts via email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-dark-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-accent"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-dark-text-primary">Risk Alerts</div>
                        <div className="text-sm text-dark-text-secondary">Get notified when your risk levels are high</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-dark-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-accent"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-dark-text-primary">Market Updates</div>
                        <div className="text-sm text-dark-text-secondary">Receive updates about market conditions</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-dark-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-accent"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-dark-text-primary mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-dark-text-primary mb-3">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <button className="btn-primary">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-dark-border">
                  <h3 className="font-medium text-dark-text-primary mb-3">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-dark-text-primary">Enable 2FA</div>
                      <div className="text-sm text-dark-text-secondary">Add an extra layer of security to your account</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-accent"></div>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-dark-border">
                  <h3 className="font-medium text-dark-text-primary mb-3">Sessions</h3>
                  
                  <div className="p-4 bg-dark-surface rounded-lg border border-dark-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-dark-text-primary">Current Session</div>
                        <div className="text-sm text-dark-text-secondary">
                          Started: {new Date().toLocaleString()}
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <button className="btn-secondary text-red-400 text-sm">
                      Sign Out All Other Sessions
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-dark-border">
                  <h3 className="font-medium text-red-400 mb-3">Danger Zone</h3>
                  
                  <button className="btn-secondary border-red-400 text-red-400 hover:bg-red-400/10">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

