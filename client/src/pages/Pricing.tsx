import React from 'react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '5 introductory lessons',
      'Basic habit tracking (3 habits)',
      'Daily challenges',
      'Community access'
    ],
    cta: 'Get started',
    href: '/signup',
    highlighted: false
  },
  {
    name: 'Premium Monthly',
    price: '$9.99',
    period: '/month',
    features: [
      'All 30+ lessons',
      'Unlimited habit tracking',
      'Advanced daily challenges',
      'Personalized recommendations',
      'Reflection journal',
      'Priority support'
    ],
    cta: 'Subscribe monthly',
    href: '/signup',
    highlighted: true
  },
  {
    name: 'Premium Yearly',
    price: '$79.99',
    period: '/year',
    features: [
      'Everything in Monthly',
      'Save 33% vs monthly',
      'Exclusive yearly content',
      'Annual progress report'
    ],
    cta: 'Subscribe yearly',
    href: '/signup',
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-buildmode-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <span className="text-2xl">🔧</span>
            <span className="font-semibold text-buildmode-800">Build Mode</span>
          </Link>
          <h1 className="text-3xl font-bold text-buildmode-900">Choose Your Path</h1>
          <p className="text-gray-600 mt-2">Invest in yourself. Start for free, upgrade when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.name} className={`card flex flex-col ${plan.highlighted ? 'ring-2 ring-buildmode-500 shadow-lg relative' : ''}`}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-buildmode-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
              <div className="mt-3">
                <span className="text-4xl font-bold text-buildmode-900">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-buildmode-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.href}
                className={`mt-8 block text-center py-2.5 rounded-lg font-medium transition-all ${
                  plan.highlighted ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account? <Link to="/signin" className="text-buildmode-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}