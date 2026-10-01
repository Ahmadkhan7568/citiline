"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ShieldCheck, Copy, Check } from "lucide-react";

interface FbrQrCodeProps {
  qrData: string;
  irn: string;
  size?: number; // In pixels (default 96px ~ 1 inch on 96dpi screen)
  className?: string;
  showBadge?: boolean;
  showLogo?: boolean;
}

export default function FbrQrCode({
  qrData,
  irn,
  size = 96,
  className = "",
  showBadge = true,
  showLogo = true,
}: FbrQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrData && !irn) return;

    // Use PRAL pipe format or IRN verification URL
    const payload = qrData || `https://verify.fbr.gov.pk/verifyInvoice?irn=${irn}`;

    QRCode.toDataURL(payload, {
      width: size * 2,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setDataUrl(url))
      .catch((err) => {
        console.error("Failed to generate FBR QR code:", err);
      });
  }, [qrData, irn, size]);

  const handleCopyIrn = () => {
    if (!irn) return;
    navigator.clipboard.writeText(irn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        {/* QR Code Container styled for PRAL v1.12 compliance (1.0 x 1.0 inch) */}
        <div className="p-1.5 border-2 border-zinc-900 bg-white rounded-lg shadow-sm print:border-black print:p-0.5 print:shadow-none">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="FBR PRAL QR Verification Code"
              width={size}
              height={size}
              className="block"
              style={{ width: `${size}px`, height: `${size}px` }}
            />
          ) : (
            <div
              style={{ width: `${size}px`, height: `${size}px` }}
              className="flex items-center justify-center bg-zinc-100 text-[9px] text-zinc-500 font-mono text-center px-1"
            >
              Generating QR...
            </div>
          )}
        </div>

        {/* Official FBR Digital Invoicing System Logo Emblem (PRAL v1.12 Section 6) */}
        {showLogo && (
          <div className="flex flex-col items-center justify-center border-2 border-[#003876] rounded-md p-1.5 bg-white text-center w-24 select-none shadow-sm print:border-black print:shadow-none">
            <div className="w-full bg-[#003876] text-white py-0.5 px-1 rounded-sm flex items-center justify-center gap-1 print:bg-black">
              <span className="font-black text-[10px] tracking-tight">FBR</span>
              <span className="w-1.5 h-1.5 bg-[#48bb78] rounded-full inline-block" />
            </div>
            <div className="font-black text-[#003876] text-[11px] leading-tight tracking-wider uppercase mt-1 print:text-black">
              DIGITAL
            </div>
            <div className="bg-[#003876] text-white text-[6px] font-black uppercase tracking-widest px-1 py-0.5 rounded-sm mt-0.5 w-full print:bg-black">
              INVOICING SYSTEM
            </div>
            <div className="text-[6px] text-zinc-400 font-bold uppercase tracking-tighter mt-1 print:text-zinc-600">
              PRAL v1.12
            </div>
          </div>
        )}
      </div>

      {/* IRN Tag */}
      {irn && (
        <div
          onClick={handleCopyIrn}
          title="Click to copy FBR IRN"
          className="cursor-pointer group flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded text-[8px] font-black font-mono tracking-wider hover:bg-zinc-800 transition-colors print:bg-transparent print:text-black print:p-0 print:border-none"
        >
          <span>IRN: {irn}</span>
          {copied ? (
            <Check size={10} className="text-emerald-400" />
          ) : (
            <Copy size={10} className="opacity-40 group-hover:opacity-100 transition-opacity print:hidden" />
          )}
        </div>
      )}

      {/* FBR Compliance Badge */}
      {showBadge && (
        <div className="flex items-center gap-1 text-[8px] font-black tracking-widest text-zinc-500 uppercase mt-0.5 print:text-black">
          <ShieldCheck size={10} className="text-emerald-500 print:text-black" />
          <span>FBR PRAL VERIFIED</span>
        </div>
      )}
    </div>
  );
}
