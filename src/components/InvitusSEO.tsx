import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface SEOCheck {
  name: string;
  passed: boolean;
  message: string;
}

interface InvitusSEOProps {
  title: string;
  content: string;
  excerpt: string;
  initialSeoTitle?: string;
  initialSeoDescription?: string;
  initialFocusKeyword?: string;
  onSeoChange?: (seoData: { seoTitle: string; seoDescription: string; focusKeyword: string }) => void;
}

const InvitusSEO = ({ 
  title, 
  content, 
  excerpt,
  initialSeoTitle = "",
  initialSeoDescription = "",
  initialFocusKeyword = "",
  onSeoChange,
}: InvitusSEOProps) => {
  const [focusKeyword, setFocusKeyword] = useState(initialFocusKeyword);
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [metaDescription, setMetaDescription] = useState(initialSeoDescription);
  const [checks, setChecks] = useState<SEOCheck[]>([]);
  const [score, setScore] = useState(0);

  // Sync with initial values when editing
  useEffect(() => {
    if (initialFocusKeyword) setFocusKeyword(initialFocusKeyword);
    if (initialSeoTitle) setSeoTitle(initialSeoTitle);
    if (initialSeoDescription) setMetaDescription(initialSeoDescription);
  }, [initialFocusKeyword, initialSeoTitle, initialSeoDescription]);

  // Notify parent of changes
  useEffect(() => {
    if (onSeoChange) {
      onSeoChange({
        seoTitle,
        seoDescription: metaDescription,
        focusKeyword,
      });
    }
  }, [seoTitle, metaDescription, focusKeyword, onSeoChange]);

  // Strip HTML tags from content
  const stripHtml = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Calculate keyword density
  const calculateKeywordDensity = (text: string, keyword: string): number => {
    if (!keyword) return 0;
    const words = text.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    return (keywordCount / words.length) * 100;
  };

  // Generate URL slug
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (!focusKeyword) {
      setChecks([]);
      setScore(0);
      return;
    }

    const plainContent = stripHtml(content);
    const wordCount = countWords(plainContent);
    const keywordDensity = calculateKeywordDensity(plainContent, focusKeyword);
    const slug = generateSlug(title);
    const firstParagraph = plainContent.substring(0, 300);

    const newChecks: SEOCheck[] = [
      {
        name: "Focus Keyword in SEO Title",
        passed: seoTitle.toLowerCase().includes(focusKeyword.toLowerCase()),
        message: seoTitle.toLowerCase().includes(focusKeyword.toLowerCase())
          ? "Focus keyword found in SEO title"
          : "Add focus keyword to SEO title"
      },
      {
        name: "SEO Title Length",
        passed: seoTitle.length >= 50 && seoTitle.length <= 60,
        message: `SEO title is ${seoTitle.length} characters (optimal: 50-60)`
      },
      {
        name: "Focus Keyword in Meta Description",
        passed: metaDescription.toLowerCase().includes(focusKeyword.toLowerCase()),
        message: metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())
          ? "Focus keyword found in meta description"
          : "Add focus keyword to meta description"
      },
      {
        name: "Meta Description Length",
        passed: metaDescription.length >= 150 && metaDescription.length <= 160,
        message: `Meta description is ${metaDescription.length} characters (optimal: 150-160)`
      },
      {
        name: "Focus Keyword in URL",
        passed: slug.includes(focusKeyword.toLowerCase().replace(/\s+/g, '-')),
        message: slug.includes(focusKeyword.toLowerCase().replace(/\s+/g, '-'))
          ? "Focus keyword found in URL slug"
          : "Add focus keyword to article title for better URL"
      },
      {
        name: "Focus Keyword in First Paragraph",
        passed: firstParagraph.toLowerCase().includes(focusKeyword.toLowerCase()),
        message: firstParagraph.toLowerCase().includes(focusKeyword.toLowerCase())
          ? "Focus keyword found in first paragraph"
          : "Add focus keyword to the first paragraph"
      },
      {
        name: "Keyword Density",
        passed: keywordDensity >= 0.5 && keywordDensity <= 2.5,
        message: `Keyword density is ${keywordDensity.toFixed(2)}% (optimal: 0.5-2.5%)`
      },
      {
        name: "Content Length",
        passed: wordCount >= 300,
        message: `Content has ${wordCount} words (minimum: 300)`
      },
      {
        name: "H2 Headings Present",
        passed: content.includes("<h2>") || content.includes("<h2 "),
        message: content.includes("<h2>") || content.includes("<h2 ")
          ? "H2 headings found in content"
          : "Add H2 headings to structure your content"
      },
      {
        name: "H3 Headings Present",
        passed: content.includes("<h3>") || content.includes("<h3 "),
        message: content.includes("<h3>") || content.includes("<h3 ")
          ? "H3 headings found in content"
          : "Add H3 headings for better content structure"
      },
      {
        name: "Images Present",
        passed: content.includes("<img"),
        message: content.includes("<img")
          ? "Images found in content"
          : "Add images to enhance your content"
      },
      {
        name: "Internal Links",
        passed: content.includes("<a"),
        message: content.includes("<a")
          ? "Links found in content"
          : "Add internal/external links to improve SEO"
      },
      {
        name: "Focus Keyword in Content",
        passed: plainContent.toLowerCase().includes(focusKeyword.toLowerCase()),
        message: plainContent.toLowerCase().includes(focusKeyword.toLowerCase())
          ? "Focus keyword found in content"
          : "Use focus keyword naturally in your content"
      },
      {
        name: "URL Structure",
        passed: slug.length > 0 && slug.length <= 75 && !slug.includes('--'),
        message: slug.length > 0 && slug.length <= 75 && !slug.includes('--')
          ? "URL structure is clean and SEO-friendly"
          : "Optimize title for a cleaner URL"
      },
      {
        name: "Excerpt Present",
        passed: excerpt.length >= 120,
        message: excerpt.length >= 120
          ? "Excerpt is well-written"
          : `Excerpt is ${excerpt.length} characters (minimum: 120)`
      }
    ];

    setChecks(newChecks);
    const passedCount = newChecks.filter(check => check.passed).length;
    const calculatedScore = Math.round((passedCount / newChecks.length) * 100);
    setScore(calculatedScore);
  }, [focusKeyword, seoTitle, metaDescription, title, content, excerpt]);

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card className="border-[#FF0000]/30">
      <CardHeader className="bg-[#FF0000]">
        <CardTitle className="text-white flex items-center justify-between">
          <span>Invitus SEO</span>
          <span className={`text-2xl font-bold ${getScoreColor()} bg-white px-3 py-1 rounded`}>
            {score}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Focus Keyword */}
        <div className="space-y-2">
          <Label htmlFor="focus-keyword">Focus Keyword</Label>
          <Input
            id="focus-keyword"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="Enter your focus keyword"
            className="border-[#FF0000]/30 focus:border-[#FF0000]"
          />
        </div>

        {/* SEO Title */}
        <div className="space-y-2">
          <Label htmlFor="seo-title">SEO Title</Label>
          <Input
            id="seo-title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Enter SEO title (50-60 characters)"
            className="border-[#FF0000]/30 focus:border-[#FF0000]"
            maxLength={70}
          />
          <p className="text-xs text-muted-foreground">{seoTitle.length}/60 characters</p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Input
            id="meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Enter meta description (150-160 characters)"
            className="border-[#FF0000]/30 focus:border-[#FF0000]"
            maxLength={170}
          />
          <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
        </div>

        {/* Score Progress */}
        {focusKeyword && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>SEO Score</span>
                <span className={getScoreColor()}>{score}%</span>
              </div>
              <Progress value={score} className={getProgressColor()} />
            </div>

            {/* Checks List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h4 className="font-semibold text-sm">SEO Checks ({checks.filter(c => c.passed).length}/{checks.length})</h4>
              {checks.map((check, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded hover:bg-slate-50">
                  {check.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            {score < 80 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-800">Optimization Tips:</p>
                  <p className="text-yellow-700">Aim for 80%+ score before publishing. Address the failed checks above to improve your SEO.</p>
                </div>
              </div>
            )}
          </>
        )}

        {!focusKeyword && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Enter a focus keyword to start SEO analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitusSEO;
