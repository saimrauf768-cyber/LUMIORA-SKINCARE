import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, X, Check, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SkinQuizModal: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen, products, addToCart, setIsCartOpen } = useStore();

  const [step, setStep] = useState<number>(1);
  const [skinType, setSkinType] = useState<string>('');
  const [concern, setConcern] = useState<string>('');
  const [routineDepth, setRoutineDepth] = useState<string>('');
  const [recommendationResult, setRecommendationResult] = useState<{
    title: string;
    description: string;
    productIds: string[];
  } | null>(null);

  if (!isQuizOpen) return null;

  const handleFinishQuiz = (finalDepth: string) => {
    setRoutineDepth(finalDepth);

    // Diagnostic logic
    let rec = {
      title: 'The Haute Glow Radiance Ritual',
      description: 'Engineered with stabilized 15% Vitamin C and Ceramide Soufflé to restore barrier health and illuminate pigmentation.',
      productIds: ['prod-1', 'prod-4']
    };

    if (concern === 'pores' || skinType === 'oily') {
      rec = {
        title: 'The Pore Refinement & Clarifying Protocol',
        description: 'Combines 10% Niacinamide with Gentle Foaming Cleanser and Invisible SPF 50 for all-day matte clarity.',
        productIds: ['prod-3', 'prod-5', 'prod-6']
      };
    } else if (concern === 'hydration' || skinType === 'dry') {
      rec = {
        title: 'The Deep Multi-Molecular Hydration Sanctuary',
        description: 'Multi-layer Hyaluronic Acid paired with Rose Glow Distillate and Luxury Moisturizing Cream for 72-hour dermal plumping.',
        productIds: ['prod-2', 'prod-7', 'prod-4']
      };
    } else if (finalDepth === 'complete' || concern === 'anti-aging') {
      rec = {
        title: 'The Master Complete Glow 4-Piece Protocol',
        description: 'The definitive clinical day-to-night transformation system packed with Bakuchiol, Vitamin C, and broad-spectrum sunscreen.',
        productIds: ['prod-9']
      };
    }

    setRecommendationResult(rec);
    setStep(4);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E8C5B8', '#FAF7F2']
      });
    } catch {
      // ignore
    }
  };

  const handleAddAllToCart = () => {
    if (!recommendationResult) return;
    recommendationResult.productIds.forEach((id) => {
      const match = products.find((p) => p.id === id);
      if (match) addToCart(match, 1);
    });
    setIsQuizOpen(false);
    setIsCartOpen(true);
  };

  const resetQuiz = () => {
    setStep(1);
    setSkinType('');
    setConcern('');
    setRoutineDepth('');
    setRecommendationResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={() => { setIsQuizOpen(false); resetQuiz(); }}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-900 rounded-full"
          aria-label="Close diagnostic quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Stepper Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Diagnostic Skin Concierge {step <= 3 ? `• Step ${step} of 3` : '• Protocol Analysis'}</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-stone-900 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: SKIN TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-light text-stone-900">How would you describe your skin profile?</h3>
              <p className="text-xs text-stone-500 mt-1">This helps us gauge lipid barrier sensitivity and sebum dynamics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'combination', title: 'Combination', desc: 'Oily T-zone, normal to dry cheeks' },
                { id: 'oily', title: 'Oily / Shine-Prone', desc: 'Frequent shine, dilated pores in humidity' },
                { id: 'dry', title: 'Dry / Dehydrated', desc: 'Tight sensation, rough or flaky patches' },
                { id: 'sensitive', title: 'Reactive / Delicate', desc: 'Prone to stinging, redness, allergy' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setSkinType(opt.id); setStep(2); }}
                  className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-900 hover:shadow-md text-left transition-all group"
                >
                  <p className="text-sm font-semibold text-stone-900 group-hover:text-amber-800">{opt.title}</p>
                  <p className="text-xs text-stone-500 mt-1 font-light">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: MAIN CONCERN */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-light text-stone-900">What is your primary skincare target?</h3>
              <p className="text-xs text-stone-500 mt-1">Select the concern you wish to address within 14 to 21 days.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'pigmentation', title: 'Glow & Hyperpigmentation', desc: 'Fade sunspots, tanning, dark acne marks' },
                { id: 'pores', title: 'Pores & Sebum Balance', desc: 'Minimize blackheads and excessive oiliness' },
                { id: 'hydration', title: 'Deep Barrier Hydration', desc: 'Plump skin and relieve burning/dryness' },
                { id: 'anti-aging', title: 'Fine Lines & Elasticity', desc: 'Firm skin with Bakuchiol & Peptides' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setConcern(opt.id); setStep(3); }}
                  className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-900 hover:shadow-md text-left transition-all group"
                >
                  <p className="text-sm font-semibold text-stone-900 group-hover:text-amber-800">{opt.title}</p>
                  <p className="text-xs text-stone-500 mt-1 font-light">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: ROUTINE DEPTH */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-light text-stone-900">Choose your desired routine complexity:</h3>
              <p className="text-xs text-stone-500 mt-1">Whether you prefer streamlined essentials or an immersive luxury vanity protocol.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'essential', title: 'The Targeted Duo (Fast & Efficient)', desc: 'Focus on 1 active serum + 1 barrier recovery cream.' },
                { id: 'complete', title: 'The Complete 4-Step Master Protocol (Recommended)', desc: 'Full routine: Cleanser + Active Serum + Soufflé Cream + SPF 50 shield.' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFinishQuiz(opt.id)}
                  className="w-full p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-900 hover:shadow-md text-left transition-all group"
                >
                  <p className="text-sm font-semibold text-stone-900 group-hover:text-amber-800">{opt.title}</p>
                  <p className="text-xs text-stone-500 mt-1 font-light">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: RECOMMENDATION RESULT */}
        {step === 4 && recommendationResult && (
          <div className="space-y-6 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Custom Clinical Prescription
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 mt-2">
                {recommendationResult.title}
              </h3>
              <p className="text-xs text-stone-600 font-light mt-2 leading-relaxed">
                {recommendationResult.description}
              </p>
            </div>

            {/* Prescribed Products Grid */}
            <div className="space-y-3">
              {recommendationResult.productIds.map((id) => {
                const prod = products.find((p) => p.id === id);
                if (!prod) return null;
                return (
                  <div key={prod.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                    <img src={prod.image} alt={prod.name} className="w-14 h-14 object-cover rounded-lg bg-stone-100" />
                    <div className="flex-1 text-left">
                      <p className="text-xs uppercase tracking-wider text-amber-800 font-semibold">{prod.category}</p>
                      <h4 className="text-sm font-medium text-stone-900">{prod.name}</h4>
                      <p className="text-xs font-bold text-stone-900 mt-0.5">Rs. {prod.price.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddAllToCart}
                className="flex-1 py-3.5 bg-[#1A1815] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Recommended Routine to Bag</span>
              </button>

              <button
                onClick={resetQuiz}
                className="px-4 py-3.5 border border-stone-300 text-stone-700 rounded-lg text-xs uppercase font-medium hover:bg-stone-100"
              >
                Retake Quiz
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
