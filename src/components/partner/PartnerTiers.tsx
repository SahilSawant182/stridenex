import React from 'react';
import { motion } from 'framer-motion';

export default function PartnerTiers() {
  const tiers = [
    {
      name: "Base Partner",
      target: "Consultants, Coaches, Mentors",
      price: "Free",
      features: [
        "Partner profile on marketplace",
        "White-label referral link",
        "Basic analytics dashboard",
        "Marketing assets & community access"
      ],
      revenue: "5% referral commission, 10% on mentorship",
      buttonText: "Join for Free",
      popular: false,
      color: "blue"
    },
    {
      name: "Growth Partner",
      target: "Training Centers, Faculty",
      price: "Custom",
      features: [
        "White-label portal",
        "Bulk student import",
        "Dedicated support & co-marketing",
        "Advanced analytics & custom pathways"
      ],
      revenue: "8-12% commission, 5-8% revenue share",
      buttonText: "Apply Now",
      popular: true,
      color: "indigo"
    },
    {
      name: "Scale Partner",
      target: "Large Networks, Gov Bodies",
      price: "Enterprise",
      features: [
        "Custom integration & APIs",
        "Dedicated account manager",
        "White-label mobile app option",
        "Priority feature requests"
      ],
      revenue: "10-15% commission, 8-12% revenue share",
      buttonText: "Contact Sales",
      popular: false,
      color: "purple"
    },
    {
      name: "Anchor Partner",
      target: "Mega Networks, Industry",
      price: "Strategic",
      features: [
        "Strategic executive alignment",
        "Exclusive territories",
        "Co-create certification programs",
        "Custom SLA & dedicated team"
      ],
      revenue: "12-20% commission, 20-30% on co-creation",
      buttonText: "Contact Partnerships",
      popular: false,
      color: "rose"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="partner-tiers">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Partner Tiers Architecture</h2>
            <p className="text-xl text-gray-600 font-light">
              Whether you are an independent consultant or a national industry body, we have a tier designed for your scale.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative bg-white rounded-2xl ${tier.popular ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/20 transform md:-translate-y-2' : 'border border-gray-100 shadow-md shadow-gray-200/40'} p-6 flex flex-col transition-all hover:shadow-lg group`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="mb-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1.5">{tier.name}</h3>
                <p className="text-xs font-medium text-gray-500 bg-gray-50 inline-block px-2.5 py-1 rounded-full">{tier.target}</p>
              </div>
              
              <div className="mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{tier.price}</span>
                </div>
              </div>
              
              <div className="mb-5 flex-grow">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Features</h4>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`material-symbols-outlined text-${tier.popular ? 'indigo' : 'blue'}-500 text-[16px] mr-2 mt-0.5`}>check_circle</span>
                      <span className="text-gray-700 text-[13px] font-medium leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Revenue Share</h4>
                <p className="text-[13px] font-bold text-gray-800">{tier.revenue}</p>
              </div>
              
              <button className={`w-full py-2.5 px-4 text-sm rounded-xl font-bold transition-all ${tier.popular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md hover:shadow-indigo-500/30' : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                {tier.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
