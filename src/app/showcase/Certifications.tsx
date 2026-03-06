"use client";

import { certifications } from "./data";

interface CertificationsProps {
  isLight: boolean;
}

export function Certifications({ isLight }: CertificationsProps) {
  const awsCerts = certifications.filter(
    (c) => c.startsWith("AWS") || c.includes("Cloud Practitioner") || c.includes("Solutions Architect") || c.includes("Cloud Economics")
  );
  const microsoftCerts = certifications.filter(
    (c) => c.startsWith("Azure") || c.startsWith("Microsoft")
  );
  const otherCerts = certifications.filter(
    (c) => !awsCerts.includes(c) && !microsoftCerts.includes(c)
  );

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">
          Certifications
          <span className={`ml-3 text-base font-normal ${
            isLight ? "text-gray-400" : "text-[#525252]"
          }`}>
            {certifications.length} total
          </span>
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AWS */}
          <div
            className={`rounded-xl border p-6 ${
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#141414] border-[#262626]"
            }`}
          >
            <h4 className="text-lg font-bold text-amber-500 mb-4">
              AWS ({awsCerts.length})
            </h4>
            <ul className="space-y-2">
              {awsCerts.map((cert) => (
                <li
                  key={cert}
                  className={`flex items-start gap-2 text-sm ${
                    isLight ? "text-gray-700" : "text-[#d4d4d4]"
                  }`}
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          {/* Microsoft / Azure */}
          <div
            className={`rounded-xl border p-6 ${
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#141414] border-[#262626]"
            }`}
          >
            <h4 className="text-lg font-bold text-cyan-500 mb-4">
              Microsoft ({microsoftCerts.length})
            </h4>
            <ul className="space-y-2">
              {microsoftCerts.map((cert) => (
                <li
                  key={cert}
                  className={`flex items-start gap-2 text-sm ${
                    isLight ? "text-gray-700" : "text-[#d4d4d4]"
                  }`}
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>

            {otherCerts.length > 0 && (
              <>
                <h4 className="text-lg font-bold text-green-500 mt-6 mb-4">
                  Other ({otherCerts.length})
                </h4>
                <ul className="space-y-2">
                  {otherCerts.map((cert) => (
                    <li
                      key={cert}
                      className={`flex items-start gap-2 text-sm ${
                        isLight ? "text-gray-700" : "text-[#d4d4d4]"
                      }`}
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
