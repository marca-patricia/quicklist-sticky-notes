import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ArrowRight, ArrowLeft, Lightbulb, Target, Star } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  position?: 'center' | 'top' | 'bottom';
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onSkip }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      icon: Lightbulb,
      position: 'center'
    },
    {
      id: 'create-lists',
      title: t('onboarding.createLists.title'),
      description: t('onboarding.createLists.description'),
      icon: Target,
      position: 'center'
    },
    {
      id: 'features',
      title: t('onboarding.features.title'),
      description: t('onboarding.features.description'),
      icon: Star,
      position: 'center'
    }
  ];

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">{currentStepData.description}</p>
          
          <div className="flex justify-between gap-3">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="flex-1"
            >
              {t('onboarding.skip')}
            </Button>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {isLastStep ? t('onboarding.getStarted') : t('onboarding.next')}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};