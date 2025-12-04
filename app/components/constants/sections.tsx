import { Badge } from "../ui/badge"

export const sections = [
  {
    id: "hero",
    subtitle: (
      <Badge variant="outline" className="text-white border-white">
        Coming Soon
      </Badge>
    ),
    title: "The Future of RegTech is Here.",
    showButton: true,
    buttonText: "Get Early Access",
  },
  {
    id: "about",
    title: "Why Rakimu?",
    content:
      "We leverage cutting-edge AI to transform how financial institutions manage compliance, reduce operational risk, and streamline regulatory processes.",
  },
  {
    id: "features",
    title: "Our Solutions",
    content:
      "Financial Crime Risk Management • AI-Powered QC Optimization • Intelligent Client Onboarding • Regulatory Compliance Automation",
  },
  {
    id: "testimonials",
    title: "Built for Financial Institutions",
    content:
      "Designed by industry experts who understand the complexities of modern financial compliance and the power of AI to solve them.",
  },
  {
    id: "join",
    title: "Be Among the First",
    content:
      "Join our early access program and be the first to experience next-generation RegTech solutions. Full website and product launch coming soon.",
    showButton: true,
    buttonText: "Join Waitlist",
  },
]
