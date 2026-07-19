'use client';

import { HeroSection } from '@/components/sentinel/hero-section';
import { BriefSection } from '@/components/sentinel/brief-section';
import { MemoryCardsSection } from '@/components/sentinel/memory-cards-section';
import { TimelineSection } from '@/components/sentinel/timeline-section';
import { HeatmapSection } from '@/components/sentinel/heatmap-section';
import { ForgetCurveSection } from '@/components/sentinel/forget-curve-section';
import { RecommendationsSection } from '@/components/sentinel/recommendations-section';
import { InsightsSection } from '@/components/sentinel/insights-section';
import { PrivacySection } from '@/components/sentinel/privacy-section';

export default function SentinelPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0C]">
      <HeroSection />
      <BriefSection />
      <MemoryCardsSection />
      <TimelineSection />
      <HeatmapSection />
      <ForgetCurveSection />
      <RecommendationsSection />
      <InsightsSection />
      <PrivacySection />
    </main>
  );
}