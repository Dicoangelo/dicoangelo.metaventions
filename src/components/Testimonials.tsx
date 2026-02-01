"use client";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  source: string;
  sourceUrl: string;
}

interface TestimonialsProps {
  isLight: boolean;
}

const testimonials: Testimonial[] = [
  {
    quote: "Catalyst gave us the opportunity to connect meaningfully with partner leaders through deep, topic-driven discussions. It was an incredible experience.",
    author: "Dico Angelo",
    role: "Speaker",
    company: "Catalyst 2026",
    source: "Partner Ecosystem Conference",
    sourceUrl: "https://www.joincatalyst.com/catalyst26"
  },
  {
    quote: "Suger has been a game-changer for us, their platform has not only streamlined our marketplace management but also allowed us to grow our cloud partnerships with AWS and Azure in ways we never thought possible. It's more than just a tool—it's become an extension of our team.",
    author: "Dico Angelo",
    role: "Cloud Alliance Operations Lead",
    company: "Contentsquare",
    source: "Suger.io Case Study",
    sourceUrl: "https://www.suger.io/blog/how-suger-help-contentsquare-grow-partnerships-without-limits"
  },
  {
    quote: "This workshop highlighted the importance of rapid prototyping and the benefits of working in a creative environment... The iterative process we followed enabled us to test and refine our ideas rapidly, collaboratively engaging with previous iterations to find the best solution.",
    author: "Dico Angelo",
    role: "Participant",
    company: "1159.ai Innovation Workshop",
    source: "Rapid Prototyping & Iterative Design",
    sourceUrl: "https://blog.1159.ai/the-art-and-science-of-innovation"
  },
  {
    quote: "While most companies think about marketplace ops last, Contentsquare invested in marketplace operations from early on in the journey. Their operations lead, Dico Angelo, transformed processes that took days into minutes.",
    author: "Partner Insight Newsletter",
    role: "Feature Article",
    company: "0 to $30M in 30 Months Case Study",
    source: "Operations Before Everything",
    sourceUrl: "https://newsletter.partnerinsight.io/p/0-to-30m-in-30-months-how-a-marketing"
  }
];

export default function Testimonials({ isLight }: TestimonialsProps) {
  return (
    <section id="testimonials" className={`py-20 px-6 ${isLight ? 'bg-gray-50' : 'bg-[#0a0a0a]'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Testimonials & Recognition</h2>
          <p className={isLight ? 'text-gray-600' : 'text-[#737373]'}>
            Featured in industry case studies and conferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border ${
                isLight
                  ? 'bg-white border-gray-200'
                  : 'bg-[#141414] border-[#262626]'
              } hover:border-[#6366f1] transition-all`}
            >
              {/* Quote */}
              <div className="mb-6">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-[#6366f1] mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className={`text-sm leading-relaxed ${
                  isLight ? 'text-gray-700' : 'text-[#a3a3a3]'
                }`}>
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="mb-4">
                <p className="font-semibold mb-1">{testimonial.author}</p>
                <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                  {testimonial.role}
                </p>
                <p className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-[#8a8a8a]'}`}>
                  {testimonial.company}
                </p>
              </div>

              {/* Source Link */}
              <a
                href={testimonial.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs flex items-center gap-1 ${
                  isLight ? 'text-gray-500 hover:text-gray-700' : 'text-[#525252] hover:text-[#737373]'
                } transition-colors`}
              >
                <span>Source: {testimonial.source}</span>
                <svg aria-hidden="true" className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Additional Recognition */}
        <div className="mt-12 text-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border ${
            isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'
          }`}>
            <svg aria-hidden="true" className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
              2x Microsoft Partner of the Year Contributor
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
