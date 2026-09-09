"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Download, ImageIcon, LockKeyhole } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";

type SourceImage = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type OptimizedImage = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
};

const size = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${size.format(bytes / 1024)} KB`;
  return `${size.format(bytes / (1024 * 1024))} MB`;
}

function outputExtension(format: string) {
  if (format === "image/jpeg") return "jpg";
  if (format === "image/png") return "png";
  return "webp";
}

export function ImageOptimizerTool() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [optimized, setOptimized] = useState<OptimizedImage | null>(null);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState("image/webp");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url);
    };
  }, [source]);

  useEffect(() => {
    return () => {
      if (optimized) URL.revokeObjectURL(optimized.url);
    };
  }, [optimized]);

  useEffect(() => {
    if (!source) {
      return;
    }

    let active = true;
    const image = new Image();
    image.onload = () => {
      const width = Math.max(1, Math.min(source.width, maxWidth || source.width));
      const height = Math.max(1, Math.round((source.height * width) / source.width));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        if (active) {
          setError("This browser could not prepare the image.");
          setProcessing(false);
        }
        return;
      }
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!active) return;
          if (!blob) {
            setError("This browser could not create the selected file type.");
            setProcessing(false);
            return;
          }
          setOptimized({
            blob,
            url: URL.createObjectURL(blob),
            width,
            height,
          });
          setProcessing(false);
        },
        format,
        format === "image/png" ? undefined : quality / 100,
      );
    };
    image.onerror = () => {
      if (!active) return;
      setError("The selected image could not be opened.");
      setProcessing(false);
    };
    image.src = source.url;

    return () => {
      active = false;
    };
  }, [format, maxWidth, quality, source]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      setProcessing(false);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Choose an image smaller than 25 MB.");
      setProcessing(false);
      return;
    }

    setOptimized(null);
    setProcessing(true);
    setError("");
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setSource({
        file,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setMaxWidth(Math.min(1600, image.naturalWidth));
      setError("");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("The selected image could not be opened.");
      setProcessing(false);
    };
    image.src = url;
  }

  const comparison = useMemo(() => {
    if (!source || !optimized) return null;
    const change = source.file.size - optimized.blob.size;
    const percent = source.file.size
      ? (Math.abs(change) / source.file.size) * 100
      : 0;
    return { change, percent };
  }, [optimized, source]);

  const downloadName = source
    ? `${source.file.name.replace(/\.[^.]+$/, "")}-web.${outputExtension(format)}`
    : `website-image.${outputExtension(format)}`;

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free website image optimizer"
        title={
          <>
            Make the photo smaller. <em>Keep the useful detail.</em>
          </>
        }
        description="Resize and compress a website image on this device. Compare the actual file sizes before downloading—because a different format is not automatically a smaller file."
        note="The image stays on this device. It is processed in your browser and is not uploaded or saved."
      />

      <div className="utility-grid image-tool-grid">
        <section
          className="tool-input-panel"
          aria-labelledby="image-input-title"
        >
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="image-input-title">Choose the image and output</h2>
              <p>The tool never enlarges a smaller source image.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label className="tool-field-wide file-drop">
              Original image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFile}
              />
              <span>PNG, JPEG, or WebP up to 25 MB.</span>
            </label>
            <label>
              Maximum width
              <select
                value={maxWidth}
                onChange={(event) => {
                  setOptimized(null);
                  setProcessing(true);
                  setError("");
                  setMaxWidth(Number(event.target.value));
                }}
                disabled={!source}
              >
                {[800, 1200, 1600, 2000, 2560].map((width) => (
                  <option key={width} value={width}>
                    {width}px
                  </option>
                ))}
                {source && ![800, 1200, 1600, 2000, 2560].includes(source.width) ? (
                  <option value={source.width}>Original ({source.width}px)</option>
                ) : null}
              </select>
            </label>
            <label>
              Output format
              <select
                value={format}
                onChange={(event) => {
                  if (source) {
                    setOptimized(null);
                    setProcessing(true);
                    setError("");
                  }
                  setFormat(event.target.value);
                }}
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </label>
            <label className="tool-field-wide range-field">
              Quality: {quality}%
              <input
                type="range"
                min="35"
                max="100"
                step="1"
                value={quality}
                onChange={(event) => {
                  setOptimized(null);
                  setProcessing(true);
                  setError("");
                  setQuality(Number(event.target.value));
                }}
                disabled={!source || format === "image/png"}
              />
              <span>
                PNG ignores the quality control. For photos, WebP around
                75–85% is often a useful starting point.
              </span>
            </label>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <p className="tool-accuracy-note">
            <LockKeyhole aria-hidden="true" /> Keep the original file. This
            creates a separate optimized copy.
          </p>
        </section>

        <section
          className="tool-output-panel"
          aria-labelledby="image-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="image-output-title">Compare before downloading</h2>
              <p>Look at both clarity and file size—not the percentage alone.</p>
            </div>
          </div>

          {source && optimized ? (
            <>
              <div className="optimized-preview">
                {/* Blob URLs cannot use the Next image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optimized.url} alt="Optimized image preview" />
              </div>
              <div className="image-comparison" aria-live="polite">
                <div>
                  <span>Original</span>
                  <strong>{fileSize(source.file.size)}</strong>
                  <small>
                    {source.width} × {source.height}px
                  </small>
                </div>
                <div>
                  <span>New file</span>
                  <strong>{fileSize(optimized.blob.size)}</strong>
                  <small>
                    {optimized.width} × {optimized.height}px
                  </small>
                </div>
                <div className={comparison && comparison.change >= 0 ? "is-saving" : "is-larger"}>
                  <span>{comparison && comparison.change >= 0 ? "Smaller by" : "Larger by"}</span>
                  <strong>{comparison ? `${comparison.percent.toFixed(1)}%` : "—"}</strong>
                  <small>
                    {comparison ? fileSize(Math.abs(comparison.change)) : ""}
                  </small>
                </div>
              </div>
              {comparison && comparison.change < 0 ? (
                <p className="tool-inline-warning">
                  This version is larger than the original. Try WebP, lower the
                  quality, reduce the width, or keep the original.
                </p>
              ) : null}
              <a
                className="button utility-download"
                href={optimized.url}
                download={downloadName}
              >
                <Download aria-hidden="true" /> Download {downloadName}
              </a>
            </>
          ) : (
            <div className="tool-empty-preview">
              <ImageIcon aria-hidden="true" />
              <p>
                {processing
                  ? "Preparing the optimized image…"
                  : "Choose an image to see the real before-and-after size."}
              </p>
            </div>
          )}

          <p className="tool-accuracy-note">
            This browser conversion removes most embedded metadata. Compare the
            downloaded image visually before replacing anything on a website.
          </p>
        </section>
      </div>
    </div>
  );
}
