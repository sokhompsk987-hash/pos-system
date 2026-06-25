import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../util/request'; 
import Layout from './Layout.jsx';

export default function FeatureGuard({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check subscription status from API when accessing protected routes
    request('subscriptions/current', 'GET')
      .then(res => {
        // DEVELOPMENT UNLOCK: Always authorize so we can continue working!



        
        setIsAuthorized(true); 
        


        // NOTE: Keep the actual logic commented out until the backend is fully ready
        /*
        if (res?.data?.status === 'active') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
        */
      })
      .catch(err => {
        console.error("Authorization check failed:", err);
        // DEVELOPMENT UNLOCK: Allow access even if the API request fails
        setIsAuthorized(true); 
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Display a loading state while checking the subscription
  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[calc(100vh-89px)] items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
            <p className="font-bold">Checking access rights...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authorized, block the content and show the lock screen
  if (!isAuthorized) {
    return (
      <Layout>
        <div className="flex h-[calc(100vh-89px)] items-center justify-center bg-slate-50 p-6">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full animate-fadeIn">
            <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">lock</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Feature Locked</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Your current subscription plan has expired or does not include access to this module.
            </p>
            <Link 
              to="/subscription" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-600/20 transition-all"
            >
              View Subscription Plans
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // If authorized, render the actual page content normally
  return children;
}